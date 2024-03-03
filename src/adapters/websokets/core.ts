import {
    TradeInstructionType,
    TradeSequenceNameType,
    TradeSequenceWithPredictType,
    TradeSequenceType
} from "../../types/sequences";
import {orderAction} from "../../common/common";
import {BinanceService} from "../../application/binance-service";
import {MarketUpdateDataType} from "../../types/web-soket-binance/output";
import {askOrBid} from "../../services/utils/utils";
import {BinanceAdapter} from "../http/binance-adapter";
import {appSettings} from "../../settings/settings";
import {LogToFile} from "../../common/utils/log-to-file";
import {Logger} from "../../common/utils/logger";


export type TradeCoreStatus = "run" | "stop"
export const TRADE_CORE_STATUSES: { [T: string]: TradeCoreStatus } = {
    run: "run",
    stop: "stop",
}

const _100_PERCENT: 100 = 100

const thresholdValue = +appSettings.binance.params.thresholdValue;
const stopThresholdValue = +appSettings.binance.params.stopThresholdValue
const resultsLog = new LogToFile("./logs/", "results.log")
export class TradeCore {
    private commissionAmount: number;
    private startAmount: number;
    private symbolsDataSet: any;
    private sequencesDataSet: TradeSequenceType[];
    private flag = true

    private _status: TradeCoreStatus = TRADE_CORE_STATUSES.run;
    private instructionsName: TradeSequenceNameType[] = ["firstSymbol", "secondSymbol", "thirdSymbol"]
    // LOGGER
    private tradeLogger
    private eventLogger
    constructor(commissionAmount: number,
                startAmount: number,
                symbolsDataSet: any,
                sequencesDataSet: any) {
        this.commissionAmount = commissionAmount
        this.startAmount = startAmount
        this.symbolsDataSet = symbolsDataSet
        this.sequencesDataSet = sequencesDataSet
        // LOGGER
        this.tradeLogger = new Logger("./logs/tradeLogs.log")
        this.tradeLogger.flushFile()
        this.eventLogger = new Logger("./logs/eventsLogs.log")
        this.eventLogger.flushFile()
    }

    async onDataUpdate(marketData: MarketUpdateDataType[]) {
        const logId = +(new Date()) // LOGGER

        this.updateSymbolsDataSet(marketData);
        this.updateSequencesDataSet();
        const matches: TradeSequenceWithPredictType[] = this.sequencesDataSet
            .map((el: TradeSequenceType) => {
               return  this.predictTradeResult(el)
            })
            .sort((a: any, b: any) => b.profiTReal - a.profiTReal)
            .filter((el: any) => el.profitInBase > thresholdValue && el.profitInBase < 5 && el.profitInBase !== null)

        if (matches.length > 0 ){
            if (this.flag) {
                this.flag = false
                const sequence: TradeSequenceWithPredictType = matches[0]
                this.tradeLogger.startNewLog(logId) // LOGGER
                this.eventLogger.startNewLog(logId) // LOGGER
                this.tradeLogger.writeToLog("foundSequence", sequence) // LOGGER

              //  await new Promise(resolve => setTimeout(resolve, 200));
                const correctedSequence: TradeSequenceWithPredictType = await this.correctTradeResult(sequence)
                this.tradeLogger.writeToLog("correctedSequence", correctedSequence) // LOGGER

                const correctedStartAmount = this.correctStartAmount(correctedSequence, this.startAmount)
                this.tradeLogger.writeToLog("corrected Start Amount - ", correctedStartAmount.startAmount)//LOGGER
                this.tradeLogger.writeToLog("corrected result - ", correctedStartAmount.result)//LOGGER
                console.log("corrected Start Amount", correctedStartAmount)//LOGGER

                if (correctedSequence.profitInBase > thresholdValue
                    && (+correctedStartAmount.result - (+correctedStartAmount.startAmount))>0.01
                    && +correctedStartAmount.startAmount> 10
                ) {

                    this.startAmount = +correctedStartAmount.startAmount
                    await this.doTradeSequence(correctedSequence)
                    const amount = await BinanceAdapter.getCurrencyBalance("USDT");

                    if (+amount < +stopThresholdValue) {
                        console.log("trading stop by stopThresholdValue")
                        this._status = TRADE_CORE_STATUSES.stop
                    }
                    this.tradeLogger.writeToLog("resultAmount", amount) // LOGGER
                    this.eventLogger.writeToLog("resultAmount", amount)//LOGGER

                    this.tradeLogger.writeToLog("result", "success")//LOGGER
                    this.eventLogger.writeToLog("result", "success")//LOGGER

                    console.log("event id - " + logId + " | success | " + "balance - " + amount);
                    this.flag = true
                } else {
                    this.tradeLogger.writeToLog("result", "wrong sequence")//LOGGER
                    this.eventLogger.writeToLog("result", "wrong sequence")//LOGGER
                    console.log("event id - " + logId + " | wrong sequence | ");
                }
                this.eventLogger.writeDownLogToFile() //LOGGER
                this.tradeLogger.writeDownLogToFile() //LOGGER
                this.flag = true
            }
        }
    }

    async doTradeSequence(sequence: TradeSequenceType) {
        let amount: number = this.startAmount
        for (let i = 0; i < this.instructionsName.length; i++) {
            const instructionName: TradeSequenceNameType = this.instructionsName[i]

            this.tradeLogger.writeToLog("instruction-" + (i + 1), sequence[instructionName]) // LOGGER
            this.tradeLogger.writeToLog("instruction_" + (i + 1) + "_amount", amount) // LOGGER

            if (this._status === TRADE_CORE_STATUSES.run) {
                const result = await this.doTradeInstruction(sequence[instructionName], amount);
                let fills = +result.executedQty
                if (sequence[instructionName].action === orderAction.sell) fills = +result.cummulativeQuoteQty;
                amount = +(fills - (fills / _100_PERCENT * this.commissionAmount)).toFixed(4)

                this.tradeLogger.writeToLog("instruction_" + (i + 1) + "_result", result) // LOGGER
                this.tradeLogger.writeToLog("instruction_" + (i + 1) + "_executedQty", fills) // LOGGER

                // if quick calculating will entail error with quality amount use string below:
                // const amount = await BinanceAdapter.getCurrencyBalance(sequence.secondSymbol.currentCurrency);
            }
        }
    };

    async doTradeInstruction(instruction: TradeInstructionType, amount: number) {

        const currentCurrency = instruction.currentCurrency
        const updSymbolsDataSet = this.symbolsDataSet
        let targetCurrency

        const separatedSymbol = instruction.symbol.split("/")
        if (separatedSymbol[0] === currentCurrency) targetCurrency = separatedSymbol[1]
        else targetCurrency = separatedSymbol[0]

        const result = await BinanceService.createOrder(currentCurrency, targetCurrency, amount, updSymbolsDataSet)

        if (result.type === "error") {
            console.log("trading stop doTradeInstruction error")
            this.status = TRADE_CORE_STATUSES.stop
            console.log(result.content)
        }
        return result.content
    };

    updateSymbolsDataSet(marketData: MarketUpdateDataType[]) {
        const NewSymbolsDataSet = {...this.symbolsDataSet};
        marketData.forEach((el: MarketUpdateDataType) => {
            for (let i = 1; i < 10; i++) {
                if (NewSymbolsDataSet[this.addSlash(el.symbol, i)]) {
                    NewSymbolsDataSet[this.addSlash(el.symbol, i)].bid = el.bidPrice;
                    NewSymbolsDataSet[this.addSlash(el.symbol, i)].ask = el.askPrice
                    NewSymbolsDataSet[this.addSlash(el.symbol, i)].priceChange24Per = el.priceChange24Per
                }
            }
        });

        this.symbolsDataSet = NewSymbolsDataSet
    }

    updateSequencesDataSet() {
        const newSequencesDataSet: TradeSequenceType[] = [...this.sequencesDataSet]
        newSequencesDataSet.forEach((el: TradeSequenceType) => {
            el.firstSymbol.price = this.symbolsDataSet[el.firstSymbol.symbol][askOrBid(el.firstSymbol.action)];
            el.secondSymbol.price = this.symbolsDataSet[el.secondSymbol.symbol][askOrBid(el.secondSymbol.action)];
            el.thirdSymbol.price = this.symbolsDataSet[el.thirdSymbol.symbol][askOrBid(el.thirdSymbol.action)];
            el.firstSymbol.priceChange24Per = this.symbolsDataSet[el.firstSymbol.symbol].priceChange24Per;
            el.secondSymbol.priceChange24Per = this.symbolsDataSet[el.secondSymbol.symbol].priceChange24Per;
            el.thirdSymbol.priceChange24Per = this.symbolsDataSet[el.thirdSymbol.symbol].priceChange24Per;
        });
        this.sequencesDataSet = newSequencesDataSet;
    }

    predictTradeResult(sequence: TradeSequenceType|TradeSequenceWithPredictType): TradeSequenceWithPredictType {
        const commissionRatio = +((_100_PERCENT - this.commissionAmount) / _100_PERCENT).toFixed(4)
        let isAllow = true;

        // calculate prediction for sequence trade in base
        let expectedResultInBase: number | null = _100_PERCENT;
        let expectedResult: number | null = this.startAmount;
        expectedResultInBase = (this.calculateOrderResult(expectedResultInBase, sequence.firstSymbol.action, +sequence.firstSymbol.price!))! * commissionRatio;
        expectedResultInBase = (this.calculateOrderResult(expectedResultInBase, sequence.secondSymbol.action, +sequence.secondSymbol.price!))! * commissionRatio;
        expectedResultInBase = (this.calculateOrderResult(expectedResultInBase, sequence.thirdSymbol.action, +sequence.thirdSymbol.price!))! * commissionRatio;

        for (let i = 0; i < this.instructionsName.length; i++) {
            const instructionName: TradeSequenceNameType = this.instructionsName[i]
            if (sequence[instructionName].action === "buy") {
                if (expectedResult && expectedResult < +sequence[instructionName].filters.minNotional) isAllow = false
            } else {
                if (expectedResult && expectedResult < +sequence[instructionName].filters.minQty) isAllow = false
            }
            expectedResult = (this.calculateOrderResult(expectedResult, sequence[instructionName].action, +sequence[instructionName].price!))! * commissionRatio;
        }


        if (expectedResultInBase) {
            expectedResultInBase = expectedResultInBase - (+_100_PERCENT);
        }
        if (expectedResult) {
            expectedResult = expectedResult - (this.startAmount);
        }

        return {
            ...sequence,
            profitInBase: expectedResultInBase,
            profitReal: expectedResult,
            isAllow: isAllow,
        };
    }

    async correctTradeResult(sequence: TradeSequenceWithPredictType): Promise<TradeSequenceWithPredictType> {
        const correctedSequence: TradeSequenceType = {
            firstSymbol:{...sequence.firstSymbol},
            secondSymbol:{...sequence.secondSymbol},
            thirdSymbol:{...sequence.thirdSymbol},
        }
        const symbolsForRequest = []
        for (let i = 0; i < this.instructionsName.length; i++) {
            symbolsForRequest.push(correctedSequence[this.instructionsName[i]].symbol.replace("/", ""))
       }
        const correctionDataArray = await BinanceAdapter.getSymbolsInfo(symbolsForRequest)

        for (let i = 0; i < this.instructionsName.length; i++) {
            const instructionName: TradeSequenceNameType = this.instructionsName[i]
            const symbol = correctedSequence[instructionName].symbol.replace("/","")
            const symbolData = correctionDataArray.find((el:any)=>el.symbol===symbol)
            correctedSequence[instructionName].price = +(symbolData[askOrBid(correctedSequence[instructionName].action) + "Price"]);
            correctedSequence[instructionName].actionQty = +(symbolData[askOrBid(correctedSequence[instructionName].action) + "Qty"]);
            correctedSequence[instructionName].actionQtyInQuote = +correctedSequence[instructionName].actionQty! * +correctedSequence[instructionName].price!;
            correctedSequence[instructionName].lastPriceChange = +symbolData.priceChangePercent;
            correctedSequence[instructionName].lastQuantity = +symbolData.lastQty;
        }

        return this.predictTradeResult(correctedSequence)
    }

    correctStartAmount  (sequence: any, start: number) {
        let startAmount = start

        let _1StartAmount = startAmount
        let _1EndAmount = (this.calculateOrderResult(_1StartAmount, sequence.firstSymbol.action, sequence.firstSymbol.price))! * 0.999
        let _2StartAmount = _1EndAmount
        let _2EndAmount = (this.calculateOrderResult(_2StartAmount, sequence.secondSymbol.action, sequence.secondSymbol.price))! * 0.999
        let _3StartAmount = _2EndAmount
        let _3EndAmount = (this.calculateOrderResult(_3StartAmount, sequence.thirdSymbol.action, sequence.thirdSymbol.price))! * 0.999
console.log("_3EndAmount " + _3EndAmount)

        // in 3rd instruction current-currency always is 2nd instructions end-trade currency therefore if 3th instruction
        // current-currency has index = 0 then we accept baseQty as actual amount before trade this
        let _3StartAmountReal = +sequence.thirdSymbol.actionQty
        // Available amount for trade 3-symbol in current-currency if current-currency is base asset
        if (sequence.thirdSymbol.symbol.split("/")[1] === sequence.thirdSymbol.currentCurrency) {
            _3StartAmountReal = +sequence.thirdSymbol.actionQtyInQuote
            // Available amount for trade 3-symbol in current-currency if current-currency is quote asset
        }

        // in 3rd instruction current-currency always is 2nd instructions end-trade currency therefore if 3th instruction
        // current-currency has index = 0 then we accept baseQty as actual amount before trade this
        let _2StartAmountReal = +sequence.secondSymbol.actionQty
        // Available amount for trade 3-symbol in current-currency if current-currency is base asset
        if (sequence.secondSymbol.symbol.split("/")[1] === sequence.secondSymbol.currentCurrency) {
            _2StartAmountReal = +sequence.secondSymbol.actionQtyInQuote
            // Available amount for trade 3-symbol in current-currency if current-currency is quote asset
        }

        // in 3rd instruction current-currency always is 2nd instructions end-trade currency therefore if 3th instruction
        // current-currency has index = 0 then we accept baseQty as actual amount before trade this
        let _1StartAmountReal = +sequence.firstSymbol.actionQty
        // Available amount for trade 3-symbol in current-currency if current-currency is base asset
        if (sequence.firstSymbol.symbol.split("/")[1] === sequence.firstSymbol.currentCurrency) {
            _1StartAmountReal = +sequence.firstSymbol.actionQtyInQuote
            // Available amount for trade 3-symbol in current-currency if current-currency is quote asset
        }

        if (_3StartAmount > _3StartAmountReal) {
            _2EndAmount = _3StartAmountReal
            _2StartAmount = this.calculateOrderResultReverse(_2EndAmount, sequence.secondSymbol.action, sequence.secondSymbol.price)! / 0.999
        }

        _1EndAmount=_2StartAmount
        if (_2StartAmount > _2StartAmountReal) {
            _1EndAmount = _2StartAmountReal
        }
        _1StartAmount = this.calculateOrderResultReverse(_1EndAmount, sequence.firstSymbol.action, sequence.firstSymbol.price)! / 0.999

        startAmount = Math.floor(_1StartAmount)
        if (_1StartAmount > _1StartAmountReal) {
            startAmount = Math.floor(_1StartAmountReal)
        }

        _1StartAmount = startAmount
        _1EndAmount = (this.calculateOrderResult(_1StartAmount, sequence.firstSymbol.action, sequence.firstSymbol.price))! * 0.999
        _2StartAmount = _1EndAmount
        _2EndAmount = (this.calculateOrderResult(_2StartAmount, sequence.secondSymbol.action, sequence.secondSymbol.price))! * 0.999
        _3StartAmount = _2EndAmount
        _3EndAmount = (this.calculateOrderResult(_3StartAmount, sequence.thirdSymbol.action, sequence.thirdSymbol.price))! * 0.999

        return {startAmount: startAmount, result: _3EndAmount}
    }


    calculateOrderResult(target: number | null, act: string, price: string | number | null) {
        if (target !== null) {
            if (price !== null) {
                switch (act) {
                    case "buy":
                        return (target! / +price);
                    case "sell":
                        return (target! * +price);
                    default:
                        return null;
                }
            }
        }
        return null;
    };

    calculateOrderResultReverse (target: any, act: any, price: any) {

        if (target !== null) {
            if (price !== null) {
                switch (act) {
                    case "buy":
                        return (target * +price);
                    case "sell":
                        return (target / +price);
                    default:
                        return null;
                }
            }
        }
        return null;
    };

    set status(status: TradeCoreStatus) {
        this._status = status
    }

    addSlash(symbol: string, pos: number) {
        return symbol.slice(0, pos) + "/" + symbol.slice(pos);
    }
}

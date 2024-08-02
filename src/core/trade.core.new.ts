import {
    TradeInstructionType,
    TradeSequenceNameType,
    TradeSequenceType,
    TradeSequenceWithPredictType
} from "../types/sequences";
import {orderAction} from "../common/common";
import {MarketUpdateDataType} from "../types/web-soket-binance/output";
import {askOrBid} from "../services/utils/utils";
import {appSettingsOld} from "../settings/settings";
import {LogToFile} from "../common/utils/log-to-file";
import {inject, injectable} from "inversify";
import {appSettings} from "../index";
import {SymbolsDataSet} from "../services/classes/symbols.data.set";
import {SequencesDataSet} from "../services/classes/sequences.data.set";
import {TYPE} from "../composition.root";
import {MarketHttpAdapterInterface} from "../adapters/http/interfaces/market.http.adapter.interface";
import {IMarketService} from "../application/market.service.interface";


export type TradeCoreStatus = "run" | "stop"
export const TRADE_CORE_STATUSES: { [T: string]: TradeCoreStatus } = {
    run: "run",
    stop: "stop",
}

const _100_PERCENT: 100 = 100

let thresholdValue = +appSettingsOld.binance.params.thresholdValue;
let stopThresholdValue = +appSettingsOld.binance.params.stopThresholdValue
const resultsLog = new LogToFile("./logs/", "results.log")

@injectable()
export class TradeCoreNew {
    // Dependencies
    protected symbolsDataSet: SymbolsDataSet
    protected sequencesDataSet: SequencesDataSet
    protected marketService: IMarketService
    protected marketAdapter: MarketHttpAdapterInterface

    // States
    private tradeAllowed = true
    private _status: TradeCoreStatus = TRADE_CORE_STATUSES.run;
    private instructionsName: TradeSequenceNameType[] = ["_1_Instruction", "_2_Instruction", "_3_Instruction"]
    private startAmount: number = appSettings.startAmount

    constructor(@inject(SymbolsDataSet) symbolsDataSet: SymbolsDataSet,
                @inject(SequencesDataSet) sequencesDataSet: SequencesDataSet,
                @inject(TYPE.MarketHttpAdapter) marketAdapter: MarketHttpAdapterInterface,
                @inject(TYPE.MarketService) marketService: IMarketService,) {
        this.symbolsDataSet = symbolsDataSet
        this.sequencesDataSet = sequencesDataSet
        this.marketAdapter = marketAdapter
        this.marketService = marketService
    }

    catchMatches() {
        const matches: TradeSequenceWithPredictType[] = this.sequencesDataSet.get()
            .map((el: TradeSequenceType) => {
                return this.predictTradeResult(el)
            })
            .sort((a: any, b: any) => b.profiTReal - a.profiTReal)
            .filter((el: any) => el.profitInBase > thresholdValue && el.profitInBase < 5 && el.profitInBase !== null)

        return matches
    }


    // Use this method to subscribe to websocket
    async onUpdate(marketData: MarketUpdateDataType[]) {
        // update symbols and sequences data sets according new data
        this.symbolsDataSet.update(marketData);
        this.sequencesDataSet.update();
        // find matches according to the conditions
        const matches = this.catchMatches()

        // if matches had been found, and no restrictions to trade we are working with found matches
        if (matches.length > 0 && this._status === TRADE_CORE_STATUSES.run && this.tradeAllowed) {
            this.tradeAllowed = false  // block code below executing if it had been started to execute
            let sequence: TradeSequenceWithPredictType = matches[0] // take first sequence as the most suitable

            // correct expected result with fresh data if this flag is active in settings
            // use this for excluding short price fluctuations
            if (appSettings.excludeShortFluctuations) {
                sequence = await this.correctTradeResult(sequence)
            }

            // correct start amount according to available amounts in each sequence step
            let correctedAmounts = this.correctStartAmount(sequence, this.startAmount)

            // if profit after sequence will trade more then minimum allowed profit work this sequence as it is
            if (sequence.profitInBase > appSettings.thresholdValue) {
                // assign to start amount corrected start amount:
                //  this.startAmount = correctedAmounts.startAmount
                // then calculate new profit value based on available amounts to trade
                let correctedProfit: number = correctedAmounts.result - (correctedAmounts.startAmount)

                // clarify sequence with deeper Depth of Market if corrected start amount or expected profit is too small
                if (correctedAmounts.startAmount < appSettings.minStartAmount || correctedProfit < appSettings.thresholdValue) {
                    // define sequence's steps to clarify
                    const instructionsToClarify = correctedAmounts.correctedInstructionsNames

                    // clarify if there is anything to clarify
                    if (instructionsToClarify.length > 0) {
                        const sequenceCopy = {...sequence}

                        let symbolsToClarify = [] // create array of promises
                        for (let instruction of instructionsToClarify) {
                            const symbolToClarify = sequence[instruction].symbol.replace("/", "");
                            symbolsToClarify.push(this.marketService.getDepth(symbolToClarify))
                        }
                        const clarifiedSymbols = await Promise.all(symbolsToClarify)  // await api response

                        // update copy of the sequence for next checks
                        for (let i = 0; i < instructionsToClarify.length; i++) {
                            const side = askOrBid(sequenceCopy[instructionsToClarify[i]].action) + "s"
                            const newValues = this.clarify(clarifiedSymbols[i].content[side], 2)
                            sequenceCopy[instructionsToClarify[i]].price = newValues.averageSellPrice
                            sequenceCopy[instructionsToClarify[i]].actionQty = newValues.averageAmount
                            sequenceCopy[instructionsToClarify[i]].actionQtyInQuote = newValues.averageAmount * newValues.averageSellPrice
                        }

                        // correct start amount according to the deeper Depth of Market
                        const correctedAmountsAfterClarify = this.correctStartAmount(sequenceCopy, this.startAmount)

                        //calculate profit after clarify
                        const profitAfterClarify = (correctedAmountsAfterClarify.result - (correctedAmountsAfterClarify.startAmount))
                        // assign new values if  profit after clarify grater then minimum allowed profit
                        if (profitAfterClarify > appSettings.thresholdValue) {
                            correctedProfit = profitAfterClarify
                            sequence = sequenceCopy
                            this.startAmount = correctedAmountsAfterClarify.startAmount
                        }
                    }
                }

                // trade sequence if start amount or expected profit meet the parameters
                if (this.startAmount >= appSettings.minStartAmount && correctedProfit > appSettings.thresholdValue) {

                    // execute trade sequence in accordance to the trade mode
                    if (appSettings.tradeMode === "SPOT") {
                        await this.tradeSequenceOnSpot(sequence)
                    } else if (appSettings.tradeMode === "MARGIN") {
                        await this.tradeSequenceOnMargin(sequence)
                    }

                    // check balance and stop application if the lost after trading is too big
                    const amount = await this.marketAdapter.getCurrencyBalance(appSettingsOld.binance.params.startCurrency);
                    if (+amount < +stopThresholdValue) {
                        this._status = TRADE_CORE_STATUSES.stop
                        throw new Error("trading stop by stopThresholdValue")
                    }
                }
            }
            this.tradeAllowed = true  // set flag back to true after all
        }
    }


    async tradeSequenceOnSpot(sequence: TradeSequenceType) {
        let amount: number = appSettings.startAmount

        for (let instructionName of this.instructionsName) {

            console.log(instructionName, sequence[instructionName]) // LOGGER
            console.log(instructionName + "_amount", amount) // LOGGER

            if (this._status === TRADE_CORE_STATUSES.run) {
                const result = await this.tradeInstruction(sequence[instructionName], amount);
                let fills = +result.executedQty
                if (sequence[instructionName].action === orderAction.sell) fills = +result.cummulativeQuoteQty;
                amount = +(fills - (fills / _100_PERCENT * appSettings.commissionAmount)).toFixed(8)

                console.log(instructionName + "_result", result) // LOGGER
                console.log(instructionName + "_executedQty", fills) // LOGGER

                // if quick calculating will entail error with quality amount use string below:
                // const amount = await BinanceHttpAdapter.getCurrencyBalance(sequence._2_Instruction.currentCurrency);
            }
        }
    };

    async tradeSequenceOnMargin(sequence: TradeSequenceType) {
        let amount: number = appSettings.startAmount

        for (let i = 0; i < this.instructionsName.length; i++) {
            const instructionName: TradeSequenceNameType = this.instructionsName[i]

            console.log("instruction_" + (i + 1), sequence[instructionName]) // LOGGER
            console.log("instruction_" + (i + 1) + "_amount", amount) // LOGGER

            if (this._status === TRADE_CORE_STATUSES.run) {
                const result = await this.tradeInstruction(sequence[instructionName], amount);
                let fills = +result.executedQty
                if (sequence[instructionName].action === orderAction.sell) fills = +result.cummulativeQuoteQty;
                amount = +(fills - (fills / _100_PERCENT * appSettings.commissionAmount)).toFixed(8)

                console.log("instruction_" + (i + 1) + "_result", result) // LOGGER
                console.log("instruction_" + (i + 1) + "_executedQty", fills) // LOGGER

                // if quick calculating will entail error with quality amount use string below:
                // const amount = await BinanceHttpAdapter.getCurrencyBalance(sequence._2_Instruction.currentCurrency);
            }
        }
    };

    async tradeInstruction(instruction: TradeInstructionType, amount: number) {

        const currentCurrency = instruction.currentCurrency
        const updSymbolsDataSet = this.symbolsDataSet
        const separatedSymbol = instruction.symbol.split("/")

        let targetCurrency

        if (separatedSymbol[0] === currentCurrency) {
            targetCurrency = separatedSymbol[1]
        } else {
            targetCurrency = separatedSymbol[0]
        }

        const result = await this.marketService.createOrder(currentCurrency, targetCurrency, amount, updSymbolsDataSet)

        if (result.type === "error") {
            this.status = TRADE_CORE_STATUSES.stop
            throw new Error("trading stop by stopThresholdValue")
        }
        return result.content
    };




    async correctTradeResult(sequence: TradeSequenceWithPredictType): Promise<TradeSequenceWithPredictType> {
        const correctedSequence: TradeSequenceType = {
            _1_Instruction: {...sequence._1_Instruction},
            _2_Instruction: {...sequence._2_Instruction},
            _3_Instruction: {...sequence._3_Instruction},
        }

        const symbolsForRequest = []
        for (let i = 0; i < this.instructionsName.length; i++) {
            symbolsForRequest.push(correctedSequence[this.instructionsName[i]].symbol.replace("/", ""))
        }
        // TODO
        const correctionDataArray = await this.marketService.getSymbolsInfo(symbolsForRequest)

        for (let i = 0; i < this.instructionsName.length; i++) {
            const instructionName: TradeSequenceNameType = this.instructionsName[i]
            const symbol = correctedSequence[instructionName].symbol.replace("/", "")
            const symbolData = correctionDataArray.find((el: any) => el.symbol === symbol)
            correctedSequence[instructionName].price = +(symbolData[askOrBid(correctedSequence[instructionName].action) + "Price"]);
            correctedSequence[instructionName].actionQty = +(symbolData[askOrBid(correctedSequence[instructionName].action) + "Qty"]);
            correctedSequence[instructionName].actionQtyInQuote = +correctedSequence[instructionName].actionQty! * +correctedSequence[instructionName].price!;
            correctedSequence[instructionName].lastPriceChange = +symbolData.priceChangePercent;
            correctedSequence[instructionName].lastQuantity = +symbolData.lastQty;
        }

        return this.predictTradeResult(correctedSequence)
    }

    predictTradeResult(sequence: TradeSequenceType | TradeSequenceWithPredictType): TradeSequenceWithPredictType {
        const commissionRatio = +((_100_PERCENT - appSettings.commissionAmount) / _100_PERCENT).toFixed(8)
        let isAllow = true;

        // calculate prediction for sequence trade in base
        let expectedResultInBase: number | null = _100_PERCENT;
        let expectedResult: number | null = appSettings.startAmount;
        expectedResultInBase = (this.calculateOrderResult(expectedResultInBase, sequence._1_Instruction.action, +sequence._1_Instruction.price!))! * commissionRatio;
        expectedResultInBase = (this.calculateOrderResult(expectedResultInBase, sequence._2_Instruction.action, +sequence._2_Instruction.price!))! * commissionRatio;
        expectedResultInBase = (this.calculateOrderResult(expectedResultInBase, sequence._3_Instruction.action, +sequence._3_Instruction.price!))! * commissionRatio;

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
            expectedResult = expectedResult - (appSettings.startAmount);
        }

        return {
            ...sequence,
            profitInBase: expectedResultInBase,
            profitReal: expectedResult,
            isAllow: isAllow,
        };
    }
    correctStartAmount(sequence: any, start: number) {
        let startAmount = start
        let correctedInstructionsNames: Array<"_1_Instruction" | "_2_Instruction" | "_3_Instruction"> = []

        let _1StartAmount = startAmount
        let _1EndAmount = (this.calculateOrderResult(_1StartAmount, sequence._1_Instruction.action, sequence._1_Instruction.price))! * 0.999
        let _2StartAmount = _1EndAmount
        let _2EndAmount = (this.calculateOrderResult(_2StartAmount, sequence._2_Instruction.action, sequence._2_Instruction.price))! * 0.999
        let _3StartAmount = _2EndAmount
        let _3EndAmount = (this.calculateOrderResult(_3StartAmount, sequence._3_Instruction.action, sequence._3_Instruction.price))! * 0.999

        // in 3rd instruction current-currency always is 2nd instructions end-trade currency therefore if 3th instruction
        // current-currency has index = 0 then we accept baseQty as actual amount before trade this
        let _3StartAmountReal = +sequence._3_Instruction.actionQty
        // Available amount for trade 3-symbol in current-currency if current-currency is base asset
        if (sequence._3_Instruction.symbol.split("/")[1] === sequence._3_Instruction.currentCurrency) {
            _3StartAmountReal = +sequence._3_Instruction.actionQtyInQuote
            // Available amount for trade 3-symbol in current-currency if current-currency is quote asset
        }

        // in 3rd instruction current-currency always is 2nd instructions end-trade currency therefore if 3th instruction
        // current-currency has index = 0 then we accept baseQty as actual amount before trade this
        let _2StartAmountReal = +sequence._2_Instruction.actionQty
        // Available amount for trade 3-symbol in current-currency if current-currency is base asset
        if (sequence._2_Instruction.symbol.split("/")[1] === sequence._2_Instruction.currentCurrency) {
            _2StartAmountReal = +sequence._2_Instruction.actionQtyInQuote
            // Available amount for trade 3-symbol in current-currency if current-currency is quote asset
        }

        // in 3rd instruction current-currency always is 2nd instructions end-trade currency therefore if 3th instruction
        // current-currency has index = 0 then we accept baseQty as actual amount before trade this
        let _1StartAmountReal = +sequence._1_Instruction.actionQty
        // Available amount for trade 3-symbol in current-currency if current-currency is base asset
        if (sequence._1_Instruction.symbol.split("/")[1] === sequence._1_Instruction.currentCurrency) {
            _1StartAmountReal = +sequence._1_Instruction.actionQtyInQuote
            // Available amount for trade 3-symbol in current-currency if current-currency is quote asset
        }

        if (_3StartAmount > _3StartAmountReal) {
            _2EndAmount = _3StartAmountReal
            _2StartAmount = this.calculateOrderResultReverse(_2EndAmount, sequence._2_Instruction.action, sequence._2_Instruction.price)! / 0.999
            correctedInstructionsNames.push("_3_Instruction")
        }

        _1EndAmount = _2StartAmount
        if (_2StartAmount > _2StartAmountReal) {
            _1EndAmount = _2StartAmountReal
            correctedInstructionsNames.push("_2_Instruction")
        }
        _1StartAmount = this.calculateOrderResultReverse(_1EndAmount, sequence._1_Instruction.action, sequence._1_Instruction.price)! / 0.999

        startAmount = Math.floor(_1StartAmount)
        if (_1StartAmount > _1StartAmountReal) {
            startAmount = Math.floor(_1StartAmountReal)
            correctedInstructionsNames.push("_1_Instruction")
        }

        _1StartAmount = startAmount
        _1EndAmount = (this.calculateOrderResult(_1StartAmount, sequence._1_Instruction.action, sequence._1_Instruction.price))! * 0.999
        _2StartAmount = _1EndAmount
        _2EndAmount = (this.calculateOrderResult(_2StartAmount, sequence._2_Instruction.action, sequence._2_Instruction.price))! * 0.999
        _3StartAmount = _2EndAmount
        _3EndAmount = (this.calculateOrderResult(_3StartAmount, sequence._3_Instruction.action, sequence._3_Instruction.price))! * 0.999

        return {startAmount: +startAmount, result: +_3EndAmount, correctedInstructionsNames: correctedInstructionsNames}
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

    calculateOrderResultReverse(target: any, act: any, price: any) {

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


    clarify(arr: any[], depth: number) {
        let totalCost = 0
        let totalAmount = 0

        for (let i = 0; i < depth; i++) {
            totalAmount += +arr[i][1]
            totalCost += +arr[i][0] * +arr[i][1]
        }

        const averageSellPrice = totalCost / totalAmount

        return {
            averageAmount: +totalAmount.toFixed(8),
            averageSellPrice: +averageSellPrice.toFixed(8)
        }
    }
}

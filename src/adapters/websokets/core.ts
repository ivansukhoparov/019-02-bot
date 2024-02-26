import {TradeInstructionType, TradeSequenceNameType, TradeSequenceType} from "../../types/sequences";
import {orderAction} from "../../common/common";
import {BinanceService} from "../../application/binance-service";
import {MarketUpdateDataType} from "../../types/web-soket-binance/output";
import {askOrBid} from "../../services/utils/utils";
import {BinanceAdapter} from "../http/binance-adapter";
import {appSettings} from "../../settings/settings";
import {asyncLogCurrencyAmount} from "../../common/utils/logs";

export type TradeCoreStatus = "run" | "stop"
export const TRADE_CORE_STATUSES: { [T: string]: TradeCoreStatus } = {
    run: "run",
    stop: "stop",
}

const _100_PERCENT: 100 = 100

const thresholdValue = appSettings.binance.params.thresholdValue;
const stopThresholdValue = appSettings.binance.params.stopThresholdValue

export class TradeCore {
    private commissionAmount: number;
    private startAmount: number;
    private symbolsDataSet: any;
    private sequencesDataSet: TradeSequenceType[];

    private _status: TradeCoreStatus = TRADE_CORE_STATUSES.run;
    private instructionsName: TradeSequenceNameType[] = ["firstSymbol", "secondSymbol", "thirdSymbol"]

    constructor(commissionAmount: number,
                startAmount: number,
                symbolsDataSet: any,
                sequencesDataSet: any) {
        this.commissionAmount = commissionAmount
        this.startAmount = startAmount
        this.symbolsDataSet = symbolsDataSet
        this.sequencesDataSet = sequencesDataSet
    }

    async onDataUpdate(marketData: MarketUpdateDataType[]) {
        this.updateSymbolsDataSet(marketData);
        this.updateSequencesDataSet();
        const matches = this.sequencesDataSet
            .map( (el)=>{
               return  this.predictTradeResult(el)
            })
            .sort((a: any, b: any) => b.profiTReal - a.profiTReal)
            .filter((el: any) => el.profitReal > thresholdValue && el.profiTReal < 5 && el.profitReal !== null)
        if (matches.length > 0 ){
            await  this.doTradeSequence(matches[0])
            asyncLogCurrencyAmount("USDT")
        }
    }

    async doTradeSequence(sequence: TradeSequenceType) {
        let amount = this.startAmount

        for (let i = 0; i < this.instructionsName.length; i++) {
            const instructionName: TradeSequenceNameType = this.instructionsName[i]
            if (this._status === TRADE_CORE_STATUSES.run) {
                const result = await this.doTradeInstruction(sequence[instructionName], amount);

                let fills = result.executedQty
                if (sequence[instructionName].action === orderAction.sell) fills = result.cummulativeQuoteQty;

                amount = fills - (fills/_100_PERCENT * this.commissionAmount)

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

        if (result.type === "error") this.status = TRADE_CORE_STATUSES.stop
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

    predictTradeResult(sequence: any): TradeSequenceType {
        const commissionRatio = (_100_PERCENT - this.commissionAmount)/_100_PERCENT
        let isAllow = true;

        // calculate prediction for sequence trade in base
        let expectedResultInBase: number | null;
        let expectedResult: number | null = this.startAmount;
        expectedResultInBase = (this.calculateOrderResult(_100_PERCENT, sequence.firstSymbol.action, sequence.firstSymbol.price))! * commissionRatio;
        expectedResultInBase = (this.calculateOrderResult(expectedResultInBase, sequence.secondSymbol.action, sequence.secondSymbol.price))! * commissionRatio;
        expectedResultInBase = (this.calculateOrderResult(expectedResultInBase, sequence.thirdSymbol.action, sequence.thirdSymbol.price))! * commissionRatio;

        for (let i = 0; i < this.instructionsName.length; i++) {
            const instructionName: TradeSequenceNameType = this.instructionsName[i]
            if (sequence[instructionName].action === "buy") {
                if (expectedResult && expectedResult < sequence[instructionName].filters.minNotional) isAllow = false
            } else {
                if (expectedResult && expectedResult < sequence[instructionName].filters.minQty) isAllow = false
            }
            expectedResult = (this.calculateOrderResult(expectedResult, sequence[instructionName].action, sequence[instructionName].price))! * commissionRatio;
        }


        if (expectedResultInBase) {
            expectedResultInBase = expectedResultInBase - 100;
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

    async correctionTradeResult(sequence: any): Promise<TradeSequenceType> {
        const correctedSequence: TradeSequenceType = {...sequence}
        for (let i = 0; i < this.instructionsName.length; i++) {
            const instructionName: TradeSequenceNameType = this.instructionsName[i]

            const correctedData = await BinanceAdapter.getSymbolInfo(correctedSequence[instructionName].symbol.replace("/", ""))
            correctedSequence[instructionName].price = correctedData[askOrBid(correctedSequence[instructionName].action) + "Price"];
        }

        return this.predictTradeResult(correctedSequence)
    }

    calculateOrderResult(target: number | null, act: string, price: string | null) {
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

    set status(status: TradeCoreStatus) {
        this._status = status
    }

    addSlash(symbol: string, pos: number) {
        return symbol.slice(0, pos) + "/" + symbol.slice(pos);
    }
}

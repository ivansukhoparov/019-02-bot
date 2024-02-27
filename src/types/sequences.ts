import {OrderSide} from "./fetch-binance/input";


export type TradeInstructionType ={
    symbol: string
    currentCurrency:string
    action: OrderSide
    price: string|null
    priceChange24Per: number | null
    lastPriceChange?: number | null
    lastQuantity?: number|null
    filters: {
        minNotional:string
        minQty: string
        minQtyMarket: string
        stepSize: string
        stepSizeMarket: string

    }
}

export type TradeInstructionWithPredictType = TradeInstructionType & {
    profitInBase: number
    profitReal: number
    isAllow: boolean
}

export type TradeSequenceNameType = "firstSymbol" | "secondSymbol" | "thirdSymbol"

export type TradeSequenceType = {
    [U in TradeSequenceNameType]: TradeInstructionType|TradeInstructionWithPredictType;
};

export type TradeSequenceNameTypePredictType = TradeSequenceType & {
    profitInBase: number
    profitReal: number
    isAllow: boolean
}

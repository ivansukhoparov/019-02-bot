import {OrderSide} from "./fetch-binance/input";


export type TradeInstructionType ={
    symbol: string
    currentCurrency:string
    action: OrderSide
    price: string|number|null
    actionQty:number | null
    actionQtyInQuote: number | null
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

export type ddd = TradeInstructionType & {
    profitInBase: number
    profitReal: number
    isAllow: boolean
}

export type TradeSequenceNameType = "_1_Instruction" | "_2_Instruction" | "_3_Instruction"

export type TradeSequenceType = {
    [U in TradeSequenceNameType]: TradeInstructionType;
};

export type TradeSequenceWithPredictType = TradeSequenceType & {
    profitInBase: number
    profitReal: number
    isAllow: boolean
}

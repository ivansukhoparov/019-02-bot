import {OrderSide} from "./fetch-binance/input";


export type TradeInstructionType ={
    symbol: string
    currentCurrency:string
    action: OrderSide
    price: string|null
    filters: {
        minNotional:string
        minQty: string
        minQtyMarket: string
        stepSize: string
        stepSizeMarket: string

    }
}

export type TradeSequenceType = {
    firstSymbol:  TradeInstructionType
    secondSymbol: TradeInstructionType
    thirdSymbol: TradeInstructionType
}

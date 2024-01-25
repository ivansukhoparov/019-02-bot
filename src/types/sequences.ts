import {OrderSide} from "./fetch-binance/input";


export type TradeInstructionType ={
    symbol: string
    currentCurrency:string
    action: OrderSide
    price: string|null
}

export type TradeSequenceType = {
    firstSymbol:  TradeInstructionType
    secondSymbol: TradeInstructionType
    thirdSymbol: TradeInstructionType
}

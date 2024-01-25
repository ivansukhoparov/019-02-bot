import {OrderSide, QuantityType} from "../types/fetch-binance/input";
import {BinanceAdapter} from "../adapters/http/binance-adapter";
import {TradeInstructionType, TradeSequenceType} from "../types/sequences";

const seq: TradeSequenceType = {
    firstSymbol: {symbol: 'BNBUSDT', currentCurrency: 'USDT', action: 'buy', price: null},
    secondSymbol: {symbol: 'MATICBNB', currentCurrency: 'BNB', action: 'buy', price: null},
    thirdSymbol: {symbol: 'MATICUSDT', currentCurrency: 'MATIC', action: 'sell', price: null}
}

const tradeInstruction: TradeInstructionType = seq.firstSymbol;

const tradeThis = async (instruction: TradeInstructionType) => {
    const symbol = instruction.symbol
    const side: OrderSide = instruction.action
    const quantityType: QuantityType = getQuantityType(instruction)
    const quantityAmount = 100
    await BinanceAdapter.placeOrder(symbol, quantityType, quantityAmount, side)

}

const getQuantityType = (tradeInstruction: TradeInstructionType): QuantityType => {
    return "quantity"

}


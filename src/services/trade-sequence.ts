import {OrderSide, QuantityType} from "../types/fetch-binance/input";
import {BinanceAdapter} from "../adapters/http/binance-adapter";
import {TradeInstructionType, TradeSequenceType} from "../types/sequences";

const seq: TradeSequenceType = {
    firstSymbol: {symbol: 'BNB/USDT', currentCurrency: 'USDT', action: 'buy', price: null},
    secondSymbol: {symbol: 'MATIC/BNB', currentCurrency: 'BNB', action: 'buy', price: null},
    thirdSymbol: {symbol: 'MATIC/USDT', currentCurrency: 'USDT', action: 'sell', price: null}
}

const tradeInstruction: TradeInstructionType = seq.firstSymbol;

export const tradeThis = async (instruction: TradeInstructionType) => {
    const symbol = instruction.symbol
    const side: OrderSide = instruction.action
    const {quantityCurrency, quantityType} = getQuantityType(instruction)
    const quantityAmount = await BinanceAdapter.getCurrencyBalance(quantityCurrency)

    return  BinanceAdapter.placeOrder(symbol, quantityType, quantityAmount, side)

}

const getQuantityType = (instruction: TradeInstructionType): {
    quantityCurrency: string,
    quantityType: QuantityType
} => {

    switch (instruction.action) {
        case "buy":
            return {
                quantityCurrency: getSymbolQuote(instruction.symbol),
                quantityType: "quoteOrderQty"
            };
        case "sell":
            return {
                quantityCurrency: getSymbolBase(instruction.symbol),
                quantityType: "quantity"
            };
    }
}


const getSymbolBase = (symbol: string) => {
    return symbol.split("/")[0]
}
const getSymbolQuote = (symbol: string) => {
    return symbol.split("/")[1]
}

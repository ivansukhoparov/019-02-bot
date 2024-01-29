import {BinanceAdapter} from "../adapters/http/binance-adapter";
import {OrderSide} from "../types/fetch-binance/input";
import {roundDownNumber} from "../services/trade-sequence";
import {orderAction, orderQuantity} from "../common/common";

export class BinanceService {

// this method received current currency, amount of it and target currency and create order
    private adapter: BinanceAdapter;
    public symbolsDataSet: any;

    constructor(symbolsDataSet: any) {
        this.adapter = new BinanceAdapter();
        this.symbolsDataSet = symbolsDataSet;
    }

    // 'PSG/TRY': {
    //     baseAsset: 'PSG',
    //     quoteAsset: 'TRY',
    //     bid: null,
    //     ask: null,
    //     filters: {
    //         minNotional: '10.00000000',
    //         minQty: '0.10000000',
    //         minQtyMarket: '0.00000000',
    //         stepSize: '0.10000000',
    //         stepSizeMarket: '0.10000000'
    //     }
    // }
    public async createOrder(currentCurrency: string, targetCurrency: string, amount?: number) {
        const {symbolName, action, quantityType}: any = this._getSymbol(currentCurrency, targetCurrency)
        const symbol = this.symbolsDataSet[symbolName]
        const side: OrderSide = action;

        const balance = await BinanceAdapter.getCurrencyBalance(currentCurrency);

        if (!amount || amount < +balance) {
            amount = +balance;
        }

        if (amount) {
            if (quantityType === orderQuantity.base) {
                amount = roundDownNumber(amount, symbol.filters.stepSize);
                const amountInQuote = amount*+symbol.ask;
                if (amountInQuote < symbol.filters.minNotional) {
                    throw new Error("Do not have anought amount, or enter grater amount")
                }
            } else if (quantityType === orderQuantity.quote) {
                if (amount < symbol.filters.minNotional) {
                    throw new Error("Do not have anought amount, or enter grater amount")
                }
            }

            return BinanceAdapter.placeOrder(symbolName, quantityType, amount, side);
        } else {
            throw new Error("currency does not exist, or can't get amount")
        }
    }

    public _getSymbol(currentCurrency: string, targetCurrency: string) {

        if (this.symbolsDataSet[currentCurrency + "/" + targetCurrency] !== undefined) {
            // At first check straight pair is exist and have property "ask" not equal null
            // For example we have ETH and want get USDT
            // ETH/USDT has found, and we must create sell order
            // and currency amount must be in base
            const symbol = currentCurrency + "/" + targetCurrency;
            const action = orderAction.sell;
            const quantityType = orderQuantity.base
            return {symbol, action, quantityType}
        } else if (this.symbolsDataSet[targetCurrency + "/" + currentCurrency] !== undefined) {
            // Then check reversed pair is exist and have property "ask" not equal null
            // For example we have USDT and want get ETH
            // ETH/USDT has found, and we must create buy order
            // and currency amount must be in quote
            const symbol = targetCurrency + "/" + currentCurrency;
            const action = orderAction.buy;
            const quantityType = orderQuantity.quote
            return {symbol, action, quantityType}
        } else {
            // Return null if don't have satisfy symbol
            throw new Error("Symbol does not exist");
        }
    }
}


// {
//     symbol: 'ZEN/ETH',
//     baseAsset: 'ZEN',
//     quoteAsset: 'ETH',
//     bid: null,
//     ask: null,
//     filters: {
//         minNotional: '0.00100000',
//         minQty: '0.01000000',
//         minQtyMarket: '0.00000000',
//         stepSize: '0.01000000',
//         stepSizeMarket: '0.01000000'
//     }
// }




import {ApiResponseType, OrderSide} from "../../types/fetch-binance/input";
import {orderAction, orderQuantity} from "./utils/common";
import {inject, injectable} from "inversify";
import {IMarketHttpAdapter} from "../interfaces/market.http.adapter.interface";
import {TYPE} from "../../composition.root";
import {IMarketService} from "../interfaces/market.service.interface";
import {roundDownNumber} from "./utils/round-down-number";

@injectable()
export class MarketService implements IMarketService {
    // Dependencies
    protected marketAdapter: IMarketHttpAdapter

    constructor(@inject("MarketHttpAdapter") marketAdapter: IMarketHttpAdapter) {
        this.marketAdapter = marketAdapter
    }


    // this method received current currency, amount of it and target currency and create order

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
    async createOrder(currentCurrency: string, targetCurrency: string, amount: number, symbolsDataSet: any): Promise<ApiResponseType> {
        const {
            symbolName,
            action,
            quantityType
        }: any = this._getSymbol(currentCurrency, targetCurrency, symbolsDataSet);
        const symbol = symbolsDataSet[symbolName];
        const side: OrderSide = action;
        // let amountInQuote
        if (quantityType === orderQuantity.base) {
            amount = roundDownNumber(+amount, +symbol.filters.stepSize);
            // amountInQuote = amount * +symbol.price;
            // if (amountInQuote < symbol.filters.minNotional) {
            // 	throw new Error("Don't have information about price");
            // }
        }
        // else if (quantityType === orderQuantity.quote) {
        // 	if (amount < symbol.filters.minNotional) {
        // 		throw new Error("enter grater amount");
        // 	}
        // }
        const totalAmount: number = +amount.toFixed(8)
        console.log("============= order info");
        console.log(symbolName, quantityType, totalAmount, side);
        console.log(symbol.filters);

        const result = await this.marketAdapter.placeOrder(symbolName, quantityType, totalAmount, side);
        console.log("============= ");
        console.log(result.type);
        console.log("============= order info - end");
        return result
    }

    async getSymbolsInfo(symbols: string[]):Promise<any>{
        return await this.marketAdapter.getSymbolsInfo(symbols)
    }
    async getSymbolInfo(symbol: string):Promise<any>{
        return await this.marketAdapter.getSymbolInfo(symbol)
    }

    async getDepth(symbol: string): Promise<any>{
        return this.marketAdapter.getDepth(symbol)
    }

    public _getSymbol(currentCurrency: string, targetCurrency: string, symbolsDataSet: any) {


        if (symbolsDataSet[currentCurrency + "/" + targetCurrency] !== undefined) {
            // At first check straight pair is exist and have property "ask" not equal null
            // For example we have ETH and want get USDT
            // ETH/USDT has found, and we must create sell order
            // and currency amount must be in base
            const symbolName = currentCurrency + "/" + targetCurrency;
            const action = orderAction.sell;
            const quantityType = orderQuantity.base;
            return {symbolName, action, quantityType};
        } else if (symbolsDataSet[targetCurrency + "/" + currentCurrency] !== undefined) {
            // Then check reversed pair is exist and have property "ask" not equal null
            // For example we have USDT and want get ETH
            // ETH/USDT has found, and we must create buy order
            // and currency amount must be in quote
            const symbolName = targetCurrency + "/" + currentCurrency;
            const action = orderAction.buy;
            const quantityType = orderQuantity.quote;
            return {symbolName, action, quantityType};
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



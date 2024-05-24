import {BinanceHttpAdapterOLD} from "../adapters/http/binanceHttpAdapterOLD";
import {OrderSide} from "../types/fetch-binance/input";
import {roundDownNumber} from "../services/trade-sequence";
import {orderAction, orderQuantity} from "../common/common";
import {ActionTimer} from "../common/utils/timer";

export class BinanceService {

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
	static async createOrder(currentCurrency: string, targetCurrency: string, amount: number, symbolsDataSet: any) {
		const timer =  new ActionTimer("BinanceService/createOrder")
		timer.start()
		const {symbolName, action, quantityType}: any = this._getSymbol(currentCurrency, targetCurrency,symbolsDataSet);
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
		const totalAmount:number = +amount.toFixed(8)
		const result = await BinanceHttpAdapterOLD.placeOrder(symbolName, quantityType, totalAmount, side);
		timer.stop()

		return result
	}

	static _getSymbol(currentCurrency: string, targetCurrency: string, symbolsDataSet: any) {


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



// import {OrderSide} from "../types/fetch-binance/input";
//
// import {orderAction, orderQuantity} from "../common/common";
// import {symbolMapper} from "../types/fetch-binance/mapper";
// import {roundDownNumber} from "./common/round-down-number";
//
// export const sellAllThis = async (curr: string) => {
// 	try {
// 		const symbol = curr + "USDT";
// 		const side: OrderSide = orderAction.buy;
// 		const quantityCurrency = curr;
// 		const quantityType = orderQuantity.base;
// 		const currencyAmount = await BinanceHttpAdapterOLD.getCurrencyBalance(quantityCurrency);
// 		//  console.log("currencyAmount is  "+ currencyAmount)
// 		const response = await BinanceHttpAdapterOLD.getAllSymbols();
// 		const symbols = response.content.symbols.filter((el: any) => el.symbol === symbol).map(symbolMapper);
//
// 		const step = symbols[0].filters.stepSize;
// 		// console.log("step is  "+ step)
// 		const quantityAmount = roundDownNumber(currencyAmount, +step);
// 		//  console.log("try to sell "+ quantityAmount + " "+ curr)
// 		const res = await BinanceHttpAdapterOLD.placeOrder(symbol, quantityType, quantityAmount, side);
// 		console.log(symbol + " " + res.type);
// 		console.log(symbols[0].filters);
// 		console.log(response.content.symbols.filter((el: any) => el.symbol === symbol)[0]);
// 		console.log(res.content);
// 		return;
// 	}catch(err){
// 		console.log ("failed sell " +curr + "/USDT");
//
// 		return;
// 	}
// };
// export const sellAllThistoBTC = async (curr: string) => {
// 	try {
// 		const symbol = curr + "USDT";
// 		const side: OrderSide = orderAction.sell;
// 		const quantityCurrency = curr;
// 		const quantityType = orderQuantity.base;
// 		const currencyAmount = await BinanceHttpAdapterOLD.getCurrencyBalance(quantityCurrency);
// 		//  console.log("currencyAmount is  "+ currencyAmount)
// 		const response = await BinanceHttpAdapterOLD.getAllSymbols();
// 		const symbols = response.content.symbols.filter((el: any) => el.symbol === symbol).map(symbolMapper);
//
// 		const step = symbols[0].filters.stepSize;
// 		// console.log("step is  "+ step)
// 		const quantityAmount = roundDownNumber(currencyAmount, +step);
// 		//  console.log("try to sell "+ quantityAmount + " "+ curr)
// 		const res = await BinanceHttpAdapterOLD.placeOrder(symbol, quantityType, quantityAmount, side);
// 		console.log(symbol + " " + res.type);
//
//
// 		return;
// 	}catch(err){
// 		console.log ("failed sell " +curr + "/USDT");
// 		return;
// 	}
// };

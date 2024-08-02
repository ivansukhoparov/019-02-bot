// import {BinanceHttpAdapterOLD} from "../../adapters/http/binanceHttpAdapterOLD";
//
// export const logCurrencyAmount = async (currency: string) => {
// 	const amount = await BinanceHttpAdapterOLD.getCurrencyBalance(currency);
// 	console.log(currency + " - " + amount);
// };
//
//
// export const asyncLogCurrencyAmount = (currency: string) => {
// 	new Promise((resolve, reject) => resolve(BinanceHttpAdapterOLD.getCurrencyBalance(currency)))
// 		.then((value) => console.log(currency + " - " + value));
// };
//
//
// export const logPositiveBalances = async () => {
// 	const all = await BinanceHttpAdapterOLD.getAllWallets();
//
// 	for (let i = 0; i < all.length; i++) {
// 		if (all[i].free > 0) {
// 			console.log(all[i].asset + " - " + all[i].free);
// 		}
// 	}
// };

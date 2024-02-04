import {BinanceAdapter} from "../../adapters/http/binance-adapter";

export const logCurrencyAmount = async (currency: string) => {
	const amount = await BinanceAdapter.getCurrencyBalance(currency);
	console.log(currency + " - " + amount);
};


export const asyncLogCurrencyAmount = (currency: string) => {
	new Promise((resolve, reject) => resolve(BinanceAdapter.getCurrencyBalance(currency)))
		.then((value) => console.log(currency + " - " + value));
};


export const logPositiveBalances = async () => {
	const all = await BinanceAdapter.getAllWallets();

	for (let i = 0; i < all.length; i++) {
		if (all[i].free > 0) {
			console.log(all[i].asset + " - " + all[i].free);
		}
	}
};

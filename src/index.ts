import {logCurrencyAmount, logPositiveBalances} from "./common/utils/logs";
import {getAllTradableSymbols} from "./services/get-all-tradable-symbols";
import {createSymbolsDataSet} from "./services/preparing-symbols";
import {createSequencesDataSet} from "./services/create-sequences-data-set";
import {sellAllToUsdt} from "./common/sell-all-to-usdt";
import {BinanceAdapter} from "./adapters/http/binance-adapter";
import {wsUpdate} from "./adapters/websokets/websoket-adapter";

require("dotenv").config();

const init = async () =>{
	// this function return symbolsDataSet and sequencesDataSet
	const allTradableSymbols = await getAllTradableSymbols();
	const symbolsDataSet = await createSymbolsDataSet(allTradableSymbols);
	const sequencesDataSet = await createSequencesDataSet(allTradableSymbols, symbolsDataSet);
	return {symbolsDataSet, sequencesDataSet}
}

const app = async () => {
	const {symbolsDataSet, sequencesDataSet} =  await init();
	console.log("app initiated")
	 wsUpdate(symbolsDataSet, sequencesDataSet);
};

const normaliseWallets = async () => {
	await logPositiveBalances()
	await sellAllToUsdt()
	await logPositiveBalances()
	await logCurrencyAmount("IOTA")
	await logCurrencyAmount("USDT")
	let totalUsdtAmount = await BinanceAdapter.getCurrencyBalance("USDT");
	let amount = 1000;
	const count = Math.floor(totalUsdtAmount / 1000);
	for (let i = 0; i < count; i++) {
		await new Promise(resolve => setTimeout(resolve, 1000));
		await BinanceAdapter.placeOrder("IOTAUSDT", "quoteOrderQty", amount, "buy", "market")

		await logCurrencyAmount("USDT")
		await logCurrencyAmount("IOTA")
		console.log("============================================================")
	}
	totalUsdtAmount = await BinanceAdapter.getCurrencyBalance("USDT");
	amount = totalUsdtAmount - 100;
	await BinanceAdapter.placeOrder("IOTAUSDT", "quoteOrderQty", amount, "buy", "market")
	await logCurrencyAmount("USDT")
	await logCurrencyAmount("IOTA")
	console.log("============================================================")
}
const iotatousdt = async (usdt:number) => {
	console.log("============================================================")
	await logCurrencyAmount("IOTA")
	await logCurrencyAmount("USDT")

	await BinanceAdapter.placeOrder("IOTAUSDT", "quoteOrderQty", usdt, "sell", "market")
	await logCurrencyAmount("USDT")
	await logCurrencyAmount("IOTA")
	console.log("============================================================")
}
const startApp = async ()=>{
	try {
		//await iotatousdt(150)
		await logCurrencyAmount("USDT")
		await app();
// await normaliseWallets()
	} catch (err) {
		console.log(err);
	}
};

startApp();

import {logCurrencyAmount, logPositiveBalances} from "./common/utils/logs";
import {getAllTradableSymbols} from "./services/get-all-tradable-symbols";
import {createSymbolsDataSet} from "./services/preparing-symbols";
import {createSequencesDataSet} from "./services/create-sequences-data-set";
import {sellAllToUsdt} from "./common/sell-all-to-usdt";
import {BinanceAdapter} from "./adapters/http/binance-adapter";
import {wsUpdate} from "./adapters/websokets/websoket-adapter";
import {ActionTimer} from "./common/utils/timer";

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

	const startAmount = await BinanceAdapter.getCurrencyBalance("USDT");

	await new Promise(resolve => setTimeout(resolve, 5000));
	 wsUpdate(symbolsDataSet, sequencesDataSet,startAmount);
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

	await logCurrencyAmount("IOTA")
	await logCurrencyAmount("USDT")

	console.log("============================================================")
}
const startApp = async ()=>{
	try {
		console.log("v0.01")
		const balanceTest = await BinanceAdapter.getCurrencyBalance("USDT");
		if (balanceTest<100){
			console.log("low balance")
			await iotatousdt(150-balanceTest)
			console.log("transfer money")
		}else{
			console.log("balance OK")
		}
		await logCurrencyAmount("USDT")
		await app();
		await logCurrencyAmount("USDT")
// await normaliseWallets()
	} catch (err) {
		console.log(err);
	}
};

startApp();

// import {logCurrencyAmount} from "./common/utils/logs";
// import {getAllTradableSymbols} from "./services/get-all-tradable-symbols";
// import {createSymbolsDataSet} from "./services/preparing-symbols";
// import {createSequencesDataSet} from "./services/create-sequences-data-set";
// import {BinanceAdapter} from "./adapters/http/binance-adapter";
// import {wsUpdate} from "./adapters/websokets/websoket-adapter";
// import {appMode, appSettings} from "./settings/settings";
// import {APP_MODES} from "./common/common";
// import {LogToFile} from "./common/utils/log-to-file";
//
// require("dotenv").config();
//
// const init = async () =>{
// 	const allTradableSymbols = await getAllTradableSymbols();
// 	const symbolsDataSet = await createSymbolsDataSet(allTradableSymbols);
// 	const sequencesDataSet = await createSequencesDataSet(allTradableSymbols, symbolsDataSet);
// 	return {symbolsDataSet, sequencesDataSet}
// }
//
// const app = async () => {
// 	const {symbolsDataSet, sequencesDataSet} =  await init();
// 	console.log("app initiated")
//
// 	const startAmount = await BinanceAdapter.getCurrencyBalance("USDT");
//
// 	await new Promise(resolve => setTimeout(resolve, 5000));
// 	 wsUpdate(symbolsDataSet, sequencesDataSet,startAmount);
// };
//
const iotatousdt = async (usdt:number) => {
	console.log("============================================================")
	await logCurrencyAmount("IOTA")
	await logCurrencyAmount("USDT")
	await BinanceAdapter.placeOrder("IOTAUSDT", "quoteOrderQty", usdt, "sell", "market")
	await logCurrencyAmount("IOTA")
	await logCurrencyAmount("USDT")
	console.log("============================================================")
}
//
//
// const startApp = async ()=>{
// 	try {
//
// 	//	await new Promise(resolve => setTimeout(resolve, 10000));
//
// 		console.log("v0.02.0.0")
// 		console.log("APP MODE " + appMode)
// 		console.dir(appSettings)
//
// 		if (appMode === APP_MODES.test) {
// 			const balanceTest = await BinanceAdapter.getCurrencyBalance("USDT");
// 			if (balanceTest<100){
// 				console.log("low balance")
// 				await iotatousdt(150-balanceTest)
// 				console.log("transfer money")
// 			}else{
// 				console.log("balance OK")
// 			}
// 		}
//
//
//
// 		await logCurrencyAmount("USDT")
// 		await app();
// 		//await logCurrencyAmount("USDT")
// // await normaliseWallets()
// 	} catch (err) {
// 		console.log(err);
// 	}
// };
//
// startApp();
//
//
//



/// NEW VERSION BELOW


import {logCurrencyAmount} from "./common/utils/logs";
import {getAllTradableSymbols} from "./services/get-all-tradable-symbols";
import {createSymbolsDataSet} from "./services/preparing-symbols";
import {createSequencesDataSet} from "./services/create-sequences-data-set";
import {BinanceAdapter} from "./adapters/http/binance-adapter";
import {appMode, appSettings} from "./settings/settings";
import {APP_MODES} from "./common/common";
import {TradeCore} from "./adapters/websokets/core";
import {wsUpdate2} from "./adapters/websokets/websoket-adapter-v2";

require("dotenv").config();

const init = async () =>{
	const allTradableSymbols = await getAllTradableSymbols();
	const symbolsDataSet = await createSymbolsDataSet(allTradableSymbols);
	const sequencesDataSet = await createSequencesDataSet(allTradableSymbols, symbolsDataSet);
	return new TradeCore(0.1,100,symbolsDataSet,sequencesDataSet)
}

const app = async () => {
	const binanceCore =  await init();
	console.log("app initiated")

	await new Promise(resolve => setTimeout(resolve, 1000));
	wsUpdate2(binanceCore);
};


const startApp = async ()=>{
	try {

		//	await new Promise(resolve => setTimeout(resolve, 10000));

		console.log("v0.02.3.3")
		console.log("APP MODE " + appMode)
		console.dir(appSettings)
		console.log("correctedStartAmountResult >0.01 && correctedStartAmount.startAmount> 6")

		if (appMode === APP_MODES.test) {
			const balanceTest = await BinanceAdapter.getCurrencyBalance("USDT");
			if (balanceTest<100){
				console.log("low balance")
				await iotatousdt(100)
				console.log("transfer money")
			}else{
				console.log("balance OK")
			}
		}



		await logCurrencyAmount("USDT")
		await app();

	} catch (err) {
		console.log(err);
	}
};

startApp();


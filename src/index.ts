import {BinanceAdapter} from "./adapters/http/binance-adapter";


import {addPricesToSymbolsArray, getAllTradableSymbols} from "./services/get-all-tradable-symbols";
import {createSymbolsDataSet} from "./services/preparing-symbols";
import {wsUpdate} from "./adapters/websokets/websoket-adapter";
import {BinanceService} from "./application/binance-service";
import {copyFileSync} from "fs";
import {createSequencesDataSet} from "./services/create-sequences-data-set";
import {logCurrencyAmount} from "./common/utils/logs";

require("dotenv").config();

const app = async () => {
	const allTradableSymbols = await getAllTradableSymbols();
	const symbolsDataSet = await createSymbolsDataSet(allTradableSymbols);
	const sequencesDataSet = await createSequencesDataSet(allTradableSymbols, symbolsDataSet);
	wsUpdate(symbolsDataSet, sequencesDataSet);
};




const startApp = async ()=>{
	try {
		const allTradableSymbols = await getAllTradableSymbols();
		const symbolsDataSet = await createSymbolsDataSet(allTradableSymbols);
		await logCurrencyAmount("USDC");
		await  logCurrencyAmount("ETH");
		const SB = await  BinanceService.createOrder("USDC","ETH",1,symbolsDataSet);

		await logCurrencyAmount("USDC");
		await  logCurrencyAmount("ETH");
		console.log(SB);
	} catch (err) {
		console.log(err);
	}
};

startApp();

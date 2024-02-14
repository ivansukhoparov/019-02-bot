import {logPositiveBalances} from "./common/utils/logs";

require("dotenv").config();
import {getAllTradableSymbols} from "./services/get-all-tradable-symbols";
import {createSymbolsDataSet} from "./services/preparing-symbols";
import {wsUpdate} from "./adapters/websokets/websoket-adapter";
import {createSequencesDataSet} from "./services/create-sequences-data-set";
import {sellAllToUsdt} from "./common/sell-all-to-usdt";

const init = async () =>{
	// this function return symbolsDataSet and sequencesDataSet
	const allTradableSymbols = await getAllTradableSymbols();
	const symbolsDataSet = await createSymbolsDataSet(allTradableSymbols);
	const sequencesDataSet = await createSequencesDataSet(allTradableSymbols, symbolsDataSet);
	return {symbolsDataSet, sequencesDataSet}
}

const app = async () => {
	const {symbolsDataSet, sequencesDataSet} =  await init();
	//wsUpdate(symbolsDataSet, sequencesDataSet);

};

const startApp = async ()=>{
	try {
//	await app();
await logPositiveBalances()
	// await sellAllToUsdt()
	} catch (err) {
		console.log(err);
	}
};

startApp();

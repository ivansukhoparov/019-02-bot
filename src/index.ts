
import {appMode, AppSettings, appSettingsOld} from "./settings/settings";
import {APP_MODES} from "./base/services/utils/common";
import { appInit} from "./app";
import {container, TYPE} from "./composition.root";
import {SymbolsDataSet} from "./base/services/data.sets/symbols.data.set";
import {AvailableSymbols} from "./base/services/data.sets/available.symbols";

require("dotenv").config();
export const appSettings = new AppSettings("TEST")


const ds = container.resolve<AvailableSymbols>(AvailableSymbols)
const startApp = async ()=>{
await appInit()
    // console.log(ds.get())
	// try {
	// 	console.log("v0.02.4.3")
	// 	console.log("APP MODE " + appMode)
	// 	console.dir(appSettingsOld)
	// 	console.log("correctedStartAmountResult >0.01 && correctedStartAmount.startAmount>= 6")
	//
	// 	if (appMode === APP_MODES.test) {
	// 		const balanceTest = await BinanceHttpAdapterStatic.getCurrencyBalance("USDT");
	// 		if (balanceTest<100){
	// 			console.log("low balance")
	// 			await iotaToUsdt(100)
	// 			console.log("transfer money")
	// 		}else{
	// 			console.log("balance OK")
	// 		}
	// 	}
	//
	// 	await logCurrencyAmount(appSettingsOld.binance.params.startCurrency)
	// 	await app();
	// } catch (err) {
	// 	console.log(err);
	// }
};

startApp();


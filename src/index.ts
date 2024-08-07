import {appSettings} from "./settings/settings";
import {appInit} from "./app";
import {container} from "./composition.root";
import {AvailableSymbols} from "./base/services/data.sets/available.symbols";

;

require("dotenv").config();

console.log(appSettings)

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


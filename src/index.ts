import {logCurrencyAmount} from "./common/utils/logs";
import {BinanceHttpAdapterStatic} from "./adapters/http/binance.http.adapter.static";
import {appMode, appSettings} from "./settings/settings";
import {APP_MODES} from "./common/common";
import {iotaToUsdt} from "./core/utils/test.mode.utils";
import {app} from "./app";

require("dotenv").config();

const startApp = async ()=>{
	try {
		console.log("v0.02.4.3")
		console.log("APP MODE " + appMode)
		console.dir(appSettings)
		console.log("correctedStartAmountResult >0.01 && correctedStartAmount.startAmount>= 6")

		if (appMode === APP_MODES.test) {
			const balanceTest = await BinanceHttpAdapterStatic.getCurrencyBalance("USDT");
			if (balanceTest<100){
				console.log("low balance")
				await iotaToUsdt(100)
				console.log("transfer money")
			}else{
				console.log("balance OK")
			}
		}

		await logCurrencyAmount(appSettings.binance.params.startCurrency)
		await app();
	} catch (err) {
		console.log(err);
	}
};

startApp();


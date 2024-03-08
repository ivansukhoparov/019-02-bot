import {logCurrencyAmount} from "./common/utils/logs";
import {BinanceHttpAdapter} from "./adapters/http/binance.http.adapter";
import {appMode, appSettings} from "./settings/settings";
import {APP_MODES} from "./common/common";
import {iotaToUsdt} from "./core/utils/test.mode.utils";
import {app} from "./app";

require("dotenv").config();

const startApp = async ()=>{
	try {
		console.log("v0.02.4.1")
		console.log("APP MODE " + appMode)
		console.dir(appSettings)
		console.log("correctedStartAmountResult >0.01 && correctedStartAmount.startAmount>= 6")

		if (appMode === APP_MODES.test) {
			const balanceTest = await BinanceHttpAdapter.getCurrencyBalance("USDT");
			if (balanceTest<100){
				console.log("low balance")
				await iotaToUsdt(100)
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


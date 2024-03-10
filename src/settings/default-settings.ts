
require("dotenv").config();

export const defaultSettings = {
	binance: {
		urls: {
			baseUrl: "https://api.binance.com",
			websocket: "wss://stream.binance.com:9443/stream?streams="
		},
		keys: {
			api: process.env.API_KEY!,
			secret: process.env.SECRET_KEY!
		},
		params:{
			startCurrency:process.env.START_CURRENCY!,
			thresholdValue:process.env.THRESHOLD_VALUE!,
			stopThresholdValue:process.env.STOP_THRESHOLD!
		}

	}
};


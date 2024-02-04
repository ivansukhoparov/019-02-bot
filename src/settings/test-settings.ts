import {defaultSettings} from "./default-settings";
require("dotenv").config();

export const testSettings: typeof defaultSettings = {
	binance: {
		urls: {
			baseUrl: "https://testnet.binance.vision",
			websocket: ""
		},
		keys: {
			api: process.env.TEST_API_Key!,
			secret: process.env.TEST_Secret_Key!
		}
	}
};

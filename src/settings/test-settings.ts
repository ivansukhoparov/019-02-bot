import {defaultSettings} from "./default-settings";
require("dotenv").config();

export const testSettings: typeof defaultSettings = {
	binance: {
		urls: {
			baseUrl: "https://testnet.binance.vision",
			websocket: ""
		},
		keys: {
			api: "vj32ugTRz4opP9C086t2iHiW6Hinn5nkx3BwMk7vdqGTVvhXphKcjBnJwyUvwJMM",
			secret: "H9f2TLAyvYFwaFPF08YqJFmXuRkjPbn61QXnENJc1qVm6ozDgregLC0irCTtBMad"
		}
	}
};

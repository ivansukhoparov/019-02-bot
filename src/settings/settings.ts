import {testSettings} from "./test-settings";
import {defaultSettings} from "./default-settings";
import {APP_MODES} from "../base/services/utils/common";
import {injectable} from "inversify";

require("dotenv").config();
export const appMode: string = "TEST"
export let appSettingsOld: typeof defaultSettings;

if (appMode === APP_MODES.test) {
    appSettingsOld = testSettings;
} else {
    appSettingsOld = defaultSettings;
}

export class AppSettings{
    public marketName = "Binance"

    public commissionAmount = 0.1
    public startAmount = 100
    public minStartAmount = 10
    public thresholdValue = 0.1;

    public tradeMode: "SPOT"|"MARGIN" = "SPOT"
    public excludeShortFluctuations = true

    public urls: {
        baseUrl: "https://testnet.binance.vision",
        websocket: "wss://testnet.binance.vision/ws/"
    }
    public keys: {
        api: "vj32ugTRz4opP9C086t2iHiW6Hinn5nkx3BwMk7vdqGTVvhXphKcjBnJwyUvwJMM",
        secret: "H9f2TLAyvYFwaFPF08YqJFmXuRkjPbn61QXnENJc1qVm6ozDgregLC0irCTtBMad"
    }

    constructor(mode:string) {

    }
}

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
    public thresholdValue = +appSettingsOld.binance.params.thresholdValue;

    public tradeMode: "SPOT"|"MARGIN" = "SPOT"
    public excludeShortFluctuations = true
}

import {testSettings} from "./test-settings";
import {defaultSettings} from "./default-settings";
import {APP_MODES} from "../common/common";

require("dotenv").config();
export const appMode: string = process.env.APP_MODE!
export let appSettingsOld: typeof defaultSettings;

if (appMode === APP_MODES.test) {
    appSettingsOld = testSettings;
} else {
    appSettingsOld = defaultSettings;
}


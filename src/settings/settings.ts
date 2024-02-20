import {testSettings} from "./test-settings";
import {defaultSettings} from "./default-settings";
import {APP_MODES} from "../common/common";

require("dotenv").config();
export const appMode: string = process.env.APP_MODE!
export let appSettings: typeof defaultSettings;

if (appMode === APP_MODES.test) {
    appSettings = testSettings;
} else {
    appSettings = defaultSettings;
}


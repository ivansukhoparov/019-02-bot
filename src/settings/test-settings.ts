import dotenv from "dotenv"
import {defaultSettings} from "./default-settings";


export const testSettings: typeof defaultSettings = {
    urls: {
        baseUrl: "https://testnet.binance.vision",
        websocket: ""
    },
    keys: {
        api: process.env.TEST_API_Key || "",
        secret: process.env.TEST_Secret_Key  || ""
    }
}


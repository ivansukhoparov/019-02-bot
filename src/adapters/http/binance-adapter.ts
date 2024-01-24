import {appSettings} from "../../settings/settings";
import {createSignature} from "./utils/create-signature";
import {fetchAdapter} from "./utils/fetch-adapter";

const API_KEY = appSettings.binance.keys.api;
const API_SECRET = appSettings.binance.keys.secret;
const BASE_URL = appSettings.binance.urls.baseUrl;

export class BinanceAdapter {

    static async getAccountInfo() {

        const data: any = {timestamp: Date.now()};
        const queryString = Object.keys(data).map(key => `${key}=${data[key]}`).join("&");
        const signature = createSignature(queryString, API_SECRET);

        const url = `${BASE_URL}/api/v3/account?${queryString}&signature=${signature}`;
        const payload = {
            method: "GET",
            headers: {
                "X-MBX-APIKEY": API_KEY
            }
        }

        return await fetchAdapter.request(url, payload)
    }

    static async placeOrder(symbol: any, quantity: any, side: any) {
        // Example:
        // placeOrder("BTCUSDT", 0.001, "BUY");
        const data: any = {
            symbol: symbol,
            side: side,
            type: "MARKET",
            quantity: quantity,
            timestamp: Date.now()
        };

        const queryString = Object.keys(data).map(key => `${key}=${data[key]}`).join("&");
        const signature = createSignature(queryString, API_SECRET);

        const url = `${BASE_URL}/api/v3/order`;

        const payload = {
            method: "POST",
            headers: {
                "X-MBX-APIKEY": API_KEY,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `${queryString}&signature=${signature}`
        }

        return await fetchAdapter.request(url, payload)
    }


}



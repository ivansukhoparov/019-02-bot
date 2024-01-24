import {appSettings} from "../../settings/settings";
import {createSignature} from "./utils/create-signature";
import {fetchAdapter} from "./fetch-adapter";

const API_KEY = appSettings.binance.keys.api;
const API_SECRET = appSettings.binance.keys.secret;
const BASE_URL = appSettings.binance.urls.baseUrl;

export async function getAccountInfo() {

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



import fetch from "node-fetch";
import crypto from "crypto";
import dotenv from "dotenv"

const API_KEY = "vj32ugTRz4opP9C086t2iHiW6Hinn5nkx3BwMk7vdqGTVvhXphKcjBnJwyUvwJMM";
const API_SECRET = "H9f2TLAyvYFwaFPF08YqJFmXuRkjPbn61QXnENJc1qVm6ozDgregLC0irCTtBMad";
const BASE_URL = "https://testnet.binance.vision"
    // "https://api.binance.com";

function createSignature(queryString: string) {
    return crypto.createHmac("sha256", API_SECRET).update(queryString).digest("hex");
}

export async function getAccountInfo() {
    const data:any = {
        timestamp: Date.now()
    };

    const queryString = Object.keys(data).map(key => `${key}=${data[key]}`).join("&");
    const signature = createSignature(queryString);

    const url = `${BASE_URL}/api/v3/account?${queryString}&signature=${signature}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-MBX-APIKEY": API_KEY
            }
        });

        const responseData = await response.json();
        console.log("Account Information:", responseData);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Вызов функции
getAccountInfo();

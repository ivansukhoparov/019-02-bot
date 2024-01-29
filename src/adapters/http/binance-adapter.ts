import {appSettings} from "../../settings/settings";
import {createSignature} from "./utils/create-signature";
import {FetchAdapter} from "./utils/fetch-adapter";
import {
    AccountBalanceInfoInputType,
    FetchResponseType,
    OrderSide,
    OrderTypeType
} from "../../types/fetch-binance/input";

const API_KEY = appSettings.binance.keys.api;
const API_SECRET = appSettings.binance.keys.secret;
const BASE_URL = appSettings.binance.urls.baseUrl;

export class BinanceAdapter {

    static async getAccountInfo(): Promise<FetchResponseType> {

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
        const response = await FetchAdapter.request(url, payload);
        return response;
    }

    static async placeOrder(symbol: string,
                            quantityType: "quantity" | "quoteOrderQty",
                            quantityAmount: number,
                            side: OrderSide,
                            type: OrderTypeType = "market"): Promise<FetchResponseType> {

        // Example:
        // placeOrder("BTCUSDT", 0.001, "BUY");
        const data: any = {
            symbol: symbol.replace("/", "").toUpperCase(),
            side: side.toUpperCase(),
            type: type.toUpperCase(),
            [quantityType]: +quantityAmount,
            timestamp: Date.now()
        };

        //console.log(data)


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

        return await FetchAdapter.request(url, payload)
    }

    // static async orderBaseByQuote(base: string,
    //                               quote: string,
    //                               side: OrderSide,
    //                               type: OrderTypeType = "market") {
    //
    //     const quoteAmount = await this.getCurrencyBalance(quote.toUpperCase());
    //     if (!quoteAmount) {
    //         console.log(`Can't get ${quote} balance, or haven't any ${quote} on balance`);
    //         return;
    //     } else {
    //         console.log(`${quote} balance is ${quoteAmount}`);
    //     }
    //
    //     const data: any = {
    //         symbol: "BTCUSDT",// (base + quote).toUpperCase(),
    //         side: side.toUpperCase(),
    //         type: type.toUpperCase(),
    //         //quantity: 0.01,
    //         quoteOrderQty: +quoteAmount,
    //         timestamp: Date.now()
    //     };
    //
    //     console.log(data)
    //
    //     const queryString = Object.keys(data).map(key => `${key}=${data[key]}`).join("&");
    //
    //     const signature = createSignature(queryString, API_SECRET);
    //
    //     const url = `${BASE_URL}/api/v3/order`;
    //     console.log(url)
    //     const payload = {
    //         method: 'POST',
    //         headers: {
    //             'X-MBX-APIKEY': API_KEY,
    //             'Content-Type': 'application/x-www-form-urlencoded'
    //         },
    //         body: `${queryString}&signature=${signature}`
    //     }
    //     const res = await FetchAdapter.request(url, payload)
    //     return res
    // }

    static async getAllSymbols(): Promise<FetchResponseType> {
        const url = `${BASE_URL}/api/v3/exchangeInfo`;
        const response = await FetchAdapter.request(url);
        return response;
    }

    // This function return array with all available to trade coins (currencies) => ["BTC", "ETH", "USDT" ...etc]
    static async getAllAvailableTickers() {
        // Get account info
        const accountInfo: FetchResponseType = await this.getAccountInfo();
        // Take array balances with wallets, and from each wallet take coin (currency) name and return it
        return accountInfo.content.balances.map((wallet: AccountBalanceInfoInputType) => {
            return wallet.asset
        });
    }

    static async getAllWallets() {
        // Get account info
        const accountInfo: FetchResponseType = await this.getAccountInfo();
        // Take array balances with wallets, and from each wallet take coin (currency) name and return it
        return accountInfo.content.balances;
    }
    static async convertCurrency(quoteAsset:string, baseAsset:string, amount:number) {
            const data:any = {
                quoteAsset: quoteAsset,
                baseAsset: baseAsset,
                amount: amount,
                timestamp: Date.now()
            };

        const queryString = Object.keys(data).map(key => `${key}=${data[key]}`).join("&");
        const signature = createSignature(queryString, API_SECRET);

        const url = `${BASE_URL}/sapi/v1/convert/trade?${queryString}&signature=${signature}`;

        const payload = {

            method: 'POST',
            headers: {
                'X-MBX-APIKEY': API_KEY
            }
        }

        return await FetchAdapter.request(url, payload)
    }

    static async getCurrencyBalance(currency: string) {

        const data: any = {timestamp: Date.now()};
        const queryString = Object.keys(data).map(key => `${key}=${data[key]}`).join('&');
        const signature = createSignature(queryString, API_SECRET);

        const url = `${BASE_URL}/api/v3/account?${queryString}&signature=${signature}`;
        const payload = {
            method: 'GET',
            headers: {
                'X-MBX-APIKEY': API_KEY
            }
        };

        const responseData = await FetchAdapter.request(url, payload);
        const balance = responseData.content.balances.find((b: AccountBalanceInfoInputType) => b.asset === currency);
        return balance ? balance.free : null;
    }

    static _createQueryFilter(...filters: any) {
        let filter = ""
        for (let i = 0; i < arguments.length; i++) {
            const filterName = Object.keys(arguments[i])[0];
            const filterValue = arguments[i][filterName];
            let connector = "&";
            if (i === 0) connector = "?";
            filter = `${connector}${filterName}=${filterName}`
        }
        return filter;
    }
}

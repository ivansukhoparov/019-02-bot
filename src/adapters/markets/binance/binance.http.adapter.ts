import {appSettingsOld} from "../../../settings/settings";
import {AccountBalanceInfoInputType, ApiResponseType, OrderSide, OrderTypeType} from "../../../types/fetch-binance/input";
import crypto from "crypto";
import {MarketHttpAdapterInterface} from "../../../base/interfaces/market.http.adapter.interface";
import {TYPE} from "../../../composition.root";
import {HttpAdapterInterface} from "../../../base/interfaces/http.adapter.interface";
import {inject, injectable} from "inversify";

const API_KEY = appSettingsOld.binance.keys.api;
const API_SECRET = appSettingsOld.binance.keys.secret;
const BASE_URL = appSettingsOld.binance.urls.baseUrl;

@injectable()
export class BinanceHttpAdapter implements MarketHttpAdapterInterface {
    protected httpAdapter: HttpAdapterInterface

    constructor(@inject(TYPE.HttpAdapter) httpAdapter: HttpAdapterInterface) {
        this.httpAdapter = httpAdapter
    }

    async getAccountInfo(): Promise<ApiResponseType> {
        const data: any = {timestamp: Date.now()};
        const queryString = Object.keys(data).map(key => `${key}=${data[key]}`).join("&");
        const signature = this._createSignature(queryString, API_SECRET);

        const url = `${BASE_URL}/api/v3/account?${queryString}&signature=${signature}`;
        const payload = {
            method: "GET",
            headers: {
                "X-MBX-APIKEY": API_KEY
            }
        };
        const response = await this.httpAdapter.request(url, payload);
        return this._responseMapper(response)
    }

    async getTickerPrices(): Promise<ApiResponseType> {
        const data: any = {timestamp: Date.now()};
        const queryString = Object.keys(data).map(key => `${key}=${data[key]}`).join("&");
        const signature = this._createSignature(queryString, API_SECRET);
        const url = `${BASE_URL}/api/v3/ticker/price`;
        const payload = {
            method: "GET",
            headers: {
                "X-MBX-APIKEY": API_KEY
            }
        };
        const response = await this.httpAdapter.request(url, payload);
        return this._responseMapper(response)
    }

    async placeOrder(symbol: string,
                     quantityType: "quantity" | "quoteOrderQty",
                     quantityAmount: number,
                     side: OrderSide,
                     type: OrderTypeType = "market"): Promise<ApiResponseType> {

        const data: any = {
            symbol: symbol.replace("/", "").toUpperCase(),
            side: side.toUpperCase(),
            type: type.toUpperCase(),
            [quantityType]: +quantityAmount,
            timestamp: Date.now()
        };
        const queryString = Object.keys(data).map(key => `${key}=${data[key]}`).join("&");
        const signature = this._createSignature(queryString, API_SECRET);
        const url = `${BASE_URL}/api/v3/order`;

        const payload = {
            method: "POST",
            headers: {
                "X-MBX-APIKEY": API_KEY,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `${queryString}&signature=${signature}`
        };

        const response = await this.httpAdapter.request(url, payload);
        return this._responseMapper(response)
    }


    async getAllSymbols(): Promise<ApiResponseType> {
        const url = `${BASE_URL}/api/v3/exchangeInfo`;
        const response = await this.httpAdapter.request(url);
        return this._responseMapper(response)
    }

    async getAllAvailableTickers() {
        // This function return array with all available to trade coins (currencies) => ["BTC", "ETH", "USDT" ...etc]
        const accountInfo: ApiResponseType = await this.getAccountInfo();  // Get account info
        // Take array balances with wallets, and from each wallet take coin (currency) name and return it
        return accountInfo.content.balances.map((wallet: AccountBalanceInfoInputType) => {
            return wallet.asset;
        });
    }

    async getAllWallets() {
        const accountInfo: ApiResponseType = await this.getAccountInfo(); // Get account info
        // Take array balances with wallets, and from each wallet take coin (currency) name and return it
        return accountInfo.content.balances;
    }

    async convertCurrency(quoteAsset: string, baseAsset: string, amount: number) {
        const data: any = {
            quoteAsset: quoteAsset,
            baseAsset: baseAsset,
            amount: amount,
            timestamp: Date.now()
        };
        const queryString = Object.keys(data).map(key => `${key}=${data[key]}`).join("&");
        const signature = this._createSignature(queryString, API_SECRET);
        const url = `${BASE_URL}/sapi/v1/convert/trade?${queryString}&signature=${signature}`;
        const payload = {
            method: "POST",
            headers: {
                "X-MBX-APIKEY": API_KEY
            }
        };

        const response = await this.httpAdapter.request(url, payload);
        return this._responseMapper(response)
    }

    async getCurrencyBalance(currency: string) {
        const data: any = {timestamp: Date.now()};
        const queryString = Object.keys(data).map(key => `${key}=${data[key]}`).join("&");
        const signature = this._createSignature(queryString, API_SECRET);
        const url = `${BASE_URL}/api/v3/account?${queryString}&signature=${signature}`;
        const payload = {
            method: "GET",
            headers: {
                "X-MBX-APIKEY": API_KEY
            }
        };

        const response = await this.httpAdapter.request(url, payload);
        const mappedResponse = this._responseMapper(response)

        if (mappedResponse.content.balances) {
            const balance = mappedResponse.content.balances.find((b: AccountBalanceInfoInputType) => b.asset === currency);
            return balance ? balance.free : null;
        }
        return null
    }

    async getSymbolInfo(symbol: string) {
        const url = `${BASE_URL}/api/v3/ticker/24hr?symbol=${JSON.stringify(symbol)}`;

        const response = await this.httpAdapter.request(url);
        const mappedResponse = this._responseMapper(response)
        if (mappedResponse.content) {
            return mappedResponse.content
        }
        return null
    }

    async getSymbolsInfo(symbols: string[]) {
        const url = `${BASE_URL}/api/v3/ticker/24hr?symbols=${JSON.stringify(symbols)}`;

        const response: any = await this.httpAdapter.request(url);
        const mappedResponse: ApiResponseType = this._responseMapper(response)
        if (mappedResponse.content) {
            return mappedResponse.content
        }
        return null
    }

     async getDepth(symbol: string){
		const url = `${BASE_URL}/api/v3/depth?symbol=${symbol}&limit=3`;
		return await this.httpAdapter.request(url);
	}

    _createQueryFilter(...filters: any) {
        let filter = "";
        for (let i = 0; i < arguments.length; i++) {
            const filterName = Object.keys(arguments[i])[0];
            const filterValue = arguments[i][filterName];
            let connector = "&";
            if (i === 0) connector = "?";
            filter = `${connector}${filterName}=${filterName}`;
        }
        return filter;
    }

    _createSignature(queryString: string, secret: string, algorithm: string = "sha256") {
        return crypto.createHmac(algorithm, secret).update(queryString).digest("hex");
    }

    _responseMapper(response: any): ApiResponseType {
        const responseKeys = Object.keys(response);
        if (responseKeys.length === 2 && responseKeys[0] === "code" && responseKeys[1] === "msg") {
            return {
                type: "error",
                content: response
            };
        } else {
            return {
                type: "success",
                content: response
            };
        }
    }

}


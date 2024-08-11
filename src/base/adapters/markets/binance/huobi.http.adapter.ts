import {appSettings} from "../../../../settings/settings";
import {
    AccountBalanceInfoInputType,
    ApiResponseType,
    OrderSide,
    OrderTypeType,
    ResponseType
} from "../../../../types/fetch-binance/input";
import crypto from "crypto";
import {IMarketHttpAdapter} from "../../../interfaces/market.http.adapter.interface";
import {IHttpAdapter} from "../../../interfaces/http.adapter.interface";
import {inject, injectable} from "inversify";
import {GetAllSymbolsOutputType} from "../../../../types/http-adapter/binance/get.all.symbols.types/output";
import {getAllSymbolsHuobiMapper} from "../../../../types/http-adapter/binance/get.all.symbols.types/huobi.mapper";
import {GetTickerPricesHuobiMapper} from "../../../../types/http-adapter/binance/get.ticker.prices.types/huobi.mapper";

@injectable()
export class HuobiHttpAdapter implements IMarketHttpAdapter {
    protected httpAdapter: IHttpAdapter;

    constructor(@inject("HttpAdapter") httpAdapter: IHttpAdapter) {
        this.httpAdapter = httpAdapter;
    }

    async getAccountInfo(): Promise<ApiResponseType> {
        const data: any = {timestamp: Date.now()};
        const queryString = this._createQueryString(data);
        const signature = this._createSignature(queryString, appSettings.marketData.secretKey);

        const url = `${appSettings.marketData.baseUrl}/v1/account/accounts?${queryString}&Signature=${signature}`;
        const payload = {
            method: "GET",
            headers: {
                "AccessKeyId": appSettings.marketData.apiKey
            }
        };
        const response = await this.httpAdapter.request(url, payload);
        return this._responseMapper(response);
    }

    async getTickerPrices(): Promise<ApiResponseType> {
        const url = `${appSettings.marketData.baseUrl}/market/tickers`; //https://api.huobi.pro/market/tickers
        const payload = {
            method: "GET",
            headers: {
                "AccessKeyId": appSettings.marketData.apiKey
            }
        };
        const rawResponse = await this.httpAdapter.request(url, payload);
        const response: ApiResponseType = this._responseMapper(rawResponse);
        if (response.type === "success") {
            response.content = response.content.data.map(GetTickerPricesHuobiMapper);
        }
        return response;
    }

    async placeOrder(symbol: string,
                     quantityType: "quantity" | "quoteOrderQty",
                     quantityAmount: number,
                     side: OrderSide,
                     type: OrderTypeType = "market"): Promise<ApiResponseType> {

        const data: any = {
            symbol: symbol.replace("/", "").toLowerCase(),
            side: side.toLowerCase(),
            type: type.toLowerCase(),
            [quantityType]: +quantityAmount,
            timestamp: Date.now()
        };
        const queryString = this._createQueryString(data);
        const signature = this._createSignature(queryString, appSettings.marketData.secretKey);
        const url = `${appSettings.marketData.baseUrl}/v1/order/orders/place`;

        const payload = {
            method: "POST",
            headers: {
                "AccessKeyId": appSettings.marketData.apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({...data, Signature: signature})
        };

        const response = await this.httpAdapter.request(url, payload);
        return this._responseMapper(response);
    }

    async getAllSymbols(): Promise<ResponseType<Array<GetAllSymbolsOutputType>>> {
        const url = `${appSettings.marketData.baseUrl}/v1/common/symbols`;
        const rawResponse = await this.httpAdapter.request(url);
        const response: ApiResponseType = this._responseMapper(rawResponse);
        if (response.type === "success") {
            response.content = response.content.data.map(getAllSymbolsHuobiMapper);
        }
        return response;
    }

    async getAllAvailableTickers() {
        const accountInfo: ApiResponseType = await this.getAccountInfo();
        return accountInfo.content.data.list.map((wallet: AccountBalanceInfoInputType) => {
            // return wallet.currency;
        });
    }

    async getAllWallets() {
        const accountInfo: ApiResponseType = await this.getAccountInfo();
        return accountInfo.content.data.list;
    }

    async convertCurrency(quoteAsset: string, baseAsset: string, amount: number) {
        const data: any = {
            from: quoteAsset,
            to: baseAsset,
            amount: amount,
            timestamp: Date.now()
        };
        const queryString = this._createQueryString(data);
        const signature = this._createSignature(queryString, appSettings.marketData.secretKey);
        const url = `${appSettings.marketData.baseUrl}/v1/dw/transfer/convert?${queryString}&Signature=${signature}`;
        const payload = {
            method: "POST",
            headers: {
                "AccessKeyId": appSettings.marketData.apiKey
            }
        };

        const response = await this.httpAdapter.request(url, payload);
        return this._responseMapper(response);
    }

    async getCurrencyBalance(currency: string) {
        const accountInfo: ApiResponseType = await this.getAccountInfo();
        if (accountInfo.content.data) {
            // @ts-ignore
            const balance = accountInfo.content.data.list.find((b: AccountBalanceInfoInputType) => b.currency === currency);
            return balance ? balance.balance : null;
        }
        return null;
    }

    async getSymbolInfo(symbol: string) {
        const url = `${appSettings.marketData.baseUrl}/market/detail/merged?symbol=${symbol}`;
        const response = await this.httpAdapter.request(url);
        const mappedResponse = this._responseMapper(response);
        if (mappedResponse.content) {
            return mappedResponse.content;
        }
        return null;
    }

    async getSymbolsInfo(symbols: string[]) {
        const url = `${appSettings.marketData.baseUrl}/market/detail/merged?symbols=${JSON.stringify(symbols)}`;
        const response: any = await this.httpAdapter.request(url);
        const mappedResponse: ApiResponseType = this._responseMapper(response);
        if (mappedResponse.content) {
            return mappedResponse.content;
        }
        return null;
    }

    async getDepth(symbol: string) {
        const url = `${appSettings.marketData.baseUrl}/market/depth?symbol=${symbol}&type=step0`;
        const result = await this.httpAdapter.request(url);
        console.log("getDepth for", symbol);
        console.log(result);
        return result;
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

    _createQueryString(data: any) {
        return Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join("&");
    }

    _createSignature(queryString: string, secret: string, algorithm: string = "sha256") {
        return crypto.createHmac(algorithm, secret).update(queryString).digest("hex");
    }

    _responseMapper(response: any): ApiResponseType {
        const responseKeys = Object.keys(response);
        if (responseKeys.length === 2 && responseKeys.includes("status") && response.status !== "ok") {
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

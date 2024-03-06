import {appSettings} from "../../settings/settings";
import {
	AccountBalanceInfoInputType,
	FetchResponseType,
	OrderSide,
	OrderTypeType
} from "../../types/fetch-binance/input";
import crypto from "crypto";
import {FetchAdapterREF} from "./utils/fetch-adapter REF";

const API_KEY = appSettings.binance.keys.api;
const API_SECRET = appSettings.binance.keys.secret;
const BASE_URL = appSettings.binance.urls.baseUrl;

export class BinanceHttpAdapterREF {
	constructor(protected httpAdapter: FetchAdapterREF) {
	}

	async getAccountInfo(): Promise<FetchResponseType> {
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
		return await this.httpAdapter.request(url, payload);
	}

	async getTickerPrices(): Promise<FetchResponseType> {

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
		return response;
	}

	async placeOrder(symbol: string,
					 quantityType: "quantity" | "quoteOrderQty",
					 quantityAmount: number,
					 side: OrderSide,
					 type: OrderTypeType = "market"): Promise<FetchResponseType> {

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

		return await this.httpAdapter.request(url, payload);
	}


	async getAllSymbols(): Promise<FetchResponseType> {
		const url = `${BASE_URL}/api/v3/exchangeInfo`;
		const response = await this.httpAdapter.request(url);
		return response;
	}


	async getAllAvailableTickers() {
		// This function return array with all available to trade coins (currencies) => ["BTC", "ETH", "USDT" ...etc]
		const accountInfo: FetchResponseType = await this.getAccountInfo();  // Get account info
		// Take array balances with wallets, and from each wallet take coin (currency) name and return it
		return accountInfo.content.balances.map((wallet: AccountBalanceInfoInputType) => {
			return wallet.asset;
		});
	}

	async getAllWallets() {
		const accountInfo: FetchResponseType = await this.getAccountInfo(); // Get account info
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

		return await this.httpAdapter.request(url, payload);
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

		const responseData = await this.httpAdapter.request(url, payload);

		if (responseData.content.balances) {
			const balance = responseData.content.balances.find((b: AccountBalanceInfoInputType) => b.asset === currency);
			return balance ? balance.free : null;
		}
		return null
	}

	async getSymbolInfo(symbol?: string) {
		let url = `${BASE_URL}/api/v3/ticker/24hr`;

		if (symbol) {
			url = `${BASE_URL}/api/v3/ticker/24hr?symbol=${JSON.stringify(symbol)}`;
		}
		const responseData = await this.httpAdapter.request(url);

		if (responseData.content) {
			return responseData.content
		}
		return null
	}

	async getSymbolsInfo(symbol?: string[]) {
		let url = `${BASE_URL}/api/v3/ticker/24hr`;

		if (symbol) {
			url = `${BASE_URL}/api/v3/ticker/24hr?symbols=${JSON.stringify(symbol)}`;
		}
		const responseData = await this.httpAdapter.request(url);
		if (responseData.content) {
			return responseData.content
		}
		return null
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

	private _createSignature(queryString: string, secret: string, algorithm: string = "sha256") {
		return crypto.createHmac(algorithm, secret).update(queryString).digest("hex");
	}



}

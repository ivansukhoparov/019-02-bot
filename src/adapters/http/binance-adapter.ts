import {appSettings} from "../../settings/settings";
import {createSignature} from "./utils/create-signature";
import {FetchAdapter} from "./utils/fetch-adapter";
import {
    AccountBalanceInfoInputType,
    AccountInfoInputType,
    OrderResponseType,
    ResponseErrorType,
    TradableTickerInputType
} from "../../types/fetch-binance/input";

const API_KEY = appSettings.binance.keys.api;
const API_SECRET = appSettings.binance.keys.secret;
const BASE_URL = appSettings.binance.urls.baseUrl;

export class BinanceAdapter {

    static async getAccountInfo(): Promise<AccountInfoInputType | ResponseErrorType> {

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

        return await FetchAdapter.request(url, payload)
    }

    static async placeOrder(symbol: string,
                            quantity: number,
                            side: "buy" | "sell",
                            type: "market" = "market"): Promise<OrderResponseType | ResponseErrorType> {
        // Example:
        // placeOrder("BTCUSDT", 0.001, "BUY");
        const data: any = {
            symbol: symbol.toUpperCase(),
            side: side.toUpperCase(),
            type: type.toUpperCase(),
            //     MARKET:
            //           A Market order (MARKET) is executed immediately at the current market price. You specify
            //           the amount of cryptocurrency you want to buy or sell, and the order is executed at the best
            //           available price at that moment.
            //     LIMIT:
            //          A Limit order (LIMIT) allows you to set a specific price at which you want to buy or sell a
            //          cryptocurrency. The order will be executed only when the market price reaches your
            //          specified price.
            //     STOP_LOSS and STOP_LOSS_LIMIT:
            //          STOP_LOSS and STOP_LOSS_LIMIT orders are used for limiting losses. They are executed when the
            //          price of the cryptocurrency reaches a certain level. A STOP_LOSS order is executed as a market
            //          order when triggered, whereas a STOP_LOSS_LIMIT order is executed as a limit order.
            //     TAKE_PROFIT and TAKE_PROFIT_LIMIT:
            //         These orders are similar to STOP_LOSS but are used for securing profits. They are activated when
            //         the price reaches a certain level that yields profit.
            //     LIMIT_MAKER:
            //          This type of order is used to create limit orders that add liquidity to the market. The order
            //          will be rejected if it would immediately be executed and thus remove liquidity.
            quantity: +quantity,
            // quantity of base currency for sale or buy
            // OR:
            // quoteOrderQty: +quoteOrderQty
            // quantity of quote currency for sale or buy base currency
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

        return await FetchAdapter.request(url, payload)
    }

    static async getAllTradableTickers(...filters: any): Promise<TradableTickerInputType[] | ResponseErrorType> {
        const filter = this._createQueryFilter(arguments)
        const url = 'https://api.binance.com/api/v3/exchangeInfo' + filter;
        return FetchAdapter.request(url)
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
        const balance = responseData.balances.find((b: AccountBalanceInfoInputType) => b.asset === currency);
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



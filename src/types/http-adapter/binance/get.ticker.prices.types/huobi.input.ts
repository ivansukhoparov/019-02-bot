// explanation of each field in the response from the Huobi endpoint https://api.huobi.pro/v1/common/symbols

export type GetTickerPricesInputTypeHuobi =
    {
        "symbol": string
        "open": number
        "high": number
        "low": number
        "close": number
        "amount": number
        "vol": number
        "count": number
        "bid": number
        "bidSize": number
        "ask": number
        "askSize": number
    }


// "data": [
//         {
//                 "symbol": "sylousdt",
//                 "open": 0.001025,
//                 "high": 0.001038,
//                 "low": 0.001012,
//                 "close": 0.001013,
//                 "amount": 300774887.2946,
//                 "vol": 310625.124509883,
//                 "count": 6910,
//                 "bid": 0.001011,
//                 "bidSize": 82293.0199,
//                 "ask": 0.001015,
//                 "askSize": 19704.4334
//         }
//        ...
//        ]
// explanation of each field in the response from the Huobi endpoint https://api.huobi.pro/v1/common/symbols

export type GetAllSymbolsInputTypeHuobi =
    {
        "base-currency": string//  "xlm",  // The base currency of the trading pair. In this case, it's "xlm" (Stellar).
        "quote-currency": string //"husd",  // The quote currency of the trading pair. In this case, it's "husd" (HUSD stablecoin).
        "price-precision": number //6,  //T he number of decimal places allowed for the price of the trading pair. Here, it's 6, meaning prices can be specified up to six decimal places.
        "amount-precision": number //4,  // The number of decimal places allowed for the amount of the base currency in the trading pair. Here, it's 4, meaning amounts can be specified up to four decimal places.
        "symbol-partition": string //"main",  // symbol-partition: The market partition where the symbol belongs. "main" indicates that it belongs to the main trading market.
        "symbol": string //"xlmhusd",  // The symbol representing the trading pair, which is a combination of the base and quote currencies. In this case, it's "xlmhusd".
        "state": string //"offline",  // The current trading status of the symbol. "offline" indicates that the trading for this pair is currently disabled.
        "value-precision": number //8,  // The number of decimal places allowed for the value of the trade (price * amount). Here, it's 8, meaning the value can be specified up to eight decimal places.
        "min-order-amt": number //1,  //  The minimum amount of the base currency required to place an order. In this case, the minimum is 1 XLM.
        "max-order-amt": number //20000000,  // The maximum amount of the base currency allowed in a single order. Here, it's 20,000,000 XLM.
        "min-order-value": number //1,  // The minimum value of an order (in quote currency). Here, the minimum is 1 HUSD.
        "limit-order-min-order-amt": number //1,  // The minimum amount required for a limit order. Here, it's 1 XLM.
        "limit-order-max-order-amt": number //20000000,  // The maximum amount allowed for a limit order. Here, it's 20,000,000 XLM.
        "limit-order-max-buy-amt": number //20000000,  // The maximum amount that can be bought using a limit order. Here, it's 20,000,000 XLM.
        "limit-order-max-sell-amt": number //20000000,  // The maximum amount that can be sold using a limit order. Here, it's 20,000,000 XLM.
        "buy-limit-must-less-than": number //1.1,  // The maximum price allowed for buying (limit order). Here, it must be less than 1.1 HUSD.
        "sell-limit-must-greater-than": number //0.9,  // The minimum price allowed for selling (limit order). Here, it must be greater than 0.9 HUSD.
        "sell-market-min-order-amt":number // 1,  // The minimum amount required for a market sell order. Here, it's 1 XLM.
        "sell-market-max-order-amt": number //2000000,  // The maximum amount allowed for a market sell order. Here, it's 2,000,000 XLM.
        "buy-market-max-order-value": number //140000,  // The maximum value allowed for a market buy order. Here, it's 140,000 HUSD.
        "market-sell-order-rate-must-less-than":number // 0.1,  // The maximum allowable market rate difference for a sell order (as a percentage of the current market rate). Here, it must be less than 0.1.
        "market-buy-order-rate-must-less-than":number // 0.1,  // The maximum allowable market rate difference for a buy order (as a percentage of the current market rate). Here, it must be less than 0.1.
        "api-trading": string //"enabled",  // Indicates whether API trading is enabled for this symbol. "enabled" means API trading is allowed.
        "tags": string// ""  // Tags or labels associated with the trading pair. This field is empty in this response.
    }
// explanation of each field in the response from the Huobi endpoint https://api.huobi.pro/v1/common/symbols
// {
//     "base-currency": "xlm",  // The base currency of the trading pair. In this case, it's "xlm" (Stellar).
//     "quote-currency": "husd",  // The quote currency of the trading pair. In this case, it's "husd" (HUSD stablecoin).
//     "price-precision": 6,  //T he number of decimal places allowed for the price of the trading pair. Here, it's 6, meaning prices can be specified up to six decimal places.
//     "amount-precision": 4,  // The number of decimal places allowed for the amount of the base currency in the trading pair. Here, it's 4, meaning amounts can be specified up to four decimal places.
//     "symbol-partition": "main",  // symbol-partition: The market partition where the symbol belongs. "main" indicates that it belongs to the main trading market.
//     "symbol": "xlmhusd",  // The symbol representing the trading pair, which is a combination of the base and quote currencies. In this case, it's "xlmhusd".
//     "state": "offline",  // The current trading status of the symbol. "offline" indicates that the trading for this pair is currently disabled.
//     "value-precision": 8,  // The number of decimal places allowed for the value of the trade (price * amount). Here, it's 8, meaning the value can be specified up to eight decimal places.
//     "min-order-amt": 1,  //  The minimum amount of the base currency required to place an order. In this case, the minimum is 1 XLM.
//     "max-order-amt": 20000000,  // The maximum amount of the base currency allowed in a single order. Here, it's 20,000,000 XLM.
//     "min-order-value": 1,  // The minimum value of an order (in quote currency). Here, the minimum is 1 HUSD.
//     "limit-order-min-order-amt": 1,  // The minimum amount required for a limit order. Here, it's 1 XLM.
//     "limit-order-max-order-amt": 20000000,  // The maximum amount allowed for a limit order. Here, it's 20,000,000 XLM.
//     "limit-order-max-buy-amt": 20000000,  // The maximum amount that can be bought using a limit order. Here, it's 20,000,000 XLM.
//     "limit-order-max-sell-amt": 20000000,  // The maximum amount that can be sold using a limit order. Here, it's 20,000,000 XLM.
//     "buy-limit-must-less-than": 1.1,  // The maximum price allowed for buying (limit order). Here, it must be less than 1.1 HUSD.
//     "sell-limit-must-greater-than": 0.9,  // The minimum price allowed for selling (limit order). Here, it must be greater than 0.9 HUSD.
//     "sell-market-min-order-amt": 1,  // The minimum amount required for a market sell order. Here, it's 1 XLM.
//     "sell-market-max-order-amt": 2000000,  // The maximum amount allowed for a market sell order. Here, it's 2,000,000 XLM.
//     "buy-market-max-order-value": 140000,  // The maximum value allowed for a market buy order. Here, it's 140,000 HUSD.
//     "market-sell-order-rate-must-less-than": 0.1,  // The maximum allowable market rate difference for a sell order (as a percentage of the current market rate). Here, it must be less than 0.1.
//     "market-buy-order-rate-must-less-than": 0.1,  // The maximum allowable market rate difference for a buy order (as a percentage of the current market rate). Here, it must be less than 0.1.
//     "api-trading": "enabled",  // Indicates whether API trading is enabled for this symbol. "enabled" means API trading is allowed.
//     "tags": ""  // Tags or labels associated with the trading pair. This field is empty in this response.
// },
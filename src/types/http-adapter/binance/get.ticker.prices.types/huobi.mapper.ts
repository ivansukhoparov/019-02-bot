import {GetTickerPricesInputTypeHuobi} from "./huobi.input";
import {GetTickerPricesOutputType} from "./output";


export const GetTickerPricesHuobiMapper = (input: GetTickerPricesInputTypeHuobi): GetTickerPricesOutputType => {
    return {
        symbol: input["symbol"].toUpperCase(),
        price: `${input["close"]}`,
    }
};



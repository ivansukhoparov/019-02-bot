import {GetAllSymbolsInputType} from "./binance.input";
import {GetAllSymbolsOutputType} from "./output";
import {GetAllSymbolsInputTypeHuobi} from "./huobi.input";


export const getAllSymbolsHuobiMapper = (input: GetAllSymbolsInputTypeHuobi): GetAllSymbolsOutputType => {
    const mappedResponse: GetAllSymbolsOutputType = {
        symbol: input["symbol"].toUpperCase(),
        status  :         "UNDEFINED",
        baseAsset: input["base-currency"].toUpperCase(),
        quoteAsset: input["quote-currency"].toUpperCase(),
        filters: {
            minNotional: `${input["min-order-value"]}`,
            minQty: `${input["min-order-amt"]}`,
            minQtyMarket: `${input["min-order-amt"]}`,
            stepSize: convertAmountPrecisionToStepSize(input["amount-precision"]),
            stepSizeMarket: convertAmountPrecisionToStepSize(input["amount-precision"]),
        }
    }

    if (input["state"] === "online" && input["api-trading"] === "enabled") mappedResponse.status = "TRADING"
    else mappedResponse.status = "BREAK"

    return mappedResponse
};

const convertAmountPrecisionToStepSize = (amountPrecision: number) => {
    let result = ""
    for (let i = 0; i < (amountPrecision - 1); i++) {
        result += "0"
    }
    return `0.${result}1`
}



import {FilterTypes, GetAllSymbolsInputType} from "./binance.input";
import {GetAllSymbolsOutputType} from "./output";

export const getAllSymbolsBinanceMapper = (input: GetAllSymbolsInputType): GetAllSymbolsOutputType => {
    const filters = input.filters.reduce((acc: any, filter: any) => {
        switch (filter.filterType) {
            case "NOTIONAL":
                acc.minNotional = filter.minNotional
                break;
            case "LOT_SIZE":
                acc.minQty = filter.minQty
                break;
            case "MARKET_LOT_SIZE":
                acc.minQtyMarket = filter.minQty
                break;
            case "LOT_SIZE":
                acc.stepSize = filter.stepSize
                acc.stepSizeMarket = filter.minNotional
                break;
        }
        return acc
    }, {})


    return {
        symbol: input.symbol,
        status: input.status,
        baseAsset: input.baseAsset,
        quoteAsset: input.quoteAsset,
        filters
    };
};




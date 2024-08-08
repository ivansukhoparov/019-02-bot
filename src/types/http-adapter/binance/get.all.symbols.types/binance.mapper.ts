import {FilterTypes, GetAllSymbolsInputType} from "./binance.input";
import {GetAllSymbolsOutputType} from "./output";

export const getAllSymbolsBinanceMapper = (input: GetAllSymbolsInputType): GetAllSymbolsOutputType => {
    return {
        symbol: input.symbol,
        status: input.status,
        baseAsset: input.baseAsset,
        quoteAsset: input.quoteAsset,
        filters: {
            minNotional: input.filters.find((filter: FilterTypes) => filter.filterType === "NOTIONAL")!["minNotional"],
            minQty: input.filters.find((filter: FilterTypes) => filter.filterType === "LOT_SIZE")!["minQty"],
            minQtyMarket: input.filters.find((filter: FilterTypes) => filter.filterType === "MARKET_LOT_SIZE")!["minQty"],
            stepSize: input.filters.find((filter: FilterTypes) => filter.filterType === "LOT_SIZE")!["stepSize"],
            stepSizeMarket: input.filters.find((filter: FilterTypes) => filter.filterType === "LOT_SIZE")!["stepSize"],
        }
    };
};




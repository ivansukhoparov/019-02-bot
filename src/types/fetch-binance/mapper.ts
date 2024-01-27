import {tickerOutputDataType} from "../web-soket-binance/input";

export const symbolMapper =(input:any):tickerOutputDataType=>{
    return {
        symbol: input.symbol,
        baseAsset: input.baseAsset,
        quoteAsset: input.quoteAsset,
        bid:null,
        ask: null,
        filters: {
            minNotional: input.filters.find((filter:any) => filter.filterType === 'NOTIONAL').minNotional,
            minQty: input.filters.find((filter:any) => filter.filterType === 'LOT_SIZE').minQty,
            minQtyMarket: input.filters.find((filter:any) => filter.filterType === 'MARKET_LOT_SIZE').minQty,
            stepSize:input.filters.find((filter:any) => filter.filterType === 'LOT_SIZE').stepSize,
            stepSizeMarket:input.filters.find((filter:any) => filter.filterType === 'LOT_SIZE').stepSize,
        }
    }
}

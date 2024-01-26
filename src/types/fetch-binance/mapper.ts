import {tickerOutputDataType} from "../web-soket-binance/input";

export const symbolMapper =(input:any):tickerOutputDataType=>{
    return {
        symbol: input.symbol,
        baseAsset: input.baseAsset,
        quoteAsset: input.quoteAsset,
        bid:null,
        ask: null,
        filters: {
            minNotional: input.filters.find((filterType: string) => filterType === 'NOTIONAL').minNotional,
            minQty: input.filters.find((filterType: string) => filterType === 'LOT_SIZE').minQty,
            minQtyMarket: input.filters.find((filterType: string) => filterType === 'MARKET_LOT_SIZE').minQty
        }
    }
}

import {TradingSymbolsType} from "./input";

export const symbolMapper =(input:any):TradingSymbolsType=>{
    return {
        symbol: input.symbol,
        baseAsset: input.baseAsset,
        quoteAsset: input.quoteAsset
    }
}

import {TradingSymbolsType} from "./input";
import {tickerOutputDataType} from "../web-soket-binance/input";

export const symbolMapper =(input:any):tickerOutputDataType=>{
    return {
        symbol: input.symbol,
        baseAsset: input.baseAsset,
        quoteAsset: input.quoteAsset,
        bid:null,
        ask:null
    }
}

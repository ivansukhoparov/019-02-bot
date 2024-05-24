import {ApiResponseType} from "../../../types/fetch-binance/input";

export interface MarketHttpAdapterInterface{
     getAllSymbols(): Promise<ApiResponseType>
     getTickerPrices(): Promise<ApiResponseType>
}
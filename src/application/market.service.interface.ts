import {ApiResponseType} from "../types/fetch-binance/input";


export interface IMarketService {
    createOrder(currentCurrency: string, targetCurrency: string, amount: number, symbolsDataSet: any): Promise<ApiResponseType>

    getSymbolsInfo(symbols: string[]): Promise<any>

    getSymbolInfo(symbol: string): Promise<any>

    _getSymbol(currentCurrency: string, targetCurrency: string, symbolsDataSet: any): any
}
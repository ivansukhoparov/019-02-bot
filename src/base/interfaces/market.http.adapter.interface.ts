import {ApiResponseType, OrderSide, OrderTypeType, ResponseType} from "../../types/fetch-binance/input";
import {GetAllSymbolsOutputType} from "../../types/http-adapter/binance/get.all.symbols.types/output";

export interface IMarketHttpAdapter {


    getAccountInfo(): Promise<ApiResponseType>

    getTickerPrices(): Promise<ApiResponseType>

    placeOrder(symbol: string,
               quantityType: "quantity" | "quoteOrderQty",
               quantityAmount: number,
               side: OrderSide,
               type?: OrderTypeType): Promise<ApiResponseType>

    getAllSymbols():  Promise<ResponseType<Array<GetAllSymbolsOutputType>>>

    getAllAvailableTickers(): Promise<any>

    getAllWallets(): Promise<any>

    convertCurrency(quoteAsset: string, baseAsset: string, amount: number): Promise<any>

    getCurrencyBalance(currency: string): Promise<any>

    getSymbolInfo(symbol: string): Promise<any>

    getSymbolsInfo(symbols: string[]): Promise<any>

     getDepth(symbol: string): Promise<any>

    _createQueryFilter(...filters: any): string

    _createSignature(queryString: string, secret: string, algorithm: string): string

    _responseMapper(response: any): ApiResponseType

}
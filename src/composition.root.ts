import {BinanceHttpAdapter} from "./adapters/http/binance.http.adapter";
import {HttpAdapterInterface} from "./adapters/http/interfaces/http.adapter.interface";
import {FetchAdapter} from "./adapters/http/utils/fetch.adapter";
import {MarketHttpAdapterInterface} from "./adapters/http/interfaces/market.http.adapter.interface";
import {AvailableSymbols} from "./services/classes/available.symbols";
import {SequencesDataSet} from "./services/classes/sequences.data.set";
import {SymbolsDataSet} from "./services/classes/symbols.data.set";


const httpAdapter: HttpAdapterInterface = new FetchAdapter()
const marketHttpAdapter: MarketHttpAdapterInterface = new BinanceHttpAdapter()

const availableSymbols: AvailableSymbols = new AvailableSymbols()
const symbolsDataSet: SymbolsDataSet = new SymbolsDataSet()
const sequencesDataSet: SequencesDataSet = new SequencesDataSet()

export const ioc = {
    httpAdapter: httpAdapter,
    marketHttpAdapter: marketHttpAdapter,
    availableSymbols: availableSymbols,
    symbolsDataSet: symbolsDataSet,
    sequencesDataSet: sequencesDataSet
}

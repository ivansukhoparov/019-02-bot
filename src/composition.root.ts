import "reflect-metadata"
import {Container} from "inversify";
import {HttpAdapterInterface} from "./base/interfaces/http.adapter.interface";
import {FetchAdapter} from "./base/adapters/common/fetch.adapter";
import {MarketHttpAdapterInterface} from "./base/interfaces/market.http.adapter.interface";
import {BinanceHttpAdapter} from "./base/adapters/markets/binance/binance.http.adapter";
import {IMarketService} from "./base/interfaces/market.service.interface";
import {MarketService} from "./base/services/market-service";
import {AvailableSymbols} from "./base/services/data.sets/available.symbols";
import {SymbolsDataSet} from "./base/services/data.sets/symbols.data.set";
import {SequencesDataSet} from "./base/services/data.sets/sequences.data.set";
import {TradeCore} from "./core/trade.core";



export const container = new Container()
export const TYPE ={
    HttpAdapter: Symbol.for("HttpAdapter"),
    MarketHttpAdapter: Symbol.for("MarketHttpAdapter"),
    MarketService: Symbol.for("MarketService"),
}


container.bind<HttpAdapterInterface>(TYPE.HttpAdapter).to(FetchAdapter).inSingletonScope()
container.bind<MarketHttpAdapterInterface>(TYPE.MarketHttpAdapter).to(BinanceHttpAdapter).inSingletonScope()
container.bind<IMarketService>(TYPE.MarketService).to(MarketService).inSingletonScope()

container.bind<AvailableSymbols>(AvailableSymbols).toSelf().inSingletonScope()
container.bind<SymbolsDataSet>(SymbolsDataSet).toSelf().inSingletonScope()
container.bind<SequencesDataSet>(SequencesDataSet).toSelf().inSingletonScope()

container.bind<TradeCore>(TradeCore).toSelf().inSingletonScope()


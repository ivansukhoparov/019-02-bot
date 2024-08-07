import "reflect-metadata"
import {Container} from "inversify";
import {AppSettings} from "./settings/settings";
import {IHttpAdapter} from "./base/interfaces/http.adapter.interface";
import {FetchAdapter} from "./base/adapters/common/fetch.adapter";
import {IMarketHttpAdapter} from "./base/interfaces/market.http.adapter.interface";
import {BinanceHttpAdapter} from "./base/adapters/markets/binance/binance.http.adapter";
import {IMarketService} from "./base/interfaces/market.service.interface";
import {MarketService} from "./base/services/market-service";
import {AvailableSymbols} from "./base/services/data.sets/available.symbols";
import {SymbolsDataSet} from "./base/services/data.sets/symbols.data.set";
import {SequencesDataSet} from "./base/services/data.sets/sequences.data.set";
import {TradeCore} from "./core/trade.core";


export const TYPE ={
    HttpAdapter: "HttpAdapter",
    MarketHttpAdapter: "MarketHttpAdapter",
    MarketService:"MarketService",
}

export const container = new Container()

 container.bind<IHttpAdapter>("HttpAdapter").to(FetchAdapter).inSingletonScope()
 container.bind<IMarketHttpAdapter>("MarketHttpAdapter").to(BinanceHttpAdapter).inSingletonScope()
container.bind<IMarketService>('MarketService').to(MarketService).inSingletonScope()

 container.bind<AvailableSymbols>(AvailableSymbols).toSelf().inSingletonScope()
 container.bind<SymbolsDataSet>(SymbolsDataSet).toSelf().inSingletonScope()
 container.bind<SequencesDataSet>(SequencesDataSet).toSelf().inSingletonScope()

// container.bind<TradeCore>(TradeCore).toSelf().inSingletonScope()


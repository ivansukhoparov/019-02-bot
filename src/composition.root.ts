import {BinanceHttpAdapter} from "./adapters/markets/binance/binance.http.adapter";
import {HttpAdapterInterface} from "./base/interfaces/http.adapter.interface";
import {FetchAdapter} from "./adapters/common/fetch.adapter";
import {MarketHttpAdapterInterface} from "./base/interfaces/market.http.adapter.interface";
import {AvailableSymbols} from "./services/classes/available.symbols";
import {SequencesDataSet} from "./services/classes/sequences.data.set";
import {SymbolsDataSet} from "./services/classes/symbols.data.set";
import {Container} from "inversify";
import {appSettings} from "./index";
import {TradeCore} from "./core/trade.core";
import {MarketService} from "./application/market-service";
import {IMarketService} from "./base/interfaces/market.service.interface";

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


import {MarketHttpAdapterInterface} from "../../interfaces/market.http.adapter.interface";
import {TickerOutputDataType} from "../../../types/web-soket-binance/input";
import {symbolMapper} from "../../../types/fetch-binance/mapper";
import {inject, injectable} from "inversify";

@injectable()
export class AvailableSymbols {
    private availableSymbols: Array<any> = []
    protected marketAdapter: MarketHttpAdapterInterface

    constructor(@inject("MarketHttpAdapter") marketAdapter: MarketHttpAdapterInterface) {
        this.marketAdapter = marketAdapter
    }

    async init() {
        // Get all symbols and all prices
        const allSymbolsPromise = this.marketAdapter.getAllSymbols();
        const allPricesPromise = this.marketAdapter.getTickerPrices();
        // const [allSymbols, allPrices] = await

        const [allSymbols, allPrices] = await Promise.all([allSymbolsPromise, allPricesPromise])

        const symbols: TickerOutputDataType[] = allSymbols.content.symbols
            .filter((el: any) => el.status === "TRADING")
            .map(symbolMapper);


        //
        // status: Этот ключ указывает на текущее состояние торговой пары. Если значение status равно "TRADING",
        // это означает, что пара активна и торгуется. "BREAK" означает, что торговля по этой паре в данный момент
        // приостановлена или не проводится.
        //

        const prices = allPrices.content.reduce((acc: any, el: any) => {
            acc[el.symbol] = el.price;
            return acc;
        }, {});

        this.availableSymbols = symbols.map((el: any) => {
            const symbol = el.baseAsset + el.quoteAsset;
            return {
                ...el,
                price: prices[symbol],
            };
        });

    }

    get() {
        return this.availableSymbols
    }
}
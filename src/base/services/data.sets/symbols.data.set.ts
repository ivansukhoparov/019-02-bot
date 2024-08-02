import {AvailableSymbols} from "./available.symbols";
import {MarketUpdateDataType} from "../../../types/web-soket-binance/output";
import {inject, injectable} from "inversify";

@injectable()
export class SymbolsDataSet {
    private symbolsDataSet: any
    protected availableSymbols: AvailableSymbols

    constructor(@inject(AvailableSymbols) availableSymbols: AvailableSymbols) {
        this.availableSymbols = availableSymbols
        this.symbolsDataSet = this.init()
    }

    init() {
        return this.availableSymbols.get().reduce((acc: any, el: any) => {
            acc[el.symbol] = el;
            delete acc[el.symbol].symbol;
            return acc;
        }, {});
    }

    get() {
        return this.symbolsDataSet
    }

    update(marketData: MarketUpdateDataType[]) {
        marketData.forEach((el: MarketUpdateDataType) => {
            for (let i = 1; i < 10; i++) {
                if (this.symbolsDataSet[this._addSlashToSymbol(el.symbol, i)]) {
                    this.symbolsDataSet[this._addSlashToSymbol(el.symbol, i)].bid = el.bidPrice;
                    this.symbolsDataSet[this._addSlashToSymbol(el.symbol, i)].ask = el.askPrice
                    this.symbolsDataSet[this._addSlashToSymbol(el.symbol, i)].priceChange24Per = el.priceChange24Per
                }
            }
        });
    }

    _addSlashToSymbol(symbol: string, pos: number) {
        return symbol.slice(0, pos) + "/" + symbol.slice(pos);
    }

    //      receive : getAllTradableSymbols()
    //      function receive an array of symbols available to trade created by function getAllTradableSymbols()
    //      and convert it to symbolsDataSet object to increase speed of processing data set
    //------------------------------------------------------------------------------
    //      Now it has view model like this:
    //      {...
    //      MAVT/USD: { baseAsset: 'MAV',
    //                 quoteAsset: 'TUSD',
    //                 bid: null,
    //                 ask: null,
    //                 filters: {
    //                            minNotional: '0.00100000',
    //                            minQty: '0.01000000',
    //                            minQtyMarket: '0.00000000'
    //                            }
    //                  },
    //      ...}

}
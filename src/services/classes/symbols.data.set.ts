import {AvailableSymbols} from "./available.symbols";
import {ioc} from "../../composition.root";

export class SymbolsDataSet {
    private symbolsDataSet: any

    constructor(protected availableSymbols: AvailableSymbols = ioc.availableSymbols) {
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
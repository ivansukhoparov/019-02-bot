import {container} from "./composition.root";
import {AvailableSymbols} from "./base/services/data.sets/available.symbols";
import {SymbolsDataSet} from "./base/services/data.sets/symbols.data.set";
import {SequencesDataSet} from "./base/services/data.sets/sequences.data.set";
import {wsUpdate} from "./base/adapters/markets/binance/binance.websoket";
import {TradeCore} from "./core/trade.core";

const availableSymbols = container.resolve<AvailableSymbols>(AvailableSymbols)
const symbolsDataSet = container.resolve<SymbolsDataSet>(SymbolsDataSet)
const sequencesDataSet = container.resolve<SequencesDataSet>(SequencesDataSet)
const tradeCore = container.resolve<TradeCore>(TradeCore)
export const appInit = async () => {
    await availableSymbols.init()
    console.log(new Date().toISOString(), "Symbols available to trade has been received from server")
    console.log("Received " + availableSymbols.get().length + " coins available for trade")

    symbolsDataSet.init()
    console.log(new Date().toISOString(), "Raw data has been formatted")


    sequencesDataSet.init()
    console.log(new Date().toISOString(), "Sequences has been created")
    console.log("Created " + sequencesDataSet.get().length + " sequences")


    wsUpdate(tradeCore)
};

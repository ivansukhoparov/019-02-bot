import {getAllTradableSymbols} from "./services/get-all-tradable-symbols";
import {createSymbolsDataSet} from "./services/preparing-symbols";
import {createSequencesDataSet} from "./services/create-sequences-data-set";
import {TradeCore} from "./core/trade.core";
import {wsUpdate} from "./adapters/websoket/binance.websoket";

export const init = async () => {
    const allTradableSymbols = await getAllTradableSymbols();
    const symbolsDataSet = await createSymbolsDataSet(allTradableSymbols);
    const sequencesDataSet = await createSequencesDataSet(allTradableSymbols, symbolsDataSet);
    return new TradeCore(0.1, 100, symbolsDataSet, sequencesDataSet)
}
export const app = async () => {
    const binanceCore = await init();
    console.log("app initiated")
    await new Promise(resolve => setTimeout(resolve, 1000));
    wsUpdate(binanceCore);
};

import {BinanceAdapter} from "./adapters/http/binance-adapter";


import {getAllTradableSymbols} from "./services/get-all-tradable-symbols";
import {createSequencesDataSet, createSymbolsDataSet} from "./services/preparing-symbols";
import {wsUpdate} from "./adapters/websokets/websoket-adapter";

require('dotenv').config();

const app = async () => {
    const allTradableSymbols = await getAllTradableSymbols();
    const symbolsDataSet = await createSymbolsDataSet(allTradableSymbols);
    const sequencesDataSet = await createSequencesDataSet(allTradableSymbols, symbolsDataSet);
    wsUpdate(symbolsDataSet, sequencesDataSet);
}


const startApp = async ()=>{
    try {

    } catch (err) {
        console.log(err)
    }
}

startApp();

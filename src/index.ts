require('dotenv').config();
import {BinanceAdapter} from "./adapters/http/binance-adapter";
import {preparingSymbols} from "./services/preparing-symbols";



const startApp = async ()=>{
    try {


        const {symbolsDataSet, allSequences}:any = await preparingSymbols()
        console.log(allSequences)
        // symbols - is dataset with all tradable symbols(pairs) at now with information about base, quote, ask adn bid
        // for example:
        // ...
        // MAVTUSD: { baseAsset: 'MAV', quoteAsset: 'TUSD', bid: null, ask: null },
        // CFXTUSD: { baseAsset: 'CFX', quoteAsset: 'TUSD', bid: null, ask: null },
        // ...
        // ask and bid when it is create is null. It will update through websocket

        // console.log(symbols)
        // console.log(allSequences)


    } catch (err) {
        console.log(err)
    }
}
startApp();

import {tradeAllSequence, tradeThis} from "./services/trade-sequence";

require('dotenv').config();
import {BinanceAdapter} from "./adapters/http/binance-adapter";
import {preparingSymbols} from "./services/preparing-symbols";
import {TradeInstructionType, TradeSequenceType} from "./types/sequences";
import {orderQuantity} from "./common/common";

import {getAllTradableSymbols} from "./services/get-all-tradable-symbols";

const seq: TradeSequenceType = {
    firstSymbol: {symbol: 'BNB/USDT', currentCurrency: 'USDT', action: 'buy', price: null},
    secondSymbol: {symbol: 'MATIC/BNB', currentCurrency: 'BNB', action: 'buy', price: null},
    thirdSymbol: {symbol: 'MATIC/USDT', currentCurrency: 'USDT', action: 'sell', price: null}
}

const tradeInstruction: TradeInstructionType = seq.thirdSymbol;

const startApp = async ()=>{
    try {
// console.log(await BinanceAdapter.getAccountInfo())
        //const btcAmount = await BinanceAdapter.getCurrencyBalance("BTC")
// await BinanceAdapter.placeOrder("BTCUSDT",orderQuantity.quote,500,"sell")
        console.log(await BinanceAdapter.placeOrder("MATICUSDT",orderQuantity.quote, 5,"sell"))
//await tradeThis({symbol: 'BNB/USDT', currentCurrency: 'BNB', action: 'sell', price: null})


        const b = await BinanceAdapter.getAllSymbols()
        console.log(b.content.symbols.filter((s:any)=>s.symbol==="MATICUSDT")[0])
        // const a = await BinanceAdapter.getAllSymbols()
        // console.log(a.content.symbols.filter((s:any)=>s.symbol==="MATICUSDT")[0])


        console.log("USDT  " + await BinanceAdapter.getCurrencyBalance("USDT"))
        console.log("BNB  " + await BinanceAdapter.getCurrencyBalance("BNB"))
        console.log("MATIC  " + await BinanceAdapter.getCurrencyBalance("MATIC"))
       //  console.log("======================================================")
       //  await tradeAllSequence(seq)
       //  console.log("======================================================")
       //  console.log("USDT  " + await BinanceAdapter.getCurrencyBalance("USDT"))
       //  console.log("BNB  " + await BinanceAdapter.getCurrencyBalance("BNB"))
       //  console.log("MATIC  " + await BinanceAdapter.getCurrencyBalance("MATIC"))



        // const ad = await tradeThis(tradeInstruction)
        // console.log(ad)
        // console.log(await BinanceAdapter.getCurrencyBalance("USDT"))

        // const {symbolsDataSet, allSequences}:any = await preparingSymbols()
        // console.log(symbolsDataSet)

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

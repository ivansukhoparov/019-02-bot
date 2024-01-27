import {BinanceAdapter} from "./adapters/http/binance-adapter";
import {TradeInstructionType, TradeSequenceType} from "./types/sequences";

import {getAllTradableSymbols} from "./services/get-all-tradable-symbols";
import {createSequencesDataSet, createSymbolsDataSet} from "./services/preparing-symbols";
import {wsUpdate} from "./adapters/websokets/websoket-adapter";
import {orderQuantity} from "./common/common";
import {logCurrencyAmount} from "./common/utils/logs";

require('dotenv').config();

const seq: TradeSequenceType = {
    firstSymbol: {
        symbol: 'ETH/USDT',
        currentCurrency: 'USDT',
        action: 'buy',
        price: null,
        filters: {
            minNotional: '5.00000000',
            minQty: '0.00010000',
            minQtyMarket: '0.00000000',
            stepSize: '0.00010000',
            stepSizeMarket: '0.00010000'
        }
    },
    secondSymbol: {
        symbol: 'LINK/ETH',
        currentCurrency: 'ETH',
        action: 'buy',
        price: null,
        filters: {
            minNotional: '0.00100000',
            minQty: '0.01000000',
            minQtyMarket: '0.00000000',
            stepSize: '0.01000000',
            stepSizeMarket: '0.01000000'
        }
    },
    thirdSymbol: {
        symbol: 'LINK/USDT',
        currentCurrency: 'LINK',
        action: 'sell',
        price: null,
        filters: {
            minNotional: '5.00000000',
            minQty: '0.01000000',
            minQtyMarket: '0.00000000',
            stepSize: '0.01000000',
            stepSizeMarket: '0.01000000'
        }
    }
}



const tradeInstruction: TradeInstructionType = seq.thirdSymbol;

const app = async () => {
    const allTradableSymbols = await getAllTradableSymbols();
    const symbolsDataSet = await createSymbolsDataSet(allTradableSymbols);
    const sequencesDataSet = await createSequencesDataSet(allTradableSymbols, symbolsDataSet);
    wsUpdate(symbolsDataSet, sequencesDataSet);
}


const info = async () => {
    const info = await BinanceAdapter.getAccountInfo()
    console.log(info.content)
}

const startApp = async ()=>{
    try {

        const b = "USDT"
        const q = "RUB"
        const d = await BinanceAdapter.placeOrder(b + q, orderQuantity.quote, 1287, "buy")

        const t = await BinanceAdapter.getAllSymbols()
        console.log(t.content.symbols.filter((s: any) => s.symbol === (b + q))[0])

        console.log(d.content)
        await logCurrencyAmount(b);
        await logCurrencyAmount(q);




        //  setInterval(() => {
        //      info()
        //  }, 1000 * 60 * 30);
        //
        // await info();
        // await app();


        // ETH - 0.00006385
        // BTC - 0.00626206
        // BNB - 0.05223830
        // USDT - 0.26474397
        // TUSD - 0.86755570
        // USDC - 6495.28716120
        // FTM - 0.30000000
        // WIN - 18446.00000000
        // NGN - 18466.00000000
        // RUB - 3934.37331000
        // TRY - 16985.70266000
        // EUR - 13154.90166600
        // ZAR - 18466.00000000
        // IDRT - 18466.00
        // UAH - 18466.00000000
        // BIDR - 158.00
        // DAI - 5211.17201200
        // WBTC - 0.48398000
        // BRL - 2728.32211100
        // NEAR - 0.02500000
        // SHIB - 18446.00
        // XEC - 18446.00
        // GALA - 11157055.00000000
        // BTTC - 18446.0
        // GAL - 3196.60200000
        // EPX - 18446.00000000
        // LUNC - 18446.00000000
        // PLN - 3.79350000
        // RON - 18466.00000000
        // ARS - 18466.00000000
        // PEPE - 18446.00
        // FLOKI - 18446.00
        // FDUSD - 87.07226160
        // VAI - 18466.00000000
        // BONK - 18446.00



        //await logCurrencyAmount("USDT");
        // for (let i = 0; i<1;i++){
        //
        //     const d=await BinanceAdapter.placeOrder("GALAUSDT",orderQuantity.quote, 70,"sell")
        //     console.log(d.type)
        //     //  await sellAllThis("GALA")
        //     await logCurrencyAmount("GALA");
        //     await logCurrencyAmount("USDT");
        //     await new Promise(resolve => setTimeout(resolve, 2500));
        // }


        // Leave 100 USDT


        // await sellAllThis("PEPE")
        // await logCurrencyAmount("PEPE");
        // console.log("======================================================")

        // FIND BALANCES GR THAN 0
        // const all =await  BinanceAdapter.getAllAvailableTickers()
        //
        // for (let i=0;i<all.length;i++){
        //     const currencyAmount = await BinanceAdapter.getCurrencyBalance(all[i]);
        //     if (currencyAmount>0 && all[i]!=="USDT"&&all[i]!=="GALA"&&all[i]!=="GAL"){
        //         console.log(all[i] + " currencyAmount is  "+ currencyAmount)
        //         await sellAllThistoBTC(all[i])
        //         console.log("======================================================")
        //     }
        // }

        //
        // SELL ALL
        // await BinanceAdapter.placeOrder("ETHBTC",orderQuantity.quote, 0.02,"sell")
        // await logCurrencyAmount("BTC")
        // //SELL ALL
        // const all =await  BinanceAdapter.getAllAvailableTickers()
        //
        // for (let i=0;i<all.length;i++){
        //     await sellAllThis(all[i])
        //     await logCurrencyAmount(all[i]);
        //     console.log("======================================================")
        // }


// GET ALL BALANCES GRATER THAN 0
        // await logPositiveBalances()


        // START APP
        // await app();
        // asyncLogCurrencyAmount("ETH");
        // // TEST CURRECY CONVERTATION
        // IT DOESNT WORK WITH TESTNET
        // const q = "GAL"
        // const b = "BTC"
        // const a = 1
        // console.log("ETH  " + await BinanceAdapter.getCurrencyBalance("ETH"))
        // await logCurrencyAmount(q);
        // await logCurrencyAmount(b);
        // const res = await BinanceAdapter.covertCurrency(q, b, a)
        // console.log(res)

        // console.log("USDT  " + roundDownNumber(await BinanceAdapter.getCurrencyBalance("USDT"),0.001))
//         console.log("ETH  " + await BinanceAdapter.getCurrencyBalance("ETH"))
//         console.log("LINK  " + await BinanceAdapter.getCurrencyBalance("LINK"))
//         console.log("======================================================")
//         await tradeAllSequence(seq)

        // ===================================================================
// console.log(await BinanceAdapter.getAccountInfo())
        //const btcAmount = await BinanceAdapter.getCurrencyBalance("BTC")
// await BinanceAdapter.placeOrder("BTCUSDT",orderQuantity.quote,500,"sell")
//         console.log(await BinanceAdapter.placeOrder("MATICUSDT",orderQuantity.quote, 5,"sell"))
// //await tradeThis({symbol: 'BNB/USDT', currentCurrency: 'BNB', action: 'sell', price: null})
//
//
//         const b = await BinanceAdapter.getAllSymbols()
//         console.log(b.content.symbols.filter((s:any)=>s.symbol==="MATICUSDT")[0])
//         // const a = await BinanceAdapter.getAllSymbols()
//         // console.log(a.content.symbols.filter((s:any)=>s.symbol==="MATICUSDT")[0])
//
//
//         console.log("USDT  " + roundDownNumber(await BinanceAdapter.getCurrencyBalance("USDT"),0.001))
//         console.log("ETH  " + await BinanceAdapter.getCurrencyBalance("ETH"))
//         console.log("LINK  " + await BinanceAdapter.getCurrencyBalance("LINK"))
//         console.log("======================================================")
//         await tradeAllSequence(seq)
//         console.log("======================================================")
//         console.log("USDT  " + await BinanceAdapter.getCurrencyBalance("USDT"))
//         console.log("ETH  " + await BinanceAdapter.getCurrencyBalance("ETH"))
//         console.log("LINK  " + await BinanceAdapter.getCurrencyBalance("LINK"))


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

// import {logCurrencyAmount} from "../../common/utils/logs";
// import {BinanceHttpAdapterOLD} from "../../adapters/http/binanceHttpAdapterOLD";
// import {getAllTradableSymbols} from "../../services/get-all-tradable-symbols";
// import {createSymbolsDataSet, getUniqueCoins} from "../../services/preparing-symbols";
// import {MarketService} from "../../application/market-service";
//
// export const iotaToUsdt = async (usdt:number) => {
//     console.log("============================================================")
//     await logCurrencyAmount("IOTA")
//     await logCurrencyAmount("USDT")
//     await BinanceHttpAdapterOLD.placeOrder("IOTAUSDT", "quoteOrderQty", usdt, "sell", "market")
//     await logCurrencyAmount("IOTA")
//     await logCurrencyAmount("USDT")
//     console.log("============================================================")
// }
// export const sellAllToUsdt = async () => {
//     const allTradableSymbols = await getAllTradableSymbols();
//     const symbolsDataSet = await createSymbolsDataSet(allTradableSymbols);
//     const tradableCoins = getUniqueCoins(allTradableSymbols);
//
//     for (let i = 0; i < tradableCoins.length; i++) {
//         const currentCoin = tradableCoins[i];
//         const currentCoinAmountBefore = await BinanceHttpAdapterOLD.getCurrencyBalance(currentCoin);
//         try {
//             await MarketService.createOrder(currentCoin, "USDT", currentCoinAmountBefore, symbolsDataSet)
//             const currentCoinAmountAfter = await BinanceHttpAdapterOLD.getCurrencyBalance(currentCoin);
//             const usdtAmountAfter = await BinanceHttpAdapterOLD.getCurrencyBalance("USDT");
//             const message = `${currentCoin}  ${currentCoinAmountBefore} || ${currentCoinAmountAfter} - ${currentCoin} and ${usdtAmountAfter} - USDT`
//             console.log(message);
//         } catch (e) {
//             // console.log(e);
//         }
//     }
// }

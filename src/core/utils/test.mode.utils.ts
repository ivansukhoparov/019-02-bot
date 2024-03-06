import {logCurrencyAmount} from "../../common/utils/logs";
import {BinanceHttpAdapter} from "../../adapters/http/binance.http.adapter";
import {getAllTradableSymbols} from "../../services/get-all-tradable-symbols";
import {createSymbolsDataSet, getUniqueCoins} from "../../services/preparing-symbols";
import {BinanceService} from "../../application/binance-service";

export const iotaToUsdt = async (usdt:number) => {
    console.log("============================================================")
    await logCurrencyAmount("IOTA")
    await logCurrencyAmount("USDT")
    await BinanceHttpAdapter.placeOrder("IOTAUSDT", "quoteOrderQty", usdt, "sell", "market")
    await logCurrencyAmount("IOTA")
    await logCurrencyAmount("USDT")
    console.log("============================================================")
}
export const sellAllToUsdt = async () => {
    const allTradableSymbols = await getAllTradableSymbols();
    const symbolsDataSet = await createSymbolsDataSet(allTradableSymbols);
    const tradableCoins = getUniqueCoins(allTradableSymbols);

    for (let i = 0; i < tradableCoins.length; i++) {
        const currentCoin = tradableCoins[i];
        const currentCoinAmountBefore = await BinanceHttpAdapter.getCurrencyBalance(currentCoin);
        try {
            await BinanceService.createOrder(currentCoin, "USDT", currentCoinAmountBefore, symbolsDataSet)
            const currentCoinAmountAfter = await BinanceHttpAdapter.getCurrencyBalance(currentCoin);
            const usdtAmountAfter = await BinanceHttpAdapter.getCurrencyBalance("USDT");
            const message = `${currentCoin}  ${currentCoinAmountBefore} || ${currentCoinAmountAfter} - ${currentCoin} and ${usdtAmountAfter} - USDT`
            console.log(message);
        } catch (e) {
            // console.log(e);
        }
    }
}

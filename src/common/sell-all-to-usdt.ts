import {getAllTradableSymbols} from "../services/get-all-tradable-symbols";
import {createSymbolsDataSet, getUniqueCoins} from "../services/preparing-symbols";
import {BinanceAdapter} from "../adapters/http/binance-adapter";
import {BinanceService} from "../application/binance-service";

export const sellAllToUsdt = async () => {
    const allTradableSymbols = await getAllTradableSymbols();
    const symbolsDataSet = await createSymbolsDataSet(allTradableSymbols);
    const tradableCoins = getUniqueCoins(allTradableSymbols);

    for (let i = 0; i < tradableCoins.length; i++) {
        console.log("===========================================")
        const currentCoin = tradableCoins[i];
        const currentCoinAmountBefore = await BinanceAdapter.getCurrencyBalance(currentCoin);

        try {
            console.log(await BinanceService.createOrder(currentCoin, "USDT", currentCoinAmountBefore, symbolsDataSet))
            const currentCoinAmountAfter = await BinanceAdapter.getCurrencyBalance(currentCoin);
            const usdtAmountAfter = await BinanceAdapter.getCurrencyBalance("USDT");
            const message = `${currentCoin}  ${currentCoinAmountBefore} || ${currentCoinAmountAfter} - ${currentCoin} and ${usdtAmountAfter} - USDT`
            console.log(message);
        } catch (e) {
           // console.log(e);
        }
    }

}

import {logCurrencyAmount, logPositiveBalances} from "./logs";
import {BinanceHttpAdapter} from "../../adapters/http/binance.http.adapter";
import {sellAllToUsdt} from "../../core/utils/test.mode.utils";

const normaliseWallets = async () => {
    await logPositiveBalances()
    await sellAllToUsdt()
    await logPositiveBalances()
    await logCurrencyAmount("IOTA")
    await logCurrencyAmount("USDT")
    let totalUsdtAmount = await BinanceHttpAdapter.getCurrencyBalance("USDT");
    let amount = 1000;
    const count = Math.floor(totalUsdtAmount / 1000);
    for (let i = 0; i < count; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await BinanceHttpAdapter.placeOrder("IOTAUSDT", "quoteOrderQty", amount, "buy", "market")

        await logCurrencyAmount("USDT")
        await logCurrencyAmount("IOTA")
        console.log("============================================================")
    }
    totalUsdtAmount = await BinanceHttpAdapter.getCurrencyBalance("USDT");
    amount = totalUsdtAmount - 100;
    await BinanceHttpAdapter.placeOrder("IOTAUSDT", "quoteOrderQty", amount, "buy", "market")
    await logCurrencyAmount("USDT")
    await logCurrencyAmount("IOTA")
    console.log("============================================================")
}

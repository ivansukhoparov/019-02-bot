import {logCurrencyAmount, logPositiveBalances} from "./logs";
import {sellAllToUsdt} from "../sell-all-to-usdt";
import {BinanceAdapter} from "../../adapters/http/binance-adapter";

const normaliseWallets = async () => {
    await logPositiveBalances()
    await sellAllToUsdt()
    await logPositiveBalances()
    await logCurrencyAmount("IOTA")
    await logCurrencyAmount("USDT")
    let totalUsdtAmount = await BinanceAdapter.getCurrencyBalance("USDT");
    let amount = 1000;
    const count = Math.floor(totalUsdtAmount / 1000);
    for (let i = 0; i < count; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await BinanceAdapter.placeOrder("IOTAUSDT", "quoteOrderQty", amount, "buy", "market")

        await logCurrencyAmount("USDT")
        await logCurrencyAmount("IOTA")
        console.log("============================================================")
    }
    totalUsdtAmount = await BinanceAdapter.getCurrencyBalance("USDT");
    amount = totalUsdtAmount - 100;
    await BinanceAdapter.placeOrder("IOTAUSDT", "quoteOrderQty", amount, "buy", "market")
    await logCurrencyAmount("USDT")
    await logCurrencyAmount("IOTA")
    console.log("============================================================")
}

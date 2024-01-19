import {tickerOutputDataType} from "../types/web-soket-binance/input";


export const getExchangePairs = (symbols: tickerOutputDataType[]) => {
    return symbols.filter((el: tickerOutputDataType) => el.quoteAsset === 'USDT')
        .map((el: tickerOutputDataType) => {
            return {
                symbol: el.symbol,
                exchangeRate: el.ask
            }
        })
        .filter((el: any) => el.symbol !== undefined && el.exchangeRate !== undefined )
}


//
// function findArbitrageOpportunities() {
//     const opportunities = [];
//     const THRESHOLD = 10; // Пример порогового значения
//     const exchangeRates = {
//         'EURUSD': 1.1,  // Пример курса обмена, на практике нужно обновлять реальными данными
//     };
//
//     if (prices['BTCUSDT'] && prices['BTCEUR'] && exchangeRates['EURUSD']) {
//         // Конвертируем цену BTC/EUR в USD
//         const btcPriceInUSDFromEUR = prices['BTCEUR'] * exchangeRates['EURUSD'];
//
//         const priceDifference = prices['BTCUSDT'] - btcPriceInUSDFromEUR;
//         if (Math.abs(priceDifference) > THRESHOLD) {
//             opportunities.push({
//                 pair: 'BTC/USD - BTC/EUR',
//                 difference: priceDifference
//             });
//         }
//     }
//     return opportunities;
// }

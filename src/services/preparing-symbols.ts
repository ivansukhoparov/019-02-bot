import {getAllTradableTickers} from "../adapters/http/fetch";

import {generateCombinations} from "./utils/utils";
import {createTradeSequence} from "./create-trade-sequence";

const getUniqueCoins = (tradableTickers: any[]) => {
    return tradableTickers.reduce((acc: any, item: any) => {
        if (!acc.includes(item.baseAsset)) {
            return [...acc, item.baseAsset];
        }else if (!acc.includes(item.quoteAsset)){
            return [...acc, item.quoteAsset];
        }
        return acc;
    }, []);
}

export const preparingSymbols =async ()=>{

    //------------------------------------------------------------------------------

    //      Get array of symbols(pairs) that trading now
    //      Get array in view model like this:
    //      [...
    //          {symbol: 'THETABTC', baseAsset: 'THETA', quoteAsset: 'BTC', bid: null, ask: null},
    //          {symbol: 'THETAETH', baseAsset: 'THETA', quoteAsset: 'ETH', bid: null, ask: null},
    //           ...]
    const tradableTickers = await getAllTradableTickers();

    //------------------------------------------------------------------------------

    //      Get array of coins that trading now
    //      collect unique coins names from tradableTickers
    //      ['ETH',   'LTC',  'BNB',   'NEO', ...]
    const tradableCoins = getUniqueCoins(tradableTickers)
        .filter((el: any) => el !== "GAL" || el !== "GALA" || el !== "T");
    //      Coins "GAL" "GALA" "T" was removed because it make anomalies

    //------------------------------------------------------------------------------

    //      Get array of all possible combinations of elements from tradableCoins
    //      collect unique coins names from tradableTickers
    //      Get array in view model like this:
    //      [...
    //          [ 'ETH', 'USDT', 'LTO' ],
    //          [ 'ETH', 'USDT', 'MBL' ],
    //      ...]
    let allCombinations = generateCombinations(tradableCoins, 3)
       .filter((el: any) => el[1] === "USDT")
    //       combinations with "USDT" in central position was filtered because it is start currency

    //------------------------------------------------------------------------------

    //      Convert tradableTickers array to symbolsDataSet object to increase speed of processing data set
    //      Now it has view model like this:
    //      {...
    //      MAVTUSD: { baseAsset: 'MAV', quoteAsset: 'TUSD', bid: null, ask: null },
    //      CFXTUSD: { baseAsset: 'CFX', quoteAsset: 'TUSD', bid: null, ask: null },
    //      ...}
    const symbolsDataSet: any = tradableTickers.reduce((acc: any, el: any) => {
        acc[el.symbol] = el
        delete acc[el.symbol].symbol
        return  acc
    }, {})

    //------------------------------------------------------------------------------

    //      Get array with sequence trade instuctions and prices for each combination from allCombinations
    //      Get array in view model like this:
    //      [...
    //          {
    //             firstSymbol: { symbol: 'BNBUSDT', action: 'buy', price: null },
    //             secondSymbol: { symbol: 'MATICBNB', action: 'buy', price: null },
    //             thirdSymbol: { symbol: 'MATICUSDT', action: 'sell', price: null }
    //          },
    //      ...]

    const sequencesDataSet = allCombinations
        .map((el: any) => createTradeSequence(el, symbolsDataSet))
        .filter((el: any) => el !== null)

    console.log(sequencesDataSet)

    return {symbolsDataSet, sequencesDataSet};

}


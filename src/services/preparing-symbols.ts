import {generateCombinations} from "./utils/utils";
import {createTradeSequence} from "./create-trade-sequence";
import {getAllTradableSymbols} from "./get-all-tradable-symbols";

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

export const createSymbolsDataSet =async (tradableSymbols:any)=>{
    //      receive : getAllTradableSymbols()
    //      function receive an array of symbols available to trade created by function getAllTradableSymbols()
    //      and convert it to symbolsDataSet object to increase speed of processing data set
    //------------------------------------------------------------------------------
    //      Now it has view model like this:
    //      {...
    //      MAVTUSD: { baseAsset: 'MAV', quoteAsset: 'TUSD', bid: null, ask: null },
    //      CFXTUSD: { baseAsset: 'CFX', quoteAsset: 'TUSD', bid: null, ask: null },
    //      ...}
    return tradableSymbols.reduce((acc: any, el: any) => {
        acc[el.symbol] = el
        delete acc[el.symbol].symbol
        return  acc
    }, {})

}

export const createSequencesDataSet =async (tradableSymbols:any, symbolsDataSet:any)=>{
    //      receive : getAllTradableSymbols(), createSymbolsDataSet()
    //      function receive
    //      -- an array of symbols available to trade created by function getAllTradableSymbols()
    //      -- a symbolsDataSet object created by function createSymbolsDataSet()
    //      and create trade instructions for each combination available currency combination

    //------------------------------------------------------------------------------

    //      Get array of coins that trading now
    //      collect unique coins names from tradableTickers
    //      ['ETH',   'LTC',  'BNB',   'NEO', ...]
    const tradableCoins = getUniqueCoins(tradableSymbols)
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

    //      Get array with sequence trade instructions and prices for each combination from allCombinations
    //      Get array in view model like this:
    //      [...
    //          {
    //             firstSymbol: {symbol: 'BNB/USDT', currentCurrency: 'USDT', action: 'buy', price: null},
    //             secondSymbol: {symbol: 'MATIC/BNB', currentCurrency: 'BNB', action: 'buy', price: null},
    //             thirdSymbol: {symbol: 'MATIC/USDT', currentCurrency: 'MATIC', action: 'sell', price: null}
    //          },
    //      ...]

    const sequencesDataSet = allCombinations
        .map((el: any) => createTradeSequence(el, symbolsDataSet))
        .filter((el: any) => el !== null)

    console.log(sequencesDataSet)

    return sequencesDataSet;

}




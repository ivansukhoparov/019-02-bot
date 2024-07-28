import {generateCombinations} from "./utils/utils";
import {createTradeSequence} from "./create-trade-sequence";
import {getUniqueCoins} from "./preparing-symbols";
import {appSettingsOld} from "../settings/settings";

export const createSequencesDataSet = async (tradableSymbols: any, symbolsDataSet: any) => {
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
		.filter((el: any) => el !== "GAL"
            || el !== "GALA"
            || el !== "T"
            || el !== "IOTA"
            || el !== "RUB");
	//      Coins "GAL" "GALA" "T" was removed because it make anomalies

	//------------------------------------------------------------------------------

	//      Get array of all possible combinations of elements from tradableCoins
	//      collect unique coins names from tradableTickers
	//      Get array in view model like this:
	//      [...
	//          [ 'ETH', 'USDT', 'LTO' ],
	//          [ 'ETH', 'USDT', 'MBL' ],
	//      ...]
	const allCombinations = generateCombinations(tradableCoins, appSettingsOld.binance.params.startCurrency)

	//       combinations with "USDT" in central position was filtered because it is start currency


	//------------------------------------------------------------------------------

	//      Get array with sequence trade instructions and prices for each combination from allCombinations
	//      Get array in view model like this:
	//      [...
	//          {
	//            _1_Instruction: {symbol: 'BNB/USDT', currentCurrency: 'USDT', action: 'buy', price: null, filters{...}},
	//            _2_Instruction: {symbol: 'MATIC/BNB', currentCurrency: 'BNB', action: 'buy', price: null, filters{...}},
	//            _3_Instruction: {symbol: 'MATIC/USDT', currentCurrency: 'USDT', action: 'sell', price: null, filters{...}}
	//          },
	//      ...]

	const sequencesDataSet = allCombinations
		.map((el: any) => createTradeSequence(el, symbolsDataSet))
		.filter((el: any) => el !== null);

	return sequencesDataSet;

};

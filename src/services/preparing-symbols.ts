export const getUniqueCoins = (tradableTickers: any[]) => {
	return tradableTickers.reduce((acc: any, item: any) => {
		if (!acc.includes(item.baseAsset)) {
			return [...acc, item.baseAsset];
		}else if (!acc.includes(item.quoteAsset)){
			return [...acc, item.quoteAsset];
		}
		return acc;
	}, []);
};

export const createSymbolsDataSet = async (tradableSymbols:any)=>{
	//      receive : getAllTradableSymbols()
	//      function receive an array of symbols available to trade created by function getAllTradableSymbols()
	//      and convert it to symbolsDataSet object to increase speed of processing data set
	//------------------------------------------------------------------------------
	//      Now it has view model like this:
	//      {...
	//      MAVT/USD: { baseAsset: 'MAV',
	//                 quoteAsset: 'TUSD',
	//                 bid: null,
	//                 ask: null,
	//                 filters: {
	//                            minNotional: '0.00100000',
	//                            minQty: '0.01000000',
	//                            minQtyMarket: '0.00000000'
	//                            }
	//                  },
	//      ...}
	return tradableSymbols.reduce((acc: any, el: any) => {
		acc[el.symbol] = el;
		delete acc[el.symbol].symbol;
		return  acc;
	}, {});

};



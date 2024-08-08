import {TickerOutputDataType} from "../web-soket-binance/input";



export const symbolMapper =(input:any):TickerOutputDataType=>{
	return {
		symbol: input.baseAsset + "/" + input.quoteAsset,
		baseAsset: input.baseAsset,
		quoteAsset: input.quoteAsset,

		bid:null,
		ask: null,
		filters: {
			...input.filters
		}
	};
};





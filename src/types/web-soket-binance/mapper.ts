import {tickerDataType, TickerReceivedDataType} from "./input";
import {MarketUpdateDataType} from "./output";

export const tickerMapper = (ticker:TickerReceivedDataType):tickerDataType =>{
	return {
		symbol: ticker.s,
		bid: ticker.b,
		ask: ticker.a,
	};
};

export const marketDataMapper =  (ReceivedData:TickerReceivedDataType):MarketUpdateDataType   =>{
	return{
		symbol: ReceivedData.s,
		priceChange24Per: +ReceivedData.P,
		bidPrice: +ReceivedData.b,
		bidQty: +ReceivedData.B,
		askPrice: +ReceivedData.a,
		askQty: +ReceivedData.A,
		baseTradeQty24: +ReceivedData.v,
		quoteTradeQty24: +ReceivedData.q,
		numberOfTransactions: +ReceivedData.n,
	}
}

import {BinanceHttpAdapter} from "../adapters/http/binance.http.adapter";
import {symbolMapper} from "../types/fetch-binance/mapper";
import {TickerOutputDataType} from "../types/web-soket-binance/input";

export async function getAllTradableSymbols() {

	const response = await BinanceHttpAdapter.getAllSymbols();
	// console.log(JSON.stringify(response.content.symbols.filter((el: any) => el.symbol === "POLSBNB"), null, 2))
	const symbols:TickerOutputDataType[] = response.content.symbols
		.filter((el: any) => el.status === "TRADING")
		.map(symbolMapper);
	//
	// status: Этот ключ указывает на текущее состояние торговой пары. Если значение status равно "TRADING",
	// это означает, что пара активна и торгуется. "BREAK" означает, что торговля по этой паре в данный момент
	// приостановлена или не проводится.
	//
	const symbolsWithPrices = await addPricesToSymbolsArray(symbols);
	return symbolsWithPrices;
}

export const addPricesToSymbolsArray = async (symbols: any[]) => {
	const pricesArray = await BinanceHttpAdapter.getTickerPrices();
	const prices = pricesArray.content.reduce((acc: any, el: any) => {
		acc[el.symbol] = el.price;
		return acc;
	}, {});


	return symbols.map((el: any) => {
		const symbol = el.baseAsset + el.quoteAsset;
		return {
			...el,
			price: prices[symbol],
		};
	});
};


// response before map
// {
//     "symbol": "ETHBTC",
//     "status": "TRADING",
//     "baseAsset": "ETH",
//     "baseAssetPrecision": 8,
//     "quoteAsset": "BTC",
//     "quotePrecision": 8,
//     "quoteAssetPrecision": 8,
//     "baseCommissionPrecision": 8,
//     "quoteCommissionPrecision": 8,
//     "orderTypes": ["LIMIT", "LIMIT_MAKER", "MARKET", "STOP_LOSS_LIMIT", "TAKE_PROFIT_LIMIT"],
//     "icebergAllowed": true,
//     "ocoAllowed": true,
//     "quoteOrderQtyMarketAllowed": true,
//     "allowTrailingStop": true,
//     "cancelReplaceAllowed": true,
//     "isSpotTradingAllowed": true,
//     "isMarginTradingAllowed": true,
//     "filters": [{
//     "filterType": "PRICE_FILTER",
//     "minPrice": "0.00001000",
//     "maxPrice": "922327.00000000",
//     "tickSize": "0.00001000"
// }, {
//     "filterType": "LOT_SIZE",
//     "minQty": "0.00010000",
//     "maxQty": "100000.00000000",
//     "stepSize": "0.00010000"
// }, {"filterType": "ICEBERG_PARTS", "limit": 10}, {
//     "filterType": "MARKET_LOT_SIZE",
//     "minQty": "0.00000000",
//     "maxQty": "3195.55844791",
//     "stepSize": "0.00000000"
// }, {
//     "filterType": "TRAILING_DELTA",
//     "minTrailingAboveDelta": 10,
//     "maxTrailingAboveDelta": 2000,
//     "minTrailingBelowDelta": 10,
//     "maxTrailingBelowDelta": 2000
// }, {
//     "filterType": "PERCENT_PRICE_BY_SIDE",
//     "bidMultiplierUp": "5",
//     "bidMultiplierDown": "0.2",
//     "askMultiplierUp": "5",
//     "askMultiplierDown": "0.2",
//     "avgPriceMins": 5
// }, {
//     "filterType": "NOTIONAL",
//     "minNotional": "0.00010000",
//     "applyMinToMarket": true,
//     "maxNotional": "9000000.00000000",
//     "applyMaxToMarket": false,
//     "avgPriceMins": 5
// }, {"filterType": "MAX_NUM_ORDERS", "maxNumOrders": 200}, {
//     "filterType": "MAX_NUM_ALGO_ORDERS",
//     "maxNumAlgoOrders": 5
// }],
//     "permissions": ["SPOT", "MARGIN", "TRD_GRP_004", "TRD_GRP_005", "TRD_GRP_006", "TRD_GRP_008", "TRD_GRP_009", "TRD_GRP_010", "TRD_GRP_011", "TRD_GRP_012", "TRD_GRP_013", "TRD_GRP_014", "TRD_GRP_015", "TRD_GRP_016", "TRD_GRP_017", "TRD_GRP_018", "TRD_GRP_019", "TRD_GRP_020", "TRD_GRP_021", "TRD_GRP_022", "TRD_GRP_023", "TRD_GRP_024", "TRD_GRP_025"],
//     "defaultSelfTradePreventionMode": "EXPIRE_MAKER",
//     "allowedSelfTradePreventionModes": ["EXPIRE_TAKER", "EXPIRE_MAKER", "EXPIRE_BOTH"]
// }

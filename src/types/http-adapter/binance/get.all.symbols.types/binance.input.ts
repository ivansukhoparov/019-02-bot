export type GetAllSymbolsInputType =
{
        symbol: string
        status: string
        baseAsset: string
        baseAssetPrecision: number
        quoteAsset: string
        quotePrecision: number
        quoteAssetPrecision: number
        baseCommissionPrecision: number
        quoteCommissionPrecision: number
        orderTypes: Array<OrderTypes>,
        icebergAllowed: boolean
        ocoAllowed: boolean
        quoteOrderQtyMarketAllowed: boolean
        allowTrailingStop: boolean
        cancelReplaceAllowed: boolean
        isSpotTradingAllowed: boolean
        isMarginTradingAllowed: boolean
        filters: Array<FilterTypes>,
        permissions: Array<PermissionsTypes>,
        defaultSelfTradePreventionMode: string
        allowedSelfTradePreventionModes: Array<AllowedSelfTradePreventionModesTypes>
    }

type OrderTypes = "LIMIT" | "LIMIT_MAKER" | "MARKET" | "STOP_LOSS_LIMIT" | "TAKE_PROFIT_LIMIT"

type AllowedSelfTradePreventionModesTypes = "EXPIRE_TAKER" | "EXPIRE_MAKER" | "EXPIRE_BOTH"

type PermissionsTypes =
    "SPOT"
    | "MARGIN"
    | "TRD_GRP_004"
    | "TRD_GRP_005"
    | "TRD_GRP_006"
    | "TRD_GRP_008"
    | "TRD_GRP_009"
    | "TRD_GRP_010"
    | "TRD_GRP_011"
    | "TRD_GRP_012"
    | "TRD_GRP_013"
    | "TRD_GRP_014"
    | "TRD_GRP_015"
    | "TRD_GRP_016"
    | "TRD_GRP_017"
    | "TRD_GRP_018"
    | "TRD_GRP_019"
    | "TRD_GRP_020"
    | "TRD_GRP_021"
    | "TRD_GRP_022"
    | "TRD_GRP_023"
    | "TRD_GRP_024"
    | "TRD_GRP_025"


export type  FilterTypes =
    PriceFilterType
    | LotSizeFilterType
    | IcebergPartsFilterType
    | MarketLotSizeFilterType
    | TrailingDeltaFilterType
    | PercentPriceBySideFilterType
    | NotionalFilterType
    | MaxNumOrdersFilterType
    | MaxNumAlgoOrdersFilterType

type PriceFilterType= {
    filterType: "PRICE_FILTER"
    minPrice: string
    maxPrice: string
    tickSize: string
}

export type LotSizeFilterType = {
    filterType: "LOT_SIZE"
    minQty: string
    maxQty: string
    stepSize: string
}

type IcebergPartsFilterType = {
    filterType: "ICEBERG_PARTS"
    limit: string
}

export  type MarketLotSizeFilterType = {
    filterType: "MARKET_LOT_SIZE"
    minQty: string
    maxQty: string
    stepSize: string
}

type TrailingDeltaFilterType = {
    filterType: "TRAILING_DELTA"
    minTrailingAboveDelta: string
    maxTrailingAboveDelta: string
    minTrailingBelowDelta: string
    maxTrailingBelowDelta: string
}

type PercentPriceBySideFilterType = {
    filterType: "PERCENT_PRICE_BY_SIDE"
    bidMultiplierUp: string
    bidMultiplierDown: string
    askMultiplierUp: string
    askMultiplierDown: string
    avgPriceMins: string
}

export type NotionalFilterType = {
    filterType: "NOTIONAL"
    minNotional: string
    applyMinToMarket: boolean
    maxNotional: string
    applyMaxToMarket: boolean
    avgPriceMins: string
}

type MaxNumOrdersFilterType = {
    filterType: "MAX_NUM_ORDERS"
    maxNumOrders: string
}

type MaxNumAlgoOrdersFilterType ={
    filterType: "MAX_NUM_ALGO_ORDERS"
    maxNumAlgoOrders: string
}

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
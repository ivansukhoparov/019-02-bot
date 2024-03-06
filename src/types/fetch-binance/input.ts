export type TradingSymbolsType = {
    symbol: string
    baseAsset: string
    quoteAsset: string

}

export type TradableTickerInputType = {

    symbol: string
    status: "TRADING" | "BREAK" | string
    // status: Этот ключ указывает на текущее состояние торговой пары. Если значение status равно   TRADING
    // это означает  что пара активна и торгуется.   BREAK   означает  что торговля по этой паре в данный момент
    // приостановлена или не проводится.

    baseAsset: string
    baseAssetPrecision: number
    quoteAsset: string
    quotePrecision: number
    quoteAssetPrecision: number
    baseCommissionPrecision: number
    quoteCommissionPrecision: number
    orderTypes: string | string[]
    icebergAllowed: boolean
    ocoAllowed: boolean
    quoteOrderQtyMarketAllowed: boolean
    allowTrailingStop: boolean
    cancelReplaceAllowed: boolean
    isSpotTradingAllowed: boolean
    isMarginTradingAllowed: boolean
    filters: any
    permissions: string | string[]
    defaultSelfTradePreventionMode: string | string[]
    allowedSelfTradePreventionModes: string | string[]
}

export type AccountBalanceInfoInputType = {
    asset: string
    free: string
    locked: string
}

export type AccountInfoInputType = {
    makerCommission: number
    takerCommission: number
    buyerCommission: number
    sellerCommission: number
    commissionRates: {
        maker: string
        taker: string
        buyer: string
        seller: string
    }
    canTrade: boolean
    canWithdraw: boolean
    canDeposit: boolean
    brokered: boolean
    requireSelfTradePrevention: boolean
    preventSor: boolean
    updateTime: number
    accountType: string | string[]
    balances: AccountBalanceInfoInputType[]
    permissions: string[]
    uid: number
}

export type OrderResponseFillType = {
    price: string // The execution price for each part.
    qty: string // The quantity executed in each part.
    commission: string // The commission charged for each part.
    commissionAsset: string // The currency in which the commission is charged.
    tradeId: number // The trade identifier for each part.
}

export type OrderResponseType = {
    symbol: string // The trading pair, e.g., 'BTCUSDT'.
    orderId: number // The unique identifier of the order on the exchange.
    orderListId: number // The identifier of the order list. Usually -1 if there are no related orders.
    clientOrderId: string // The client-side identifier of the order for management purposes.
    transactTime: number // The timestamp of when the order was executed.
    price: string // The price of the order. For market orders, usually '0.00000000'.
    origQty: string // The originally specified quantity in the order.
    executedQty: string // The actual executed quantity.
    cummulativeQuoteQty: string // The total amount in the quote currency used to execute the order.
    status: string // The status of the order, e.g., 'FILLED'.
        // For status:
        //     This field indicates the current status of the order. Common values include:
        //
        //     NEW: The order has been accepted by the system but not yet executed.
        // PARTIALLY_FILLED: A portion of the order has been filled, and some quantity is still pending execution.
        // FILLED: The order has been completely filled, and no quantity is left pending.
        // CANCELED: The order has been canceled by the user, and no further execution will occur.
        // PENDING_CANCEL (Currently unused): The cancellation request for the order has been received,
        // but it's not yet processed.
        // REJECTED: The order was not accepted by the system and thus not executed (this could be due to various reasons
        // like insufficient balance or invalid parameters).
        // EXPIRED: The order has expired and will not be executed. This can happen with orders that have a time limit set
        // (e.g., Good-Till-Canceled orders that do not execute before the expiration time).
    timeInForce: string // Determines how long an order remains active. 'GTC' stands for 'Good Till Cancelled'.
    type: string // The type of order, e.g., 'MARKET'.
    side: string // The side of the order, 'BUY' for purchase.
    workingTime: number // The time during which the order was active.
    fills: OrderResponseFillType[] // Details about the parts of the order execution, including:
    selfTradePreventionMode: string // The self-trade prevention mode, e.g., 'EXPIRE_MAKER'.
        // For selfTradePreventionMode:
        // This field specifies the behavior of the order in case it would result in a trade with another order from the
        // same account. Common values include:
        //
        // CANCEL_NEWEST: If a self-trade is detected, the new incoming order will be canceled.
        // CANCEL_OLDEST: If a self-trade is detected, the existing order will be canceled.
        // DECREASE_AND_CANCEL: The existing order will be decreased by the size of the new order, and the new
        // order will be canceled.
        // NONE: No specific self-trade prevention is used; trades with your own orders are allowed.
}

export type ResponseErrorType = {

    code: number // -2010
    msg: string // 'Account has insufficient balance for requested action.'

}

export type OrderTypeType = "market" | "limit" | "stop_loss" | "stop_loss_limit" | "take_profit" | "take_profit_limit" | "limit_maker"
//     ORDER TYPE
//     MARKET:
//           A Market order (MARKET) is executed immediately at the current market price. You specify
//           the amount of cryptocurrency you want to buy or sell, and the order is executed at the best
//           available price at that moment.
//     LIMIT:
//          A Limit order (LIMIT) allows you to set a specific price at which you want to buy or sell a
//          cryptocurrency. The order will be executed only when the market price reaches your
//          specified price.
//     STOP_LOSS and STOP_LOSS_LIMIT:
//          STOP_LOSS and STOP_LOSS_LIMIT orders are used for limiting losses. They are executed when the
//          price of the cryptocurrency reaches a certain level. A STOP_LOSS order is executed as a market
//          order when triggered, whereas a STOP_LOSS_LIMIT order is executed as a limit order.
//     TAKE_PROFIT and TAKE_PROFIT_LIMIT:
//         These orders are similar to STOP_LOSS but are used for securing profits. They are activated when
//         the price reaches a certain level that yields profit.
//     LIMIT_MAKER:
//          This type of order is used to create limit orders that add liquidity to the market. The order
//          will be rejected if it would immediately be executed and thus remove liquidity.

export type OrderSide =  "buy" | "sell"

export type ApiResponseType = {
    type: "error" | "success"
    content: ResponseErrorType | any
}


export type QuantityType = "quantity" | "quoteOrderQty"

export type RestApiTickerInfo = {
        symbol: string
        priceChange: string
        priceChangePercent: string
        weightedAvgPrice: string
        prevClosePrice: string
        lastPrice: string
        lastQty: string
        bidPrice: string
        bidQty: string
        askPrice: string
        askQty: string
        openPrice: string
        highPrice: string
        lowPrice: string
        volume: string
        quoteVolume: string
        openTime: number
        closeTime: number
        firstId: number
        lastId: number
        count: number
    }

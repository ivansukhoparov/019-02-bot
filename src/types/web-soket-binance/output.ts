export type MarketUpdateDataType={
    symbol: string // The symbol of the trading pair
    priceChange24Per: number// The percentage change in the price over the last 24 hours
    bidPrice: number // The best purchase price (the highest demand price).
    bidQty: number // Quantity for the best purchase price.
    askPrice: number // The best-selling price (the lowest offer price).
    askQty:number // Quantity for the best-selling price.
    baseTradeQty24: number // Trading volume in the base currency in the last 24 hours.
    quoteTradeQty24: number// The trading volume in the quoted currency in the last 24 hours.
    numberOfTransactions: number //The total number of transactions in the last 24 hours.
}

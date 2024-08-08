
export type GetAllSymbolsOutputType = {
    symbol: string
    status: string
    baseAsset: string
    quoteAsset: string
    filters: OutputFiltersType
}

type OutputFiltersType = {
    minNotional: string
    minQty: string
    minQtyMarket: string
    stepSize: string
    stepSizeMarket: string
}
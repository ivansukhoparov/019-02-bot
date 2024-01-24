import {getPair} from "./update-symbols";



export const priceDifference = (tradeData: any, startCoin: string, endCoin: string, tradeCoin: string) => {

    const sequence = {
        firstPair: tradeCoin + startCoin,
        secondPair: tradeCoin + endCoin,
        basePair: endCoin + startCoin,
    }

    // Get pairs
    const basePair = getPair(tradeData, startCoin, endCoin);
    const firstPair = getPair(tradeData, tradeCoin, startCoin);
    const secondPair = getPair(tradeData, tradeCoin, endCoin);

    // get prices
    const basePairPrice = getPrice(basePair, sequence.basePair);
    const firstPairPrice = getPrice(firstPair, sequence.firstPair);
    const secondPairPrice = getPrice(secondPair, sequence.secondPair);

    const percentPricesDifference = getPercentPricesDifference(basePairPrice, firstPairPrice, secondPairPrice)
    return percentPricesDifference
}

export const getPercentPricesDifference = (basePairPrice: number, firstPairPrice: number, secondPairPrice: number) => {
    const convertiblePrice = secondPairPrice * basePairPrice
    const pricesDifference = firstPairPrice - convertiblePrice
    return pricesDifference / firstPairPrice * 100
}


export const getPrice = (pair: any, sequencePair: string) => {
    if (sequencePair === pair.info.baseAsset + pair.info.quoteAsset) {
        return +pair.info.ask;
    } else {
        return 1 / +pair.info.ask;
    }
}

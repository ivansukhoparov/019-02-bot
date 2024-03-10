import {getAllTradableSymbols} from "../../src/services/get-all-tradable-symbols";
import {createSymbolsDataSet} from "../../src/services/preparing-symbols";
import {createSequencesDataSet} from "../../src/services/create-sequences-data-set";
import {TradeCore} from "../../src/core/trade.core";

const _1 = {
    "_1_Instruction": {
        "symbol": "ETH/USDT",
        "currentCurrency": "USDT",
        "action": "buy",
        "actionQty": "10",
        "actionQtyInQuote": "20000",
        "price": 2000,
        "priceChange24Per": 2.925,
        "lastPriceChange": 2.968,
        "lastQuantity": 0.1268,
        "filters": {
            "minNotional": "5.00000000",
            "minQty": "0.00010000",
            "minQtyMarket": "0.00000000",
            "stepSize": "0.00010000",
            "stepSizeMarket": "0.00010000"
        }
    },
    "_2_Instruction": {
        "symbol": "MANA/ETH",
        "currentCurrency": "ETH",
        "action": "buy",
        "actionQty": "2",
        "actionQtyInQuote": "4",
        "price": 2,
        "priceChange24Per": 6.816,
        "lastPriceChange": 6.816,
        "lastQuantity": 314,
        "filters": {
            "minNotional": "0.00100000",
            "minQty": "1.00000000",
            "minQtyMarket": "0.00000000",
            "stepSize": "1.00000000",
            "stepSizeMarket": "1.00000000"
        }
    },
    "_3_Instruction": {
        "symbol": "MANA/USDT",
        "currentCurrency": "MANA",
        "action": "sell",
        "actionQty": "1",
        "actionQtyInQuote": "4000",
        "price": 4000,
        "priceChange24Per": 11.039,
        "lastPriceChange": 11.039,
        "lastQuantity": 118,
        "filters": {
            "minNotional": "5.00000000",
            "minQty": "1.00000000",
            "minQtyMarket": "0.00000000",
            "stepSize": "1.00000000",
            "stepSizeMarket": "1.00000000"
        }
    },
    "profitInBase": 0.3462928003558119,
    "profitReal": 0.3462928003558119,
    "isAllow": true
}
const _2 = {
    "_1_Instruction": {
        "symbol": "ETH/USDT",
        "currentCurrency": "USDT",
        "action": "buy",
        "actionQty": "10",
        "actionQtyInQuote": "20000",
        "price": 2000,
        "priceChange24Per": 2.925,
        "lastPriceChange": 2.968,
        "lastQuantity": 0.1268,
        "filters": {
            "minNotional": "5.00000000",
            "minQty": "0.00010000",
            "minQtyMarket": "0.00000000",
            "stepSize": "0.00010000",
            "stepSizeMarket": "0.00010000"
        }
    },
    "_2_Instruction": {
        "symbol": "MANA/ETH",
        "currentCurrency": "ETH",
        "action": "buy",
        "actionQty": "12",
        "actionQtyInQuote": "4",
        "price": 2,
        "priceChange24Per": 6.816,
        "lastPriceChange": 6.816,
        "lastQuantity": 314,
        "filters": {
            "minNotional": "0.00100000",
            "minQty": "1.00000000",
            "minQtyMarket": "0.00000000",
            "stepSize": "1.00000000",
            "stepSizeMarket": "1.00000000"
        }
    },
    "_3_Instruction": {
        "symbol": "USDT/MANA",
        "currentCurrency": "MANA",
        "action": "buy",
        "actionQty": "4000",
        "actionQtyInQuote": "1",
        "price": 0.00025,
        "priceChange24Per": 11.039,
        "lastPriceChange": 11.039,
        "lastQuantity": 118,
        "filters": {
            "minNotional": "5.00000000",
            "minQty": "1.00000000",
            "minQtyMarket": "0.00000000",
            "stepSize": "1.00000000",
            "stepSizeMarket": "1.00000000"
        }
    },
    "profitInBase": 0.3462928003558119,
    "profitReal": 0.3462928003558119,
    "isAllow": true
}
const _3 = {
    "_1_Instruction": {
        "symbol": "ETH/USDT",
        "currentCurrency": "USDT",
        "action": "buy",
        "actionQty": "100",
        "actionQtyInQuote": "20000",
        "price": 200,
        "priceChange24Per": 2.925,
        "lastPriceChange": 2.968,
        "lastQuantity": 0.1268,
        "filters": {
            "minNotional": "5.00000000",
            "minQty": "0.00010000",
            "minQtyMarket": "0.00000000",
            "stepSize": "0.00010000",
            "stepSizeMarket": "0.00010000"
        }
    },
    "_2_Instruction": {
        "symbol": "MANA/ETH",
        "currentCurrency": "ETH",
        "action": "buy",
        "actionQty": "0.05",
        "actionQtyInQuote": "0.1",
        "price": 2,// 1 mama = 400 usdt => 100 usdt = 0.25 mana , 0.05 mana = 20 usdt
        "priceChange24Per": 6.816,
        "lastPriceChange": 6.816,
        "lastQuantity": 314,
        "filters": {
            "minNotional": "0.00100000",
            "minQty": "1.00000000",
            "minQtyMarket": "0.00000000",
            "stepSize": "1.00000000",
            "stepSizeMarket": "1.00000000"
        }
    },
    "_3_Instruction": {
        "symbol": "USDT/MANA",
        "currentCurrency": "MANA",
        "action": "buy",
        "actionQty": "16000",
        "actionQtyInQuote": "4",
        "price": 0.00025,
        "priceChange24Per": 11.039,
        "lastPriceChange": 11.039,
        "lastQuantity": 118,
        "filters": {
            "minNotional": "5.00000000",
            "minQty": "1.00000000",
            "minQtyMarket": "0.00000000",
            "stepSize": "1.00000000",
            "stepSizeMarket": "1.00000000"
        }
    },
    "profitInBase": 0.3462928003558119,
    "profitReal": 0.3462928003558119,
    "isAllow": true
}
const _4 = {
    "_1_Instruction": {
        "symbol": "ETH/USDT",
        "currentCurrency": "USDT",
        "action": "buy",
        "actionQty": "100",
        "actionQtyInQuote": "20000",
        "price": 200,
        "priceChange24Per": 2.925,
        "lastPriceChange": 2.968,
        "lastQuantity": 0.1268,
        "filters": {
            "minNotional": "5.00000000",
            "minQty": "0.00010000",
            "minQtyMarket": "0.00000000",
            "stepSize": "0.00010000",
            "stepSizeMarket": "0.00010000"
        }
    },
    "_2_Instruction": {
        "symbol": "ETH/MANA",
        "currentCurrency": "ETH",
        "action": "sell",
        "actionQty": "0.1",
        "actionQtyInQuote": "0.05",
        "price": 0.5,
        "priceChange24Per": 6.816,
        "lastPriceChange": 6.816,
        "lastQuantity": 314,
        "filters": {
            "minNotional": "0.00100000",
            "minQty": "1.00000000",
            "minQtyMarket": "0.00000000",
            "stepSize": "1.00000000",
            "stepSizeMarket": "1.00000000"
        }
    },
    "_3_Instruction": {
        "symbol": "USDT/MANA",
        "currentCurrency": "MANA",
        "action": "buy",
        "actionQty": "16000",
        "actionQtyInQuote": "4",
        "price": 0.00025,
        "priceChange24Per": 11.039,
        "lastPriceChange": 11.039,
        "lastQuantity": 118,
        "filters": {
            "minNotional": "5.00000000",
            "minQty": "1.00000000",
            "minQtyMarket": "0.00000000",
            "stepSize": "1.00000000",
            "stepSizeMarket": "1.00000000"
        }
    },
    "profitInBase": 0.3462928003558119,
    "profitReal": 0.3462928003558119,
    "isAllow": true
}
const _5 = {
    "_1_Instruction": {
        "symbol": "ETH/USDT",
        "currentCurrency": "USDT",
        "action": "buy",
        "actionQty": "8",
        "actionQtyInQuote": "80",
        "price": 10,
        "priceChange24Per": 2.925,
        "lastPriceChange": 2.968,
        "lastQuantity": 0.1268,
        "filters": {
            "minNotional": "5.00000000",
            "minQty": "0.00010000",
            "minQtyMarket": "0.00000000",
            "stepSize": "0.00010000",
            "stepSizeMarket": "0.00010000"
        }
    },
    "_2_Instruction": {
        "symbol": "MANA/ETH",
        "currentCurrency": "ETH",
        "action": "buy",
        "actionQty": "5",
        "actionQtyInQuote": "10",
        "price": 2,
        "priceChange24Per": 6.816,
        "lastPriceChange": 6.816,
        "lastQuantity": 314,
        "filters": {
            "minNotional": "0.00100000",
            "minQty": "1.00000000",
            "minQtyMarket": "0.00000000",
            "stepSize": "1.00000000",
            "stepSizeMarket": "1.00000000"
        }
    },
    "_3_Instruction": {
        "symbol": "USDT/MANA",
        "currentCurrency": "MANA",
        "action": "buy",
        "actionQty": "16000",
        "actionQtyInQuote": "4",
        "price": 0.00025,
        "priceChange24Per": 11.039,
        "lastPriceChange": 11.039,
        "lastQuantity": 118,
        "filters": {
            "minNotional": "5.00000000",
            "minQty": "1.00000000",
            "minQtyMarket": "0.00000000",
            "stepSize": "1.00000000",
            "stepSizeMarket": "1.00000000"
        }
    },
    "profitInBase": 0.3462928003558119,
    "profitReal": 0.3462928003558119,
    "isAllow": true
}
const _6 = {
    "_1_Instruction": {
        "symbol": "USDT/ETH",
        "currentCurrency": "USDT",
        "action": "sell",
        "actionQty": "70",
        "actionQtyInQuote": "7",
        "price": 0.1,
        "priceChange24Per": 2.925,
        "lastPriceChange": 2.968,
        "lastQuantity": 0.1268,
        "filters": {
            "minNotional": "5.00000000",
            "minQty": "0.00010000",
            "minQtyMarket": "0.00000000",
            "stepSize": "0.00010000",
            "stepSizeMarket": "0.00010000"
        }
    },
    "_2_Instruction": {
        "symbol": "MANA/ETH",
        "currentCurrency": "ETH",
        "action": "buy",
        "actionQty": "5",
        "actionQtyInQuote": "10",
        "price": 2,
        "priceChange24Per": 6.816,
        "lastPriceChange": 6.816,
        "lastQuantity": 314,
        "filters": {
            "minNotional": "0.00100000",
            "minQty": "1.00000000",
            "minQtyMarket": "0.00000000",
            "stepSize": "1.00000000",
            "stepSizeMarket": "1.00000000"
        }
    },
    "_3_Instruction": {
        "symbol": "USDT/MANA",
        "currentCurrency": "MANA",
        "action": "buy",
        "actionQty": "16000",
        "actionQtyInQuote": "4",
        "price": 0.00025,
        "priceChange24Per": 11.039,
        "lastPriceChange": 11.039,
        "lastQuantity": 118,
        "filters": {
            "minNotional": "5.00000000",
            "minQty": "1.00000000",
            "minQtyMarket": "0.00000000",
            "stepSize": "1.00000000",
            "stepSizeMarket": "1.00000000"
        }
    },
    "profitInBase": 0.3462928003558119,
    "profitReal": 0.3462928003558119,
    "isAllow": true
}

let tradeCore:TradeCore


describe("tradeCore.correctStartAmount methods tests", () => {

     beforeAll(async ()=>{
        const allTradableSymbols = await getAllTradableSymbols();
        const symbolsDataSet = await createSymbolsDataSet(allTradableSymbols);
        const sequencesDataSet = await createSequencesDataSet(allTradableSymbols, symbolsDataSet);
         tradeCore =  new TradeCore(0.1,100,symbolsDataSet,sequencesDataSet)
    })

    it("+", () => {
        const correctedStartAmount = tradeCore.correctStartAmount(_1, 100)
        expect(correctedStartAmount.startAmount).toBe(100)
    })
    it("+", () => {
        const correctedStartAmount = tradeCore.correctStartAmount(_1, 4000)
        expect(correctedStartAmount.startAmount).toBe(4000)
    })
    it("+", () => {
        const correctedStartAmount = tradeCore.correctStartAmount(_1, 2000)
        expect(correctedStartAmount.startAmount).toBe(2000)
    })
    it("+", () => {
        const correctedStartAmount = tradeCore.correctStartAmount(_1, 8000)
        expect(correctedStartAmount.startAmount).toBe(4008)
    })
    it("+", () => {
        const correctedStartAmount = tradeCore.correctStartAmount(_2, 100)
        expect(correctedStartAmount.startAmount).toBe(100)
    })
    it("+", () => {
        const correctedStartAmount = tradeCore.correctStartAmount(_2, 4000)
        expect(correctedStartAmount.startAmount).toBe(4000)
    })
    it("+", () => {
        const correctedStartAmount = tradeCore.correctStartAmount(_2, 2000)
        expect(correctedStartAmount.startAmount).toBe(2000)
    })
    it("+", () => {
        const correctedStartAmount = tradeCore.correctStartAmount(_2, 8000)
        expect(correctedStartAmount.startAmount).toBe(4008)
    })
    it("+", () => {
        const correctedStartAmount = tradeCore.correctStartAmount(_3, 100)
        expect(correctedStartAmount.startAmount).toBe(20)
    })
    it("+", () => {
        const correctedStartAmount = tradeCore.correctStartAmount(_3, 20)
        expect(correctedStartAmount.startAmount).toBe(20)
    })
    it("+", () => {
        const correctedStartAmount = tradeCore.correctStartAmount(_3, 10)
        expect(correctedStartAmount.startAmount).toBe(10)
    })
    it("+", () => {
        const correctedStartAmount = tradeCore.correctStartAmount(_4, 100)
        expect(correctedStartAmount.startAmount).toBe(20)
    })
    it("+", () => {
        const correctedStartAmount = tradeCore.correctStartAmount(_4, 20)
        expect(correctedStartAmount.startAmount).toBe(20)
    })
    it("+", () => {
        const correctedStartAmount = tradeCore.correctStartAmount(_4, 10)
        expect(correctedStartAmount.startAmount).toBe(10)
    })
    it("+", () => {
        const correctedStartAmount = tradeCore.correctStartAmount(_5, 100)
        expect(correctedStartAmount.startAmount).toBe(80)
    })
    it("+", () => {
        const correctedStartAmount = tradeCore.correctStartAmount(_5, 80)
        expect(correctedStartAmount.startAmount).toBe(80)
    })
    it("+", () => {
        const correctedStartAmount = tradeCore.correctStartAmount(_5, 20)
        expect(correctedStartAmount.startAmount).toBe(20)
    })
    it("+", () => {
        const correctedStartAmount = tradeCore.correctStartAmount(_6, 100)
        expect(correctedStartAmount.startAmount).toBe(70)
    })
    it("+", () => {
        const correctedStartAmount = tradeCore.correctStartAmount(_6, 70)
        expect(correctedStartAmount.startAmount).toBe(69)
    })
    it("+", () => {
        const correctedStartAmount = tradeCore.correctStartAmount(_6, 20)
        expect(correctedStartAmount.startAmount).toBe(20)
    })

})

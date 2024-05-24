import {BinanceService} from "../../src/application/binance-service";
import {symbolsDataSet_test} from "../tests-data-sets/symbols-data-set";
import {orderAction, orderQuantity} from "../../src/common/common";
import {BinanceHttpAdapterOLD} from "../../src/adapters/http/binanceHttpAdapterOLD";
import {roundDownNumber} from "../../src/services/trade-sequence";


describe("binance-services methods tests", () => {

    it("+", () => {
        const a = roundDownNumber(1.2558545, 0.1)
        expect(a).toBe(1.2)
        console.log(a)
    })

    it("+", () => {
        const a = roundDownNumber(1.2558545, 0.01)
        expect(a).toBe(1.25)
        console.log(a)
    })

    it("+", () => {
        const a = roundDownNumber(1.2558545, 0.001)
        expect(a).toBe(1.255)
        console.log(a)
    })


})

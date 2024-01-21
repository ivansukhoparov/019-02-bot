import {testSymbols} from "./data";
import {createTradeSequence} from "../../src/adapters/core/create-trade-sequence";
import {ActionTimer} from "../../src/adapters/utils/timer";
import {calculateDifferences} from "../../src/adapters/utils/websoket";
const a = {
    firstSymbol: { symbol: 'BTCUSDT', action: 'buy', price: '10000' },
    secondSymbol: { symbol: 'BTCEUR', action: 'sell', price: '9000' },
    thirdSymbol: { symbol: 'EURUSDT', action: 'sell', price: '1.1' }
}
describe("createTradeSequence function test", () => {

    it("function must create correct sequence", () => {

        const sequence = createTradeSequence(['BTC', 'USDT', 'EUR'], testSymbols);
        console.log(sequence);
        expect(sequence).toEqual({
            firstSymbol: {
                symbol: "BTCUSDT",
                action: "buy",
                price: "11000"
            },
            secondSymbol:{
                symbol: "BTCEUR",
                action: "sell",
                price: "9000"
            },
            thirdSymbol:{
                symbol: "EURUSDT",
                action: "sell",
                price: "1.1"
            }
        });
    })

    it("function must return correct sequence", () => {

        const sequence = createTradeSequence(['TCP', 'USDT', 'EUR'], testSymbols);
        console.log(sequence);
        expect(sequence).toEqual({
            firstSymbol: {
                symbol: "TCPUSDT",
                action: "buy",
                price: "10"
            },
            secondSymbol:{
                symbol: "TCPEUR",
                action: "sell",
                price: null
            },
            thirdSymbol:{
                symbol: "EURUSDT",
                action: "sell",
                price: "1.1"
            }
        });
    })


    it("function must return null if symbol not in list", () => {

        const sequence = createTradeSequence(['PCP', 'USDT', 'EUR'], testSymbols);
        console.log(sequence);
        expect(sequence).toBeNull();
    })
    it("function must return null if symbol not in list", () => {

        const sequence = createTradeSequence([ 'ETH', 'LTC', 'BNB' ], testSymbols);
        console.log(sequence);
        expect(sequence).toBeNull();
    })

    it("function must return null if symbol not in list", () => {



    })



})


describe("createTradeSequence function test", () => {

    it("test 1", () => {

const result = calculateDifferences(a)
        console.log(result)
        expect(1).not.toBeNull()
    })


})

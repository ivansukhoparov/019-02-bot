import {testSymbols} from "./data";
import {createTradeSequence} from "../../src/adapters/core/create-trade-sequence";

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

    it("function must return null if symbol don't have price", () => {

        const sequence = createTradeSequence(['TCP', 'USDT', 'EUR'], testSymbols);
        console.log(sequence);
        expect(sequence).toBeNull();
    })


    it("function must return null if symbol not in list", () => {

        const sequence = createTradeSequence(['PCP', 'USDT', 'EUR'], testSymbols);
        console.log(sequence);
        expect(sequence).toBeNull();
    })


})

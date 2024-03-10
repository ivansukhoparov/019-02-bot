// import {testSymbols} from "./data";
// import {createTradeSequence} from "../../src/services/create-trade-sequence";
// import {ActionTimer} from "../../src/common/utils/timer";
// import {PredictTradeResult} from "../../src/adapters/websoket/websoket-adapter";
// const a = {
//     _1_Instruction: { symbol: 'BTCUSDT', action: 'buy', price: '10000' },
//     _2_Instruction: { symbol: 'BTCEUR', action: 'sell', price: '9000' },
//     _3_Instruction: { symbol: 'EURUSDT', action: 'sell', price: '1.1' }
// }
// describe("createTradeSequence function test", () => {
//
//     it("function must create correct sequence", () => {
//
//         const sequence = createTradeSequence(['BTC', 'USDT', 'EUR'], testSymbols);
//         console.log(sequence);
//         expect(sequence).toEqual({
//             _1_Instruction: {
//                 symbol: "BTCUSDT",
//                 action: "buy",
//                 price: "11000"
//             },
//             _2_Instruction:{
//                 symbol: "BTCEUR",
//                 action: "sell",
//                 price: "9000"
//             },
//             _3_Instruction:{
//                 symbol: "EURUSDT",
//                 action: "sell",
//                 price: "1.1"
//             }
//         });
//     })
//
//     it("function must return correct sequence", () => {
//
//         const sequence = createTradeSequence(['TCP', 'USDT', 'EUR'], testSymbols);
//         console.log(sequence);
//         expect(sequence).toEqual({
//             _1_Instruction: {
//                 symbol: "TCPUSDT",
//                 action: "buy",
//                 price: "10"
//             },
//             _2_Instruction:{
//                 symbol: "TCPEUR",
//                 action: "sell",
//                 price: null
//             },
//             _3_Instruction:{
//                 symbol: "EURUSDT",
//                 action: "sell",
//                 price: "1.1"
//             }
//         });
//     })
//
//
//     it("function must return null if symbol not in list", () => {
//
//         const sequence = createTradeSequence(['PCP', 'USDT', 'EUR'], testSymbols);
//         console.log(sequence);
//         expect(sequence).toBeNull();
//     })
//     it("function must return null if symbol not in list", () => {
//
//         const sequence = createTradeSequence([ 'ETH', 'LTC', 'BNB' ], testSymbols);
//         console.log(sequence);
//         expect(sequence).toBeNull();
//     })
//
//     it("function must return null if symbol not in list", () => {
//
//
//
//     })
//
//
//
// })
//
//
// describe("createTradeSequence function test", () => {
//
//     it("test 1", () => {
//
// const result = PredictTradeResult(a)
//         console.log(result)
//         expect(1).not.toBeNull()
//     })
//
//
// })

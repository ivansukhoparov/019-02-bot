// const predictResult = (target: any, act: any, price: any) => {
//
//     if (target !== null) {
//         if (price !== null) {
//             switch (act) {
//                 case "buy":
//                     return (target / +price);
//                 case "sell":
//                     return (target * +price);
//                 default:
//                     return null;
//             }
//         }
//     }
//
//     return null;
// };
//
// const reversePredictResult = (target: any, act: any, price: any) => {
//
//     if (target !== null) {
//         if (price !== null) {
//             switch (act) {
//                 case "buy":
//                     return (target * +price);
//                 case "sell":
//                     return (target / +price);
//                 default:
//                     return null;
//             }
//         }
//     }
//     return null;
// };
//
//
// export const calculateStartAmount = (sequence: any, start: number) => {
//     let startAmount = start
//     let result = 0;
//
//     let go = false
//     while (!go) {
//
//         if ((sequence.firstSymbol.symbol.split("/")[0] === sequence.firstSymbol.currentCurrency
//                 && +startAmount < +sequence.firstSymbol.actionQty)
//             || (sequence.firstSymbol.symbol.split("/")[1] === sequence.firstSymbol.currentCurrency
//                 && +startAmount < (+sequence.firstSymbol.actionQty * +sequence.firstSymbol.price)
//             )) {
//             // get amount for secondSymbol in secondSymbol current-currency, it start amount for secondSymbol in secondSymbol current-currency
//             const _1InstrResultAmount = (predictResult(startAmount, sequence.firstSymbol.action, sequence.firstSymbol.price))! * 0.999
//             const _2StartAmount = _1InstrResultAmount
//
//             if ((sequence.secondSymbol.symbol.split("/")[0] === sequence.secondSymbol.currentCurrency
//                     && _2StartAmount < +sequence.secondSymbol.actionQty)
//                 || (sequence.secondSymbol.symbol.split("/")[1] === sequence.secondSymbol.currentCurrency
//                     && (_2StartAmount) < (+sequence.secondSymbol.actionQty * +sequence.secondSymbol.price)
//                 )) {
//                 // get amount for thirdSymbol in thirdSymbol current-currency, it start-amount for thirdSymbol in thirdSymbol current-currency
//                 const _2InstrResultAmount = (predictResult(_1InstrResultAmount, sequence.secondSymbol.action, +sequence.secondSymbol.price))! * 0.999;
//                 const _3StartAmount = _2InstrResultAmount
//
//                 if ((sequence.thirdSymbol.symbol.split("/")[0] === sequence.thirdSymbol.currentCurrency
//                         && _3StartAmount < +sequence.thirdSymbol.actionQty)
//                     || (sequence.thirdSymbol.symbol.split("/")[1] === sequence.thirdSymbol.currentCurrency
//                         && _3StartAmount < +sequence.thirdSymbol.actionQtyInQuote
//                     )) {
//
//                     const _3InstrResultAmount = (predictResult(_2InstrResultAmount, sequence.thirdSymbol.action, sequence.thirdSymbol.price))! * 0.999;
//                     console.log("_1StartAmount: " + startAmount)
//                     console.log("_2StartAmount: " + _2StartAmount)
//                     console.log("_3StartAmount: " + _3StartAmount)
//                     console.log("_3InstrResultAmount: " + _3InstrResultAmount)
//                     result = (_3InstrResultAmount - startAmount)
//
//                     go = true
//
//                 } else {
//                     let _3StartAmount = sequence.thirdSymbol.actionQty
//                     // Available amount for trade 3-symbol in current-currency if current-currency is base asset
//                     if (sequence.thirdSymbol.symbol.split("/")[1] === sequence.thirdSymbol.currentCurrency) {
//                         _3StartAmount = sequence.thirdSymbol.actionQtyInQuote
//                         // Available amount for trade 3-symbol in current-currency if current-currency is quote asset
//                     }
//                     console.log("tets _3StartAmount " + _3StartAmount)
//                     let _2EndAmount = _3StartAmount
//
//                     const _2StartAmount = reversePredictResult(_2EndAmount, sequence.secondSymbol.action, sequence.secondSymbol.price)! / 0.999
//                     // amount of 2-symbol in 2-symbol current-currency if that currency in base asset
//                     console.log("tets _2StartAmount " + _2StartAmount)
//
//                     let _1EndAmount = _2StartAmount
//
//                     const _1StartAmount = reversePredictResult(_1EndAmount, sequence.firstSymbol.action, sequence.firstSymbol.price)! / 0.999
//                     // amount of 1-symbol in 1-symbol current-currency if that currency in base asset
//                     console.log("tets _1StartAmount " + _1StartAmount)
//
//                     startAmount = Math.floor(_1StartAmount)
//
//
//                     // if (sequence.firstSymbol.symbol.split("/")[1] === sequence.firstSymbol.currentCurrency) {
//                     //     startAmount = Math.floor(_1StartAmount)
//                     // } else {
//                     //     startAmount = Math.floor((_1StartAmount * sequence.firstSymbol.price))
//                     // }
//
//
//                     // let _2EndAmount = sequence.thirdSymbol.actionQty
//                     // if (sequence.thirdSymbol.symbol.split("/")[0] === sequence.thirdSymbol.currentCurrency) {
//                     //     _2EndAmount = _2EndAmount
//                     // } else {
//                     //     _2EndAmount = _2EndAmount * sequence.thirdSymbol.price
//                     // }
//                     // console.log("3 " + _2EndAmount)
//                     // const _2StartAmount = reversePredictResult(_2EndAmount, sequence.secondSymbol.action, sequence.secondSymbol.price)! / 0.999
//                     // console.log("3 _2StartAmount " + _2StartAmount)
//                     //
//                     // let _1EndAmount = _2StartAmount
//                     // // if (sequence.secondSymbol.symbol.split("/")[0] === sequence.secondSymbol.currentCurrency) {
//                     // //     _1EndAmount = _1EndAmount
//                     // // } else {
//                     // //     _1EndAmount = _1EndAmount * sequence.secondSymbol.price
//                     // // }
//                     // console.log("3 _1EndAmount" + _1EndAmount)
//                     //
//                     // let _1StartAmount = reversePredictResult(_1EndAmount, sequence.firstSymbol.action, sequence.firstSymbol.price)! / 0.999
//                     // console.log("3 _1StartAmount " + _1StartAmount)
//                     // startAmount = Math.floor(_1StartAmount)
//                     // // if (sequence.firstSymbol.symbol.split("/")[0] === sequence.firstSymbol.currentCurrency) {
//                     // //     startAmount = Math.floor(_1StartAmount)
//                     // // } else {
//                     // //     startAmount = Math.floor((_1StartAmount * sequence.firstSymbol.price))
//                     // // }
//                 }
//
//             } else {
//                 let _2StartAmount = sequence.secondSymbol.actionQty
//                 // Available amount for trade 3-symbol in current-currency if current-currency is base asset
//                 if (sequence.secondSymbol.symbol.split("/")[1] === sequence.secondSymbol.currentCurrency) {
//                     _2StartAmount = sequence.secondSymbol.actionQtyInQuote
//                     // Available amount for trade 3-symbol in current-currency if current-currency is quote asset
//                 }
//
//                 let _1EndAmount = _2StartAmount
//                 const _1StartAmount = reversePredictResult(_1EndAmount, sequence.firstSymbol.action, sequence.firstSymbol.price)! / 0.999
//                 // amount of 1-symbol in 1-symbol current-currency if that currency in base asset
//
//                 startAmount = Math.floor(_1StartAmount)
//
//                 // amount of 1-symbol in 1-symbol current-currency if that currency in base asset
//                 // console.log("2 " + startAmount)
//                 // let __1Inst = sequence.secondSymbol.actionQty
//                 // if (sequence.secondSymbol.symbol.split("/")[0] === sequence.secondSymbol.currentCurrency) {
//                 //     __1Inst = __1Inst
//                 // } else {
//                 //     __1Inst = __1Inst * sequence.secondSymbol.price
//                 // }
//                 //
//                 // let _1Inst = reversePredictResult(__1Inst, sequence.firstSymbol.action, sequence.firstSymbol.price)! / 0.999
//                 // startAmount = Math.floor(_1Inst)
//                 // // if (sequence.firstSymbol.symbol.split("/")[0] === sequence.firstSymbol.currentCurrency) {
//                 // //     startAmount = Math.floor(_1Inst)
//                 // // } else {
//                 // //     startAmount = Math.floor((_1Inst * sequence.firstSymbol.price))
//                 // // }
//             }
//
//         } else {
//             if (sequence.firstSymbol.symbol.split("/")[0] === sequence.firstSymbol.currentCurrency) {
//                 startAmount = Math.floor(sequence.firstSymbol.actionQty)
//             } else {
//                 startAmount = Math.floor((sequence.firstSymbol.actionQty * sequence.firstSymbol.price))
//             }
//         }
//     }
//
//
//     return {startAmount: startAmount, result: result}
//
// }
//
// export const calculateStartAmount2 = (sequence: any, start: number) => {
//     let startAmount = start
//     let result = 0;
//
//
//     let _1StartAmount = startAmount
//     let _1EndAmount = (predictResult(_1StartAmount, sequence.firstSymbol.action, sequence.firstSymbol.price))! * 0.999
//     let _2StartAmount = _1EndAmount
//     let _2EndAmount = (predictResult(_2StartAmount, sequence.secondSymbol.action, sequence.secondSymbol.price))! * 0.999
//     let _3StartAmount = _2EndAmount
//     let _3EndAmount = (predictResult(_3StartAmount, sequence.thirdSymbol.action, sequence.firstSymbol.price))! * 0.999
//
//     // in 3rd instruction current-currency always is 2nd instructions end-trade currency therefore if 3th instruction
//     // current-currency has index = 0 then we accept baseQty as actual amount before trade this
//     let _3StartAmountReal = +sequence.thirdSymbol.actionQty
//     // Available amount for trade 3-symbol in current-currency if current-currency is base asset
//     if (sequence.thirdSymbol.symbol.split("/")[1] === sequence.thirdSymbol.currentCurrency) {
//         _3StartAmountReal = +sequence.thirdSymbol.actionQtyInQuote
//         // Available amount for trade 3-symbol in current-currency if current-currency is quote asset
//     }
//
//     // in 3rd instruction current-currency always is 2nd instructions end-trade currency therefore if 3th instruction
//     // current-currency has index = 0 then we accept baseQty as actual amount before trade this
//     let _2StartAmountReal = +sequence.secondSymbol.actionQty
//     // Available amount for trade 3-symbol in current-currency if current-currency is base asset
//     if (sequence.secondSymbol.symbol.split("/")[1] === sequence.secondSymbol.currentCurrency) {
//         _2StartAmountReal = +sequence.secondSymbol.actionQtyInQuote
//         // Available amount for trade 3-symbol in current-currency if current-currency is quote asset
//     }
//
//     // in 3rd instruction current-currency always is 2nd instructions end-trade currency therefore if 3th instruction
//     // current-currency has index = 0 then we accept baseQty as actual amount before trade this
//     let _1StartAmountReal = +sequence.firstSymbol.actionQty
//     // Available amount for trade 3-symbol in current-currency if current-currency is base asset
//     if (sequence.firstSymbol.symbol.split("/")[1] === sequence.firstSymbol.currentCurrency) {
//         _1StartAmountReal = +sequence.firstSymbol.actionQtyInQuote
//         // Available amount for trade 3-symbol in current-currency if current-currency is quote asset
//     }
//
//     console.log(_3StartAmountReal +" " + _3StartAmount)
//     if (_3StartAmount > _3StartAmountReal) {
//         _2EndAmount = _3StartAmountReal
//         _2StartAmount = reversePredictResult(_2EndAmount, sequence.secondSymbol.action, sequence.secondSymbol.price)! / 0.999
//     }
//
//
//     console.log(_2StartAmountReal + " " + _2StartAmount)
//     _1EndAmount=_2StartAmount
//     if (_2StartAmount > _2StartAmountReal) {
//         _1EndAmount = _2StartAmountReal
//     }
//     _1StartAmount = reversePredictResult(_1EndAmount, sequence.firstSymbol.action, sequence.firstSymbol.price)! / 0.999
//
//     console.log(_1StartAmountReal + " " + _1StartAmount)
//     startAmount = Math.floor(_1StartAmount)
//     if (_1StartAmount > _1StartAmountReal) {
//         startAmount = Math.floor(_1StartAmountReal)
//     }
//
//
//     _1StartAmount = startAmount
//     _1EndAmount = (predictResult(_1StartAmount, sequence.firstSymbol.action, sequence.firstSymbol.price))! * 0.999
//     _2StartAmount = _1EndAmount
//     _2EndAmount = (predictResult(_2StartAmount, sequence.secondSymbol.action, sequence.firstSymbol.price))! * 0.999
//     _3StartAmount = _2EndAmount
//     _3EndAmount = (predictResult(_3StartAmount, sequence.thirdSymbol.action, sequence.firstSymbol.price))! * 0.999
//
//     return {startAmount: startAmount, result: _3EndAmount}
// }

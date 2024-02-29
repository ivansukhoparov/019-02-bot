const predictResult = (target: any, act: any, price: any) => {

    if (target !== null) {
        if (price !== null) {
            switch (act) {
                case "buy":
                    return (target / +price);
                case "sell":
                    return (target * +price);
                default:
                    return null;
            }
        }
    }

    return null;
};

const reversePredictResult = (target: any, act: any, price: any) => {

    if (target !== null) {
        if (price !== null) {
            switch (act) {
                case "buy":
                    return (target * +price);
                case "sell":
                    return (target / +price);
                default:
                    return null;
            }
        }
    }
    return null;
};


export const calculateStartAmount = (sequence: any, start: number) => {
    let startAmount = start
    let result = 0;

    let go = false
    while (!go) {


        if ((sequence.firstSymbol.symbol.split("/")[0] === sequence.firstSymbol.currentCurrency
                && +startAmount < +sequence.firstSymbol.actionQty)
            || (sequence.firstSymbol.symbol.split("/")[1] === sequence.firstSymbol.currentCurrency
                && +startAmount < (+sequence.firstSymbol.actionQty * +sequence.firstSymbol.price)
            )) {
            // get amount for secondSymbol in secondSymbol current-currency, it start amount for secondSymbol in secondSymbol current-currency
            const _1InstrResultAmount = (predictResult(startAmount, sequence.firstSymbol.action, sequence.firstSymbol.price))! * 0.999
            const _2StartAmount = _1InstrResultAmount

            if ((sequence.secondSymbol.symbol.split("/")[0] === sequence.secondSymbol.currentCurrency
                    && _2StartAmount < +sequence.secondSymbol.actionQty)
                || (sequence.secondSymbol.symbol.split("/")[1] === sequence.secondSymbol.currentCurrency
                    && (_2StartAmount) < (+sequence.secondSymbol.actionQty * +sequence.secondSymbol.price)
                )) {
                // get amount for thirdSymbol in thirdSymbol current-currency, it start-amount for thirdSymbol in thirdSymbol current-currency
                const _2InstrResultAmount = (predictResult(_1InstrResultAmount, sequence.secondSymbol.action, +sequence.secondSymbol.price))! * 0.999;
                const _3StartAmount = _2InstrResultAmount
                if ((sequence.thirdSymbol.symbol.split("/")[0] === sequence.thirdSymbol.currentCurrency
                        && _3StartAmount < +sequence.thirdSymbol.actionQty)
                    || (sequence.thirdSymbol.symbol.split("/")[1] === sequence.thirdSymbol.currentCurrency
                        && (_3StartAmount) < (+sequence.thirdSymbol.actionQty * +sequence.thirdSymbol.price)
                    )) {

                    const _3InstrResultAmount = (predictResult(_2InstrResultAmount, sequence.thirdSymbol.action, sequence.thirdSymbol.price))! * 0.999;
                    console.log("_1StartAmount: " + startAmount)
                    console.log("_2StartAmount: " + _2StartAmount)
                    console.log("_3StartAmount: " + _3StartAmount)
                    console.log("_3InstrResultAmount: " + _3InstrResultAmount)
                    result = (_3InstrResultAmount - startAmount)
                    console.log("result: " + result)

                    go = true

                } else {

                    let _2EndAmount = sequence.thirdSymbol.actionQty
                    if (sequence.thirdSymbol.symbol.split("/")[0] === sequence.thirdSymbol.currentCurrency) {
                        _2EndAmount = _2EndAmount
                    } else {
                        _2EndAmount = _2EndAmount * sequence.thirdSymbol.price
                    }
                    console.log("3 " + _2EndAmount)
                    const _2StartAmount = reversePredictResult(_2EndAmount, sequence.secondSymbol.action, sequence.secondSymbol.price)! / 0.999
                    console.log("3 _2StartAmount " + _2StartAmount)

                    let _1EndAmount = _2StartAmount
                    // if (sequence.secondSymbol.symbol.split("/")[0] === sequence.secondSymbol.currentCurrency) {
                    //     _1EndAmount = _1EndAmount
                    // } else {
                    //     _1EndAmount = _1EndAmount * sequence.secondSymbol.price
                    // }
                    console.log("3 _1EndAmount" + _1EndAmount)

                    let _1StartAmount = reversePredictResult(_1EndAmount, sequence.firstSymbol.action, sequence.firstSymbol.price)! / 0.999
                    console.log("3 _1StartAmount " + _1StartAmount)
                    startAmount = Math.floor(_1StartAmount)
                    // if (sequence.firstSymbol.symbol.split("/")[0] === sequence.firstSymbol.currentCurrency) {
                    //     startAmount = Math.floor(_1StartAmount)
                    // } else {
                    //     startAmount = Math.floor((_1StartAmount * sequence.firstSymbol.price))
                    // }
                }

            } else {
                console.log("2 " + startAmount)
                let __1Inst = sequence.secondSymbol.actionQty
                if (sequence.secondSymbol.symbol.split("/")[0] === sequence.secondSymbol.currentCurrency) {
                    __1Inst = __1Inst
                } else {
                    __1Inst = __1Inst * sequence.secondSymbol.price
                }

                let _1Inst = reversePredictResult(__1Inst, sequence.firstSymbol.action, sequence.firstSymbol.price)! / 0.999
                startAmount = Math.floor(_1Inst)
                // if (sequence.firstSymbol.symbol.split("/")[0] === sequence.firstSymbol.currentCurrency) {
                //     startAmount = Math.floor(_1Inst)
                // } else {
                //     startAmount = Math.floor((_1Inst * sequence.firstSymbol.price))
                // }
            }

        } else {
            console.log("1 " + startAmount)
            if (sequence.firstSymbol.symbol.split("/")[0] === sequence.firstSymbol.currentCurrency) {
                console.log("11" + startAmount)
                startAmount = Math.floor(sequence.firstSymbol.actionQty)
            } else {
                console.log("12 " + startAmount)
                startAmount = Math.floor((sequence.firstSymbol.actionQty * sequence.firstSymbol.price))
            }

        }
    }

    return {startAmount: startAmount, result: result}
}



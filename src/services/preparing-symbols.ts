import {getAllTradableTickers} from "../adapters/http/fetch";

import {generateCombinations} from "./utils/utils";
import {createTradeSequence} from "./create-trade-sequence";
import {ActionTimer} from "../common/utils/timer";


const getAllCoins=(tradableTickers:any[])=>{

    const result = tradableTickers.reduce((acc:any, item:any) => {
        if (!acc.includes(item.baseAsset)) {
            return [...acc, item.baseAsset];
        }else if (!acc.includes(item.quoteAsset)){
            return [...acc, item.quoteAsset];
        }
        return acc;

    }, []);

    return result;
}

export const preparingSymbols =async ()=>{
    //const startTime = +(new Date());
    const timer =new ActionTimer("preparingSymbols")
    timer.start()
    const tradableTickers =  await getAllTradableTickers();
    const tradableCoins = getAllCoins(tradableTickers)
     //    .filter((el:any)=> el!=="GAL" ||  el!=="GALA" || el!=="T");
     // console.log(tradableCoins)

    let allCombinations = generateCombinations(tradableCoins, 3)
       .filter((el: any) => el[1] === "USDT")
console.log(allCombinations.length)
    const symbols:any = tradableTickers.reduce((acc:any, el:any)=>{
        acc[el.symbol] = el
        delete acc[el.symbol].symbol
        return  acc
    }, {})

    const allSequences =
        allCombinations
            .map((el: any) => createTradeSequence(el, symbols))
            .filter((el: any) => el !== null)
            // .reduce((acc: any, el: any,currentIndex) => {
            //     acc[currentIndex] = el
            //
            //     return acc
            // }, {});

    //    console.log(allSequences);
    //console.log("done in -- " + (+(new Date()) - startTime) / 1000 + "sec")
    timer.stop();
    return {symbols, allSequences};

}


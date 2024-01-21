import {getAllTradableTickers} from "../utils/fetch";

import {generateCombinations} from "./utils/utils";
import {createTradeSequence} from "./create-trade-sequence";
import {ActionTimer, actionTimer} from "../utils/timer";


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
    const tradableCoins = getAllCoins(tradableTickers);
    // console.log(tradableCoins)

    const allCombinations = generateCombinations(tradableCoins, 3);


    const symbols:any = tradableTickers.reduce((acc:any, el:any)=>{
        acc[el.symbol] = el
        delete acc[el.symbol].symbol
        return  acc
    }, {})

    const allSequences = allCombinations.map((el: any) => createTradeSequence(el, symbols)).filter((el: any) => el !== null);
    // console.log(allSequences);
    //console.log("done in -- " + (+(new Date()) - startTime) / 1000 + "sec")
    timer.stop();
    return {symbols, allSequences};

}


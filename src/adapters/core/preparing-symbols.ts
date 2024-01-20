import {getAllTradableTickers} from "../utils/fetch";

import {generateCombinations} from "./utils/utils";

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

    const tradableTickers =  await getAllTradableTickers();
    const tradableCoins = getAllCoins(tradableTickers);
    console.log(tradableCoins)

    const allCombinations = generateCombinations(tradableCoins, 3);
    console.log(allCombinations);

    const symbols:any = tradableTickers.reduce((acc:any, el:any)=>{
        acc[el.symbol] = el
        delete acc[el.symbol].symbol
        return  acc
    }, {})
    return symbols;
}


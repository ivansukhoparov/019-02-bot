import {getAllTradableTickers} from "../utils/fetch";

export const preparingSymbols =async ()=>{
    const tradableTickers =  await getAllTradableTickers();
    const symbols:any = tradableTickers.reduce((acc, el)=>{
        acc[el.symbol] = el
        delete acc[el.symbol].symbol
        return  acc
    }, {})
    return symbols;
}



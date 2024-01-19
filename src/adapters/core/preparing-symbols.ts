import {getAllTradableTickersOnBinance} from "../utils/fetch";

export const preparingSymbols =async ()=>{
    const symbols =  await getAllTradableTickersOnBinance();

    return symbols;
}



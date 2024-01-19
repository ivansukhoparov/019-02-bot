import {tickerDataType, tickerReceivedDataType} from "./input";

export const tickerMapper = (ticker:tickerReceivedDataType):tickerDataType =>{
    return {
        symbol: ticker.s,
        bid: ticker.b,
        ask: ticker.a,
    }
}

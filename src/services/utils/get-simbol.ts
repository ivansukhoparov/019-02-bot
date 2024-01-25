import {askOrBid, getReverseAction} from "./utils";
import {TradeInstructionType} from "../../types/sequences";
import {OrderSide} from "../../types/fetch-binance/input";

export const getSymbol = (base: string,
                          quot: string,
                          currentCurrency:string,
                          action: OrderSide,
                          allSymbols: any): TradeInstructionType | null => {

    if (allSymbols[base + quot] !== undefined) {
        // At first check straight pair is exist and have property "ask" not equal null
        return {
            symbol: base + "/" + quot,
            currentCurrency: currentCurrency,
            action: action,
            price: allSymbols[base + quot][askOrBid(action)]
        }
    } else if (allSymbols[quot + base] !== undefined) {
        // Then check reversed pair is exist and have property "ask" not equal null
        const reverseAction: OrderSide = getReverseAction(action)
        return {
            symbol: quot + "/" + base,
            currentCurrency: currentCurrency,
            action: reverseAction,
            price: allSymbols[quot + base][askOrBid(reverseAction)]
        }
    } else {
        // Return null if don't have satisfy symbol
        return null;
    }
}

import {askOrBid, getReverseAction} from "./utils";
import {TradeSequenceType} from "../../types/sequences";

export const getSymbol = (base: string,
                          quot: string,
                          currentCurrency:string,
                          action: "buy" | "sell",
                          allSymbols: any): TradeSequenceType | null => {

    if (allSymbols[base + quot] !== undefined) {
        // At first check straight pair is exist and have property "ask" not equal null
        return {
            symbol: base + quot,
            currentCurrency: currentCurrency,
            action: action,
            price: allSymbols[base + quot][askOrBid(action)]
        }
    } else if (allSymbols[quot + base] !== undefined) {
        // Then check reversed pair is exist and have property "ask" not equal null
        const reverseAction: "buy" | "sell" = getReverseAction(action)
        return {
            symbol: quot + base,
            currentCurrency: currentCurrency,
            action: reverseAction,
            price: allSymbols[quot + base][askOrBid(reverseAction)]
        }
    } else {
        // Return null if don't have satisfy symbol
        return null;
    }
}

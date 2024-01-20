import {askOrBid, getReverseAction} from "./utils";
import {TradeSequenceType} from "../../types/sequences";

export const getSymbol = (base: string, quot: string, action: "buy" | "sell", allSymbols: any): TradeSequenceType | null => {

    if (allSymbols[base + quot] !== undefined && allSymbols[base + quot].ask !== null) {
        // At first check straight pair is exist and have property "ask" not equal null
        return {
            symbol: base + quot,
            action: action,
            price: allSymbols[base + quot][askOrBid(action)]
        }
    } else if (allSymbols[quot + base] !== undefined && allSymbols[quot + base].ask !== null) {
        // Then check reversed pair is exist and have property "ask" not equal null
        const reverseAction: "buy" | "sell" = getReverseAction(action)
        return {
            symbol: quot + base,
            action: reverseAction,
            price: allSymbols[base + quot][askOrBid(reverseAction)]
        }
    } else {
        // Return null if don't have satisfy symbol
        return null;
    }
}

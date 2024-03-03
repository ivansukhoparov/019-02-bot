import {askOrBid, getReverseAction} from "./utils";
import {TradeInstructionType} from "../../types/sequences";
import {OrderSide} from "../../types/fetch-binance/input";

export const getSymbol = (base: string,
	quot: string,
	currentCurrency:string,
	action: OrderSide,
	symbolsDataSet: any): TradeInstructionType | null => {

	if (symbolsDataSet[base +"/"+ quot] !== undefined) {
		// At first check straight pair is exist and have property "ask" not equal null
		return {
			symbol: base + "/" + quot,
			currentCurrency: currentCurrency,
			action: action,
			price: symbolsDataSet[base + "/" + quot][askOrBid(action)],
			actionQty: null,
			actionQtyInQuote: null,
			priceChange24Per: null,
			lastPriceChange: null,
			lastQuantity: null,
			filters:{...symbolsDataSet[base + "/" + quot].filters}
		};
	} else if (symbolsDataSet[quot +"/"+ base] !== undefined) {
		// Then check reversed pair is exist and have property "ask" not equal null
		const reverseAction: OrderSide = getReverseAction(action);
		return {
			symbol: quot + "/" + base,
			currentCurrency: currentCurrency,
			action: reverseAction,
			price: symbolsDataSet[quot + "/" + base][askOrBid(reverseAction)],
			actionQty: null,
			actionQtyInQuote: null,
			priceChange24Per:null,
			lastPriceChange: null,
			lastQuantity: null,
			filters: {...symbolsDataSet[quot + "/" + base].filters}
		};
	} else {
		// Return null if don't have satisfy symbol
		return null;
	}
};

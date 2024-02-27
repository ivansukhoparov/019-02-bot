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
			priceChange24Per:null,
			price: symbolsDataSet[base + "/" + quot][askOrBid(action)],
			filters:{...symbolsDataSet[base + "/" + quot].filters}
		};
	} else if (symbolsDataSet[quot +"/"+ base] !== undefined) {
		// Then check reversed pair is exist and have property "ask" not equal null
		const reverseAction: OrderSide = getReverseAction(action);
		return {
			symbol: quot + "/" + base,
			currentCurrency: currentCurrency,
			action: reverseAction,
			priceChange24Per:null,
			price: symbolsDataSet[quot + "/" + base][askOrBid(reverseAction)],
			filters:{...symbolsDataSet[quot + "/" + base].filters}
		};
	} else {
		// Return null if don't have satisfy symbol
		return null;
	}
};

import {OrderSide, QuantityType} from "../types/fetch-binance/input";
import {BinanceAdapter} from "../adapters/http/binance-adapter";
import {TradeInstructionType, TradeSequenceType} from "../types/sequences";



export const tradeThis = async (instruction: TradeInstructionType) => {
	console.log(instruction.symbol);
	const symbol = instruction.symbol.replace("/", "");
	const side: OrderSide = instruction.action;
	const {quantityCurrency, quantityType} = getQuantityType(instruction);
	const currencyAmount = await BinanceAdapter.getCurrencyBalance(quantityCurrency);
	const quantityAmount = roundDownNumber(currencyAmount, +instruction.filters.stepSize);
	return  BinanceAdapter.placeOrder(symbol, quantityType, quantityAmount, side);
};

type s= "firstSymbol"|"secondSymbol"|"thirdSymbol"

export const  tradeAllSequence =async (sequence: TradeSequenceType) => {



	const result1=  await tradeThis(sequence.firstSymbol);
	console.log("trade sequence " + result1.type);
	console.log(sequence.firstSymbol);
	console.log("============================================================");
	const result2=  await tradeThis(sequence.secondSymbol);
	console.log("trade sequence " + result2.type);
	console.log(sequence.secondSymbol);
	console.log("============================================================");
	const result3=  await tradeThis(sequence.thirdSymbol);
	console.log("trade sequence " + result3.type);
	console.log(sequence.thirdSymbol);
	console.log("============================================================");
	// console.log("trade sequence " + result.type)
	// console.log(i);
	//   console.log(result.content)
	// console.log(result.content.status)

	//      OLD
	// const steps:s[]=  Object.keys(sequence).map((el)=> el as s )
	// for (let i = 0; i < steps.length; i++) {
	//     const step: TradeInstructionType = sequence[steps[i]]
	//     const result=  await tradeThis(step);
	//     // console.log("trade sequence " + result.type)
	//     console.log(i);
	//     console.log(result.content)
	//     // console.log(result.content.status)
	// }
};

const getQuantityType = (instruction: TradeInstructionType): {
    quantityCurrency: string,
    quantityType: QuantityType
} => {
	switch (instruction.action) {
	case "buy":
		return {
			quantityCurrency: getSymbolQuote(instruction.symbol),
			quantityType: "quoteOrderQty"
		};
	case "sell":
		return {
			quantityCurrency: getSymbolBase(instruction.symbol),
			quantityType: "quantity"
		};
	}
};

const getSymbolBase = (symbol: string) => {
	return symbol.split("/")[0];
};
const getSymbolQuote = (symbol: string) => {
	return symbol.split("/")[1];
};

export function roundDownNumber(number1:number|string, number2:number|string) {
	const decimalPlaces = (number2.toString().split(".")[1] || []).length;
	const multiplier = Math.pow(10, decimalPlaces);
	return Math.floor(+number1 * multiplier) / multiplier;
}

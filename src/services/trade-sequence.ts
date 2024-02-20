import {OrderSide, QuantityType} from "../types/fetch-binance/input";
import {BinanceAdapter} from "../adapters/http/binance-adapter";
import {TradeInstructionType, TradeSequenceType} from "../types/sequences";
import {BinanceService} from "../application/binance-service";



export const tradeThis = async (instruction: TradeInstructionType, updSymbolsDataSet:any,amount:number, ident:string) => {
	// console.log(ident + "+++++")
	// console.log(ident +"instruction:  ")
	// console.log(instruction)
	// console.log(ident +"+++++")
	const currentCurrecny = instruction.currentCurrency

	let targetCurrency

	const separatedSymbol =  instruction.symbol.split("/")
	if (separatedSymbol[0] === currentCurrecny) targetCurrency = separatedSymbol[1]
	else targetCurrency = separatedSymbol[0]
	// console.log(ident +"+++++")
	// console.log(ident +"currentCurrecny " +currentCurrecny)
	// console.log(ident +"targetCurrency "+ targetCurrency)
	// console.log(ident +"get balance ")

	// Get amount for traiding
	// const amount = await BinanceAdapter.getCurrencyBalance(currentCurrecny);
	//
	// console.log(ident +"amount " + amount)
	// console.log(ident +"+++++")
	// console.log(ident +"do trade ")
	const result= await BinanceService.createOrder(currentCurrecny, targetCurrency,amount,updSymbolsDataSet)
	// console.log(ident +"result " + result.type)
	// console.dir(result.content)
// console.log("symbol.info")
// 	console.dir(await BinanceAdapter.getSymbolInfo(result.content.symbol))
	return result.content
	// console.log(instruction.symbol);
	// const symbol = instruction.symbol.replace("/", "");
	// const side: OrderSide = instruction.action;
	// const {quantityCurrency, quantityType} = getQuantityType(instruction);
	//
	// const quantityAmount = roundDownNumber(currencyAmount, +instruction.filters.stepSize);
	// return  BinanceAdapter.placeOrder(symbol, quantityType, quantityAmount, side);
};

type s= "firstSymbol"|"secondSymbol"|"thirdSymbol"

// {
// 	firstSymbol: {
// 		symbol: 'ETH/USDT',
// 			currentCurrency: 'USDT',
// 			action: 'buy',
// 			price: '2818.88000000',
// 			filters: {
// 			minNotional: '5.00000000',
// 				minQty: '0.00010000',
// 				minQtyMarket: '0.00000000',
// 				stepSize: '0.00010000',
// 				stepSizeMarket: '0.00010000'
// 		}
// 	},
// 	secondSymbol: {
// 		symbol: 'ETH/BRL',
// 			currentCurrency: 'ETH',
// 			action: 'sell',
// 			price: '14106.91000000',
// 			filters: {
// 			minNotional: '10.00000000',
// 				minQty: '0.00010000',
// 				minQtyMarket: '0.00000000',
// 				stepSize: '0.00010000',
// 				stepSizeMarket: '0.00010000'
// 		}
// 	},
// 	thirdSymbol: {
// 		symbol: 'USDT/BRL',
// 			currentCurrency: 'BRL',
// 			action: 'buy',
// 			price: '5.00300000',
// 			filters: {
// 			minNotional: '10.00000000',
// 				minQty: '0.10000000',
// 				minQtyMarket: '0.00000000',
// 				stepSize: '0.10000000',
// 				stepSizeMarket: '0.10000000'
// 		}
// 	},
// 	priceDiff: 0.028741411073426093


export const  tradeAllSequence =async (sequence: TradeSequenceType,updSymbolsDataSet:any,startAmount:string|number) => {
	// console.log("trade sequence 1");
	// console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

	const result1=  await tradeThis(sequence.firstSymbol,updSymbolsDataSet,+startAmount,"1.");
	let fills1
	if (sequence.firstSymbol.action==="buy"){
		fills1 = result1.executedQty
	}else{
		fills1 = result1.cummulativeQuoteQty;
	}

	// console.log("====================================================================================================");
	// console.log("trade sequence 2 ");
	// console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
	const result2=  await tradeThis(sequence.secondSymbol,updSymbolsDataSet,+fills1,"2.");
	let fills2
	if (sequence.secondSymbol.action==="buy"){
		 fills2 = result2.executedQty
	}else{
		fills2 = result2.cummulativeQuoteQty;
	}
	// console.log(sequence.secondSymbol);
	// console.log("====================================================================================================");
	// console.log("trade sequence 3");
	// console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
	const result3=  await tradeThis(sequence.thirdSymbol,updSymbolsDataSet,+fills2, "3.");
	//
	// console.log(sequence.thirdSymbol);
	// console.log("====================================================================================================");
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

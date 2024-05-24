import {QuantityType} from "../types/fetch-binance/input";
import {BinanceHttpAdapterOLD} from "../adapters/http/binanceHttpAdapterOLD";
import {TradeInstructionType, TradeSequenceType} from "../types/sequences";
import {BinanceService} from "../application/binance-service";
import {logCurrencyAmount} from "../common/utils/logs";


export const tradeThis = async (instruction: TradeInstructionType, updSymbolsDataSet:any,amount:number, ident:string) => {
	console.log(ident + "+++++")
	console.log(ident +"instruction:  ")
	console.log(instruction)
	console.log(ident +"+++++")
	const currentCurrecny = instruction.currentCurrency

	let targetCurrency

	const separatedSymbol =  instruction.symbol.split("/")
	if (separatedSymbol[0] === currentCurrecny) targetCurrency = separatedSymbol[1]
	else targetCurrency = separatedSymbol[0]
	console.log(ident +"+++++")
	console.log(ident +"currentCurrecny " +currentCurrecny)
	console.log(ident +"targetCurrency "+ targetCurrency)
	console.log(ident +"get balance ")

	// Get amount for traiding
	// const amount = await BinanceHttpAdapter.getCurrencyBalance(currentCurrecny);
	//
	console.log(ident +"amount " + amount)
	console.log(ident +"+++++")
	console.log(ident +"do trade ")
	const result= await BinanceService.createOrder(currentCurrecny, targetCurrency,amount,updSymbolsDataSet)
	console.log(ident +"result " + result.type)
	console.dir(result.content)
	if (result.type === "success"){
		console.log("symbol.info")
		console.dir(await BinanceHttpAdapterOLD.getSymbolInfo(result.content.symbol))
	}
	return result.content
	// console.log(instruction.symbol);
	// const symbol = instruction.symbol.replace("/", "");
	// const side: OrderSide = instruction.action;
	// const {quantityCurrency, quantityType} = getQuantityType(instruction);
	//
	// const quantityAmount = roundDownNumber(currencyAmount, +instruction.filters.stepSize);
	// return  BinanceHttpAdapter.placeOrder(symbol, quantityType, quantityAmount, side);
};

type s= "_1_Instruction"|"_2_Instruction"|"_3_Instruction"

// {
// 	_1_Instruction: {
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
// 	_2_Instruction: {
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
// 	_3_Instruction: {
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
	console.log("trade sequence 1");
	console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

	const result1=  await tradeThis(sequence._1_Instruction,updSymbolsDataSet,+startAmount,"1.");
	let fills1
	if (sequence._1_Instruction.action==="buy"){
		fills1 = result1.executedQty
	}else{
		fills1 = result1.cummulativeQuoteQty;
	}
	console.log("result amount");
	console.log(fills1);
	console.log("realAmount");
	const usdtAmount1 = await BinanceHttpAdapterOLD.getCurrencyBalance(sequence._2_Instruction.currentCurrency);
	console.log(sequence._2_Instruction.currentCurrency +" " +usdtAmount1);

	console.log("====================================================================================================");
	console.log("trade sequence 2 ");
	console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
	const result2=  await tradeThis(sequence._2_Instruction,updSymbolsDataSet,+usdtAmount1,"2.");
	let fills2
	if (sequence._2_Instruction.action==="buy"){
		 fills2 = result2.executedQty
	}else{
		fills2 = result2.cummulativeQuoteQty;
	}
	console.log(sequence._2_Instruction);
	console.log("result amount");
	console.log(fills2);
	console.log("realAmount");
	const usdtAmount2 = await BinanceHttpAdapterOLD.getCurrencyBalance(sequence._3_Instruction.currentCurrency);
	console.log(sequence._3_Instruction.currentCurrency +" " +usdtAmount2);
	console.log("====================================================================================================");
	console.log("trade sequence 3");
	console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
	const result3=  await tradeThis(sequence._3_Instruction,updSymbolsDataSet,+usdtAmount2, "3.");

	let fills3
	if (sequence._3_Instruction.action==="buy"){
		fills3 = result3.executedQty
	}else{
		fills3 = result3.cummulativeQuoteQty;
	}

	console.log(sequence._3_Instruction);
	console.log("result amount");
	console.log(fills3);
	console.log("====================================================================================================");
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

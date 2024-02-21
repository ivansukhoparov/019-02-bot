import WebSocket from "ws";
import {askOrBid} from "../../services/utils/utils";
import {tradeAllSequence} from "../../services/trade-sequence";
import {ActionTimer} from "../../common/utils/timer";
import {BinanceAdapter} from "../http/binance-adapter";
import {appSettings} from "../../settings/settings";

const timer =new ActionTimer("update")
let counter = 500;
let counter2 = 0;
let maxInInterval: number = 0
let flag = true;
let flag2 = true;
let usdtAmount: string = "100"
const thresholdValue = appSettings.binance.params.thresholdValue;
const stopThresholdValue = appSettings.binance.params.stopThresholdValue
const streamNames = ["!ticker@arr"];
const combinedStreamsUrl = `wss://stream.binance.com:9443/stream?streams=${streamNames.join("/")}`;
//const combinedStreamsUrl="wss://testnet.binance.vision/ws/!ticker@arr"

const connection = new WebSocket(combinedStreamsUrl);

export const wsUpdate = (symbolsDataSet: any, sequencesDataSet: any, startAmount:string) => {
	connection.onopen = async () => {
		console.log("Connected to Binance combined WebSocket");
	};

	connection.onmessage = async (e) => {
		try {
			if (flag2) {
				flag2 = false;
				// console.log("get balance for calculating")
				usdtAmount = startAmount
				// console.log("USDT for calculating - " + startUsdtAmonut)
			}



			const data = JSON.parse(e.data.toString());
			const updSymbolsDataSet = updatePrices(symbolsDataSet, data.data); // for real api
			// const updSymbolsDataSet = updatePrices(symbolsDataSet, data); // for test api
			const updateSeq = updatePricesInSeq(sequencesDataSet, updSymbolsDataSet);
			//console.log(updateSeq)
			const sorted = updateSeq.map(PredictTradeResult).sort((a: any, b: any) => b.priceDiff - a.priceDiff);
			const opp = sorted.filter((el: any) => el.priceDiff > thresholdValue && el.priceDiff < 5 && el.priceDiff !== null)

			if (maxInInterval < sorted[0].priceDiff) maxInInterval = sorted[0].priceDiff;

			if (opp.length > 0 && flag) {

				flag = false
				console.log("============================================================");
				console.log("============================================================");
				console.log("has found " + opp.length);
				console.log("============================================================");
				console.log("============================================================");
				console.log("Let's do it");
				console.log("============================================================");
				console.log(opp[0])
				const tradeTimer = new ActionTimer("trade sequence")
				tradeTimer.start()
				const sequence = await updateDifferences(opp[0])
				console.log(sequence)
				if (sequence.priceDiff > thresholdValue && opp[0].isAllow){
					await tradeAllSequence(sequence, updSymbolsDataSet,usdtAmount);
				}else{
				 console.log("sequence ruined :(")
				}
				tradeTimer.stop()
					// counter += (opp[i].priceDiff-0.3);
					//console.log(opp)
					// console.log("expeсted income "+counter);
				usdtAmount = await BinanceAdapter.getCurrencyBalance("USDT");
				console.log("USDT - " + usdtAmount)
				if (usdtAmount>stopThresholdValue){
					flag = true
				}else {
					flag = false
					console.log("Trading stop")
				}


			}
			if (counter === 500) {
				console.log("status: ok")

				console.log("max in period: " + maxInInterval)

				console.log("-------------------------------------------------------------")
				counter = 0
				maxInInterval = 0
			}
			counter++



		} catch (error) {
			console.error("Ошибка при обработке сообщения:", error);
		}
	};


	connection.onerror = (error) => {
		console.error("WebSocket error:", error.message);
	};

	connection.onclose = () => {
		console.log("Disconnected from Binance WebSocket");
	};
};


function updatePrices(symbolsDataSet: any, tickerData: any) {
	const symbols = {...symbolsDataSet};
	tickerData.forEach((el: any) => {
		if (symbolsDataSet[addSlash(el.s, 3)]) {
			symbols[addSlash(el.s, 3)].bid = el.b;
			symbols[addSlash(el.s, 3)].ask = el.a;
		} else if (symbolsDataSet[addSlash(el.s, 4)]) {
			symbols[addSlash(el.s, 4)].bid = el.b;
			symbols[addSlash(el.s, 4)].ask = el.a;
		} else if (symbolsDataSet[addSlash(el.s, 1)]) {
			symbols[addSlash(el.s, 1)].bid = el.b;
			symbols[addSlash(el.s, 1)].ask = el.a;
		} else if (symbolsDataSet[addSlash(el.s, 2)]) {
			symbols[addSlash(el.s, 2)].bid = el.b;
			symbols[addSlash(el.s, 2)].ask = el.a;
		} else if (symbolsDataSet[addSlash(el.s, 4)]) {
			symbols[addSlash(el.s, 5)].bid = el.b;
			symbols[addSlash(el.s, 5)].ask = el.a;
		} else if (symbolsDataSet[addSlash(el.s, 6)]) {
			symbols[addSlash(el.s, 6)].bid = el.b;
			symbols[addSlash(el.s, 6)].ask = el.a;
		} else if (symbolsDataSet[addSlash(el.s, 7)]) {
			symbols[addSlash(el.s, 7)].bid = el.b;
			symbols[addSlash(el.s, 7)].ask = el.a;
		} else if (symbolsDataSet[addSlash(el.s, 8)]) {
			symbols[addSlash(el.s, 8)].bid = el.b;
			symbols[addSlash(el.s, 8)].ask = el.a;
		}
	});
	return symbols;
}

function addSlash(symbol: string, pos: number) {

	return symbol.slice(0, pos) + "/" + symbol.slice(pos);

}

// {
//     firstSymbol: {
//         symbol: 'ETH/USDT',
//             currentCurrency: 'USDT',
//             action: 'buy',
//             price: null,
//             filters: [Object]
//     },
//     secondSymbol: {
//         symbol: 'SNT/ETH',
//             currentCurrency: 'ETH',
//             action: 'buy',
//             price: null,
//             filters: [Object]
//     },
//     thirdSymbol: {
//         symbol: 'SNT/USDT',
//             currentCurrency: 'SNT',
//             action: 'sell',
//             price: null,
//             filters: [Object]
//     }
// },

function updatePricesInSeq(target: any, symbols: any) {

	target.forEach((el: any) => {
		el.firstSymbol.price = symbols[el.firstSymbol.symbol][askOrBid(el.firstSymbol.action)];
		el.secondSymbol.price = symbols[el.secondSymbol.symbol][askOrBid(el.secondSymbol.action)];
		el.thirdSymbol.price = symbols[el.thirdSymbol.symbol][askOrBid(el.thirdSymbol.action)];
	});

	return target;
}

const predictOrderResult = (target: number | null, act: string, price: string | null) => {

	if (target !== null) {
		if (price !== null) {
			switch (act) {
			case "buy":
				return (target! / +price);
			case "sell":
				return (target! * +price);
			default:
				return null;
			}
		}
	}
	return null;
};

const oppot= (data:any)=>{
	try{
		const c =  data.firstSymbol.price-(data.secondSymbol.price*data.thirdSymbol.price);
		return  c/data.firstSymbol.price*100;
	}catch(e){
		return null;
	}

};

export function PredictTradeResult(el: any) {

	let isAllow = true;

	// calculate prediction for sequence trade in base
	let expectedResultInBase: number | null;
	expectedResultInBase = predictOrderResult(100, el.firstSymbol.action, el.firstSymbol.price);
	expectedResultInBase = predictOrderResult(expectedResultInBase, el.secondSymbol.action, el.secondSymbol.price);
	expectedResultInBase = predictOrderResult(expectedResultInBase, el.thirdSymbol.action, el.thirdSymbol.price);

	if (+usdtAmount < el.firstSymbol.filters.minNotional) isAllow = false
	const logger0 = "start balance is " + isAllow

	// CHECK FIRST SEQUENCE
	let expectedResult: number | null = predictOrderResult(+usdtAmount, el.firstSymbol.action, el.firstSymbol.price);



	let logger1 = "symbol 1 " + el.firstSymbol.symbol + " || " + el.firstSymbol.action + " for " +
		+el.firstSymbol.price + " || " + expectedResult + " || " + isAllow

	// CHECK SECOND SEQUENCE
	if ( el.secondSymbol.action === "buy"){
		if (expectedResult && expectedResult < el.secondSymbol.filters.minNotional) {
			isAllow = false
		}
	}else{
		if (expectedResult && expectedResult < el.secondSymbol.filters.minQty) {
			isAllow = false
		}
	}

	expectedResult = predictOrderResult(expectedResult, el.secondSymbol.action, el.secondSymbol.price);

	let logger2 = "symbol 2 " + el.secondSymbol.symbol + " || " + el.secondSymbol.action + " for " +
		+el.secondSymbol.price + " || " + expectedResult + " || " + isAllow

	// CHECK THIRD SEQUENCE
	if ( el.thirdSymbol.action === "buy"){
		if (expectedResult && expectedResult < el.secondSymbol.filters.minNotional) {
			isAllow = false
		}
	}else{
		if (expectedResult && expectedResult < el.secondSymbol.filters.minQty) {
			isAllow = false
		}
	}
	expectedResult = predictOrderResult(expectedResult, el.thirdSymbol.action, el.thirdSymbol.price);
	let logger3 = "symbol 3 " + el.thirdSymbol.symbol + " || " + el.thirdSymbol.action + " for " +
		+el.thirdSymbol.price + " || " + expectedResult + " || " + isAllow

	if (expectedResultInBase) {
		expectedResultInBase = expectedResultInBase - 100;
	}

	return {
		...el,
		priceDiff: expectedResultInBase,
		isAllow: isAllow,
		logger0: logger0,
		logger1: logger1,
		logger2: logger2,
		logger3: logger3
	};
}

export async function  updateDifferences(el:any) {
	const fs = await BinanceAdapter.getSymbolInfo(el.firstSymbol.symbol.replace("/", ""))
	const ss = await BinanceAdapter.getSymbolInfo(el.secondSymbol.symbol.replace("/", ""))
	const ts = await BinanceAdapter.getSymbolInfo(el.thirdSymbol.symbol.replace("/", ""))
	el.firstSymbol.price = fs[askOrBid(el.firstSymbol.action)+"Price"];
	el.secondSymbol.price = ss[askOrBid(el.secondSymbol.action)+"Price"];
	el.thirdSymbol.price = ts[askOrBid(el.thirdSymbol.action)+"Price"];

	let diff: number | null = predictOrderResult(100, el.firstSymbol.action, el.firstSymbol.price);
	let diffF: number | null = predictOrderResult(+usdtAmount, el.firstSymbol.action, el.firstSymbol.price);
	let logger1 = "symbol 1 " + el.firstSymbol.symbol + " || " + el.firstSymbol.action + " for " + el.firstSymbol.price + " || " + diffF

	diff = predictOrderResult(diff, el.secondSymbol.action, el.secondSymbol.price);
	diffF = predictOrderResult(diffF, el.secondSymbol.action, el.secondSymbol.price);
	let logger2 = "symbol 2 " + el.secondSymbol.symbol + " || " + el.secondSymbol.action + " for " + el.secondSymbol.price + " || " + diffF

	diff = predictOrderResult(diff, el.thirdSymbol.action, el.thirdSymbol.price);
	diffF = predictOrderResult(diffF, el.thirdSymbol.action, el.thirdSymbol.price);
	let logger3 = "symbol 3 " + el.thirdSymbol.symbol + " || " + el.thirdSymbol.action + " for " + el.thirdSymbol.price + " || " + diffF

	if (diff){
		diff=diff-100;
	}
	const opp = oppot(el);
	return {
		...el,
		priceDiff:diff,
		logger1: logger1,
		logger2: logger2,
		logger3: logger3,
	};

}

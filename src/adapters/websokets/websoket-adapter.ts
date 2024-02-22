import WebSocket from "ws";
import {askOrBid} from "../../services/utils/utils";
import {tradeAllSequence} from "../../services/trade-sequence";
import {ActionTimer} from "../../common/utils/timer";
import {BinanceAdapter} from "../http/binance-adapter";
import {appMode, appSettings} from "../../settings/settings";
import {APP_MODES} from "../../common/common";

const timer =new ActionTimer("update")
let counter = 50;
let counter2 = 0;
let maxInInterval: number = 0
let flag = true;
let flag2 = true;
let usdtAmount: string = "100"
const thresholdValue = appSettings.binance.params.thresholdValue;
const stopThresholdValue = appSettings.binance.params.stopThresholdValue
let combinedStreamsUrl:string

if (appMode === APP_MODES.test) {
	combinedStreamsUrl="wss://testnet.binance.vision/ws/!ticker@arr"
} else {
	const streamNames = ["!ticker@arr"];
	combinedStreamsUrl = `wss://stream.binance.com:9443/stream?streams=${streamNames.join("/")}`;
}

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
			let updSymbolsDataSet:any

			if (appMode === APP_MODES.test) {
				updSymbolsDataSet = updatePrices(symbolsDataSet, data); // for test api
			} else {
				updSymbolsDataSet = updatePrices(symbolsDataSet, data.data); // for real api
			}


			const updateSeq = updatePricesInSeq(sequencesDataSet, updSymbolsDataSet);
			//console.log(updateSeq)
			const sorted = updateSeq.map(PredictTradeResult).sort((a: any, b: any) => b.profiTReal - a.profiTReal);
			const opp = sorted.filter((el: any) => el.profiTReal > thresholdValue && el.profiTReal < 5 && el.profiTReal !== null)

			if (maxInInterval < sorted[0].profiTReal) maxInInterval = sorted[0].profiTReal;

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
				if (sequence.profiTReal > thresholdValue && opp[0].isAllow) {
					await tradeAllSequence(sequence, updSymbolsDataSet, usdtAmount);
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
			if (counter === 50) {
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

export function PredictTradeResult(sequence: any) {

	let isAllow = true;

	// calculate prediction for sequence trade in base
	let expectedResultInBase: number | null;
	let expectedResult: number | null;
	expectedResultInBase = (predictOrderResult(100, sequence.firstSymbol.action, sequence.firstSymbol.price))! * 0.999;
	expectedResultInBase = (predictOrderResult(expectedResultInBase, sequence.secondSymbol.action, sequence.secondSymbol.price))! * 0.999;
	expectedResultInBase = (predictOrderResult(expectedResultInBase, sequence.thirdSymbol.action, sequence.thirdSymbol.price))! * 0.999;

	if (+usdtAmount < sequence.firstSymbol.filters.minNotional) isAllow = false
	const logger0 = "start balance is " + usdtAmount

	// CHECK FIRST SEQUENCE
	expectedResult = (predictOrderResult(+usdtAmount, sequence.firstSymbol.action, sequence.firstSymbol.price))! * 0.999;

	let logger1 = "symbol 1 " + sequence.firstSymbol.symbol + " || " + sequence.firstSymbol.action + " for " +
		+sequence.firstSymbol.price + " || " + expectedResult + " || " + isAllow

	// CHECK SECOND SEQUENCE
	if (sequence.secondSymbol.action === "buy") {
		if (expectedResult && expectedResult < sequence.secondSymbol.filters.minNotional) {
			isAllow = false
		}
	}else{
		if (expectedResult && expectedResult < sequence.secondSymbol.filters.minQty) {
			isAllow = false
		}
	}

	expectedResult = (predictOrderResult(expectedResult, sequence.secondSymbol.action, sequence.secondSymbol.price))! * 0.999;

	let logger2 = "symbol 2 " + sequence.secondSymbol.symbol + " || " + sequence.secondSymbol.action + " for " +
		+sequence.secondSymbol.price + " || " + expectedResult + " || " + isAllow

	// CHECK THIRD SEQUENCE
	if (sequence.thirdSymbol.action === "buy") {
		if (expectedResult && expectedResult < sequence.secondSymbol.filters.minNotional) {
			isAllow = false
		}
	}else{
		if (expectedResult && expectedResult < sequence.secondSymbol.filters.minQty) {
			isAllow = false
		}
	}
	expectedResult = (predictOrderResult(expectedResult, sequence.thirdSymbol.action, sequence.thirdSymbol.price))! * 0.999;
	let logger3 = "symbol 3 " + sequence.thirdSymbol.symbol + " || " + sequence.thirdSymbol.action + " for " +
		+sequence.thirdSymbol.price + " || " + expectedResult + " || " + isAllow

	if (expectedResultInBase) {
		expectedResultInBase = expectedResultInBase - 100;
	}
	if (expectedResult) {
		expectedResult = expectedResult - (+usdtAmount);
	}

	return {
		...sequence,
		profitInBase: expectedResultInBase,
		profiTReal: expectedResult,
		isAllow: isAllow,
		logger0: logger0,
		logger1: logger1,
		logger2: logger2,
		logger3: logger3
	};
}

export async function updateDifferences(sequence: any) {
	const fs = await BinanceAdapter.getSymbolInfo(sequence.firstSymbol.symbol.replace("/", ""))
	const ss = await BinanceAdapter.getSymbolInfo(sequence.secondSymbol.symbol.replace("/", ""))
	const ts = await BinanceAdapter.getSymbolInfo(sequence.thirdSymbol.symbol.replace("/", ""))

	sequence.firstSymbol.price = fs[askOrBid(sequence.firstSymbol.action) + "Price"];
	sequence.secondSymbol.price = ss[askOrBid(sequence.secondSymbol.action) + "Price"];
	sequence.thirdSymbol.price = ts[askOrBid(sequence.thirdSymbol.action) + "Price"];

	return PredictTradeResult(sequence)
}

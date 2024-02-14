import WebSocket from "ws";
import {askOrBid} from "../../services/utils/utils";


let counter = 0;


const streamNames = ["!ticker@arr"];
const combinedStreamsUrl = `wss://stream.binance.com:9443/stream?streams=${streamNames.join("/")}`;

const connection = new WebSocket(combinedStreamsUrl);

export const wsUpdate = (symbolsDataSet: any, sequencesDataSet: any) => {
	connection.onopen = async () => {
		console.log("Connected to Binance combined WebSocket");
	};

	connection.onmessage = async (e) => {
		try {
			const data = JSON.parse(e.data.toString());
			const updSymbolsDataSet = updatePrices(symbolsDataSet, data.data);
			//console.log(data.data)

			const updateSeq = updatePricesInSeq(sequencesDataSet, updSymbolsDataSet);
			//console.log(updateSeq)
			const opp = updateSeq.map(calculateDifferences)
				.filter((el: any) => el.priceDiff > 0.00 && el.priceDiff < 5 && el.priceDiff !== null)
				.sort((a:any, b:any) => b.priceDiff - a.priceDiff);
			if (opp.length>0) {
				console.log("has found " + opp.length);
					console.log(opp[0])
					// await tradeAllSequence(opp[0]);
					// counter += (opp[i].priceDiff-0.3);
					//console.log(opp)
					// console.log("expeсted income "+counter);
			}
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
		if (symbolsDataSet[addSlash(el.s, 4)]) {
			symbols[addSlash(el.s, 4)].bid = el.b;
			symbols[addSlash(el.s, 4)].ask = el.a;
		} else if (symbolsDataSet[addSlash(el.s, 3)]) {
			symbols[addSlash(el.s, 3)].bid = el.b;
			symbols[addSlash(el.s, 3)].ask = el.a;
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


const buyOrSell = (target: number | null, act: string, price: string | null) => {

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


export function calculateDifferences(el: any) {
	//target.map((el: any) => {
	let diff: number | null = buyOrSell(100, el.firstSymbol.action, el.firstSymbol.price);
	diff = buyOrSell(diff, el.secondSymbol.action, el.secondSymbol.price);
	diff = buyOrSell(diff, el.thirdSymbol.action, el.thirdSymbol.price);
	if (diff){
		diff=diff-100;
	}
	const opp = oppot(el);
	return {
		...el,
		priceDiff:diff,
		//opp:opp

	};
	//  })
}

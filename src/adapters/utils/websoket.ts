import  WebSocket from 'ws';
import {tickerMapper} from "../types/web-soket-binance/mapper";
import {TradingSymbolsType} from "../types/fetch-binance/input";
import {getExchangePairs} from "../core/update-symbols";

const THRESHOLD = 0
const streamNames = ['!ticker@arr'];
const combinedStreamsUrl = `wss://stream.binance.com:9443/stream?streams=${streamNames.join('/')}`;

const connection = new WebSocket(combinedStreamsUrl);

export let log:any = [];  // Словарь для хранения последних цен по каждой паре


export const wsUpdate =(symbols:TradingSymbolsType[])=> {
    connection.onopen = async () => {
        console.log('Connected to Binance combined WebSocket');
    };

    connection.onmessage = async (e) => {
        try {
            const data = JSON.parse(e.data.toString());

           const prices = data.data.map(tickerMapper);
            // Обновляем цены в словаре
            console.log("pr - " + prices.length)
            console.log("s - " +symbols.length)
            log = symbols.map((el:any)=>{
                const s = prices.find((e:any)=>e.symbol===el.symbol);
                return {
                    ...s,
                    baseAsset: el.baseAsset,
                    quoteAsset: el.quoteAsset
                }
            })
          //  console.log("log - " +log)
console.log(getExchangePairs(log).length)
            // Поиск арбитражных возможностей
            // const opportunities = findArbitrageOpportunities();
            // if (opportunities.length >= 0) {
            //     console.log('Arbitrage opportunities found:', opportunities);
            // }
        } catch (error) {
            console.error('Ошибка при обработке сообщения:', error);
        }
    };

    connection.onerror = (error) => {
        console.error('WebSocket error:', error.message);
    };

    connection.onclose = () => {
        console.log('Disconnected from Binance WebSocket');
    };
}

//
// function updatePrices(tickerData: any) {
//     prices[tickerData.s] = parseFloat(tickerData.c);
// }

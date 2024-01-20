import WebSocket from 'ws';
import {symbols} from "../../index";
import {getPair} from "../core/update-symbols";
import {priceDifference} from "../core/price-difference";

const streamNames = ['!ticker@arr'];
const combinedStreamsUrl = `wss://stream.binance.com:9443/stream?streams=${streamNames.join('/')}`;

const connection = new WebSocket(combinedStreamsUrl);


export const wsUpdate = (symbols: any) => {
    connection.onopen = async () => {
        console.log('Connected to Binance combined WebSocket');
    };

    connection.onmessage = async (e) => {
        try {
            const data = JSON.parse(e.data.toString());
            updatePrices(symbols, data.data)

            console.log( priceDifference(symbols, "USDT", "EUR", "BTC"));


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


function updatePrices(target:any, tickerData: any) {
tickerData.forEach((el:any)=>{
    if (target[el.s]){
        target[el.s].bid = el.b;
        target[el.s].ask = el.a;
    }
})
}

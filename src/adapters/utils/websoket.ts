import WebSocket from 'ws';
import {symbols} from "../../index";
import {getPair} from "../core/update-symbols";

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

            // console.log("|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||")
            // console.log("AVAILABLE SYMBOLS")
            // console.log("|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||")
            const base = getPair(symbols);
            const btcusdt = getPair(symbols,"ETH","USDT");
            const btceur = getPair(symbols,"ETH","EUR");
            console.log(base)
            console.log(btcusdt);
            console.log(btceur);

            const fcp=+btcusdt!.info.ask;
            console.log("Цена BTC/USD - " + fcp);

            const cpsc=+btceur!.info.ask * +base!.exchangeRates
            console.log("Конвертируемая цена BTC/USD по паре BTC/EUR - " + cpsc);

            const rc = fcp-cpsc
            console.log("Разница в ценах составит - " + rc);

            console.log("Разница в % составит - " + (rc/fcp*100));


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

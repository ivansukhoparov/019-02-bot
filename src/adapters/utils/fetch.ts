import fetch1 from 'node-fetch';
import {symbolMapper} from "../types/fetch-binance/mapper";

export async function getAllTradableTickers() {
    const url = 'https://api.binance.com/api/v3/exchangeInfo';

    try {
        const response = await fetch1(url);


        const tickers = await response.json();
        const symbols = tickers.symbols.filter((el:any)=>el.status==='TRADING').map(symbolMapper)
        //
        // status: Этот ключ указывает на текущее состояние торговой пары. Если значение status равно "TRADING",
        // это означает, что пара активна и торгуется. "BREAK" означает, что торговля по этой паре в данный момент
        // приостановлена или не проводится.
        //
        return symbols;

    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

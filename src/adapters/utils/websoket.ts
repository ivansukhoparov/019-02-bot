import WebSocket from 'ws';
import {askOrBid} from "../core/utils/utils";
import {ActionTimer} from "./timer";

const streamNames = ['!ticker@arr'];
const combinedStreamsUrl = `wss://stream.binance.com:9443/stream?streams=${streamNames.join('/')}`;

const connection = new WebSocket(combinedStreamsUrl);


export const wsUpdate = (symbols: any, allSequences: any) => {
    connection.onopen = async () => {
        console.log('Connected to Binance combined WebSocket');
    };


    connection.onmessage = async (e) => {
        try {
         //   const timer = new ActionTimer("upd")
         //   timer.start()
            const data = JSON.parse(e.data.toString());
        const updSymbols = updatePrices(symbols, data.data)

          //  console.log("allSequences")
            const updateSeq = updatePricesInSeq(allSequences, updSymbols)
          //  console.log(updateSeq)


            const opp = updateSeq.map(calculateDifferences)
                .filter((el:any)=> el.priceDiff>=0.3 && el.priceDiff<5 && el.priceDiff!==null);
           if (opp.length>0) {
                console.log(opp)
            }
       //     console.log(opp.length)
       //     timer.stop()
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
    const symbols = target
    tickerData.forEach((el: any) => {
        if (symbols[el.s]) {
            symbols[el.s].bid = el.b;
            symbols[el.s].ask = el.a;
    }
})
    return symbols
}

function updatePricesInSeq(target: any, symbols: any) {
    target.forEach((el: any) => {
        el.firstSymbol.price = symbols[el.firstSymbol.symbol][askOrBid(el.firstSymbol.action)]
        el.secondSymbol.price = symbols[el.secondSymbol.symbol][askOrBid(el.secondSymbol.action)]
        el.thirdSymbol.price = symbols[el.thirdSymbol.symbol][askOrBid(el.thirdSymbol.action)]

    })
    return target
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
                    return null
            }
        }
    }
        return null;
}

const oppot= (data:any)=>{
    try{
        const c =  data.firstSymbol.price-(data.secondSymbol.price*data.thirdSymbol.price)
        return  c/data.firstSymbol.price*100
    }catch(e){
        return null;
    }

}


export function calculateDifferences(el: any) {
    //target.map((el: any) => {
        let diff: number | null = buyOrSell(100, el.firstSymbol.action, el.firstSymbol.price);
        diff = buyOrSell(diff, el.secondSymbol.action, el.secondSymbol.price);
        diff = buyOrSell(diff, el.thirdSymbol.action, el.thirdSymbol.price);
        if (diff){
            diff=diff-100
        }
        const opp = oppot(el)
        return {
            ...el,
            priceDiff:diff,
          //opp:opp

        }
  //  })
}

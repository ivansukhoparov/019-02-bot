import {preparingSymbols} from "./services/preparing-symbols";
import {wsUpdate} from "./adapters/websokets/websoket-adapter";
import {getAccountInfo} from "./adapters/http/binance-adapter";
require('dotenv').config();



const startApp = async ()=>{
    const d = await getAccountInfo()
    console.log(d)
  //  const {symbols, allSequences} = await preparingSymbols();
  // // console.log(symbols)
  //   wsUpdate(symbols, allSequences);
}

startApp();

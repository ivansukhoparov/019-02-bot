import {preparingSymbols} from "./services/preparing-symbols";
import {wsUpdate} from "./adapters/websokets/websoket-adapter";



const startApp = async ()=>{
   const {symbols, allSequences} = await preparingSymbols();
  // console.log(symbols)
    wsUpdate(symbols, allSequences);
}

startApp();

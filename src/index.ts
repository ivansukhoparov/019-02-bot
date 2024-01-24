import {preparingSymbols} from "./services/preparing-symbols";
import {wsUpdate} from "./adapters/utils/websoket";



const startApp = async ()=>{
   const {symbols, allSequences} = await preparingSymbols();
  // console.log(symbols)
    wsUpdate(symbols, allSequences);
}

startApp();

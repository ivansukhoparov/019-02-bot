import {preparingSymbols} from "./services/preparing-symbols";
import {wsUpdate} from "./adapters/websokets/websoket-adapter";
import {getAccountInfo} from "./adapters/http/http-account";



const startApp = async ()=>{
    await getAccountInfo()
  //  const {symbols, allSequences} = await preparingSymbols();
  // // console.log(symbols)
  //   wsUpdate(symbols, allSequences);
}

startApp();

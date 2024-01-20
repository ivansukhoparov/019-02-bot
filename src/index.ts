import {getAllTradableTickers} from "./adapters/utils/fetch";
import {preparingSymbols} from "./adapters/core/preparing-symbols";
import {wsUpdate} from "./adapters/utils/websoket";
export let symbols:any ={};


const startApp = async ()=>{
    symbols = await preparingSymbols();
   wsUpdate(symbols);
}

startApp();

import {getAllTradableTickersOnBinance} from "./adapters/utils/fetch";
import {preparingSymbols} from "./adapters/core/preparing-symbols";
import {wsUpdate} from "./adapters/utils/websoket";
import {updateSymbols} from "./adapters/core/update-symbols";


const startApp = async ()=>{
    const symbols = await preparingSymbols();
    wsUpdate(symbols)
}

startApp();

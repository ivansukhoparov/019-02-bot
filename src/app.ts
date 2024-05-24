import {wsUpdate} from "./adapters/websoket/binance.websoket";


export const app = async () => {
    const binanceCore = await init();
    console.log("app initiated")
    await new Promise(resolve => setTimeout(resolve, 1000));
    wsUpdate(binanceCore);
};

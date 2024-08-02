import {MarketService} from "../../src/application/market-service";
import {symbolsDataSet_test} from "../tests-data-sets/symbols-data-set";
import {orderAction, orderQuantity} from "../../src/common/common";
import {BinanceHttpAdapterOLD} from "../../src/adapters/http/binanceHttpAdapterOLD";


describe("binance-services methods tests", () => {

    it("_getSymbol method must return correct data", () => {
        const binanceService   = new MarketService(symbolsDataSet_test);
        const {symbol,action, quantityType}:any =  binanceService._getSymbol('XAI','USDT');
        expect(symbol).toBe("XAI/USDT");
        expect(action).toBe(orderAction.sell);
        expect(quantityType).toBe(orderQuantity.base);
    })

    it("_getSymbol method must return correct data", () => {
        const binanceService   = new MarketService(symbolsDataSet_test);
        const {symbol,action, quantityType}:any =  binanceService._getSymbol('USDT','XAI');
        expect(symbol).toBe("XAI/USDT");
        expect(action).toBe(orderAction.buy);
        expect(quantityType).toBe(orderQuantity.quote);
    })

    it("_getSymbol method must return null if symbol not exist", () => {
        const binanceService   = new MarketService(symbolsDataSet_test);
        expect(()=>{
            binanceService._getSymbol('USDT','MNAI');
        }).toThrow()

    })



     // it("function must return correct sequence", () => {
     //
     //
     // })
    //
    //
    // it("function must return null if symbol not in list", () => {
    //
    //
    // })
    // it("function must return null if symbol not in list", () => {
    //
    //
    // })
    //
    // it("function must return null if symbol not in list", () => {
    //
    //
    //
    // })
    //


})

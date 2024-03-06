import {BinanceService} from "../../src/application/binance-service";
import {symbolsDataSet_test} from "../tests-data-sets/symbols-data-set";
import {orderAction, orderQuantity} from "../../src/common/common";
import {BinanceHttpAdapter} from "../../src/adapters/http/binance.http.adapter";


describe("binance-services methods tests", () => {

    it("_getSymbol method must return correct data", () => {
        const binanceService   = new BinanceService(symbolsDataSet_test);
        const {symbol,action, quantityType}:any =  binanceService._getSymbol('XAI','USDT');
        expect(symbol).toBe("XAI/USDT");
        expect(action).toBe(orderAction.sell);
        expect(quantityType).toBe(orderQuantity.base);
    })

    it("_getSymbol method must return correct data", () => {
        const binanceService   = new BinanceService(symbolsDataSet_test);
        const {symbol,action, quantityType}:any =  binanceService._getSymbol('USDT','XAI');
        expect(symbol).toBe("XAI/USDT");
        expect(action).toBe(orderAction.buy);
        expect(quantityType).toBe(orderQuantity.quote);
    })

    it("_getSymbol method must return null if symbol not exist", () => {
        const binanceService   = new BinanceService(symbolsDataSet_test);
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

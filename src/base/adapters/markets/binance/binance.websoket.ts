import WebSocket from "ws";
import {APP_MODES} from "../../../services/utils/common";
import {MarketUpdateDataType} from "../../../../types/web-soket-binance/output";
import {marketDataMapper} from "../../../../types/web-soket-binance/mapper";
import {TradeCore} from "../../../../core/trade.core";

import {appSettings} from "../../../../settings/settings";


let combinedStreamsUrl: string


if (appSettings.appMode === APP_MODES.test) {
    combinedStreamsUrl = "wss://testnet.binance.vision/ws/!ticker@arr"
} else {
    const streamNames = ["!ticker@arr"];
    combinedStreamsUrl = `wss://stream.binance.com:9443/stream?streams=${streamNames.join("/")}`;
}

const connection = new WebSocket(combinedStreamsUrl);

export const wsUpdate = (tradeCore:TradeCore) => {

    connection.onopen = async () => {
        console.log("Connected to Binance combined WebSocket");
    };

    connection.onmessage = async (e) => {
        try {

            let marketData = JSON.parse(e.data.toString());
            if (appSettings.appMode !== APP_MODES.test) marketData = marketData.data
            const mappedMarketData: MarketUpdateDataType[] = marketData.map(marketDataMapper)
            await tradeCore.onUpdate(mappedMarketData)
        } catch (error) {
            console.error("trade error:", error);
          //  connection.close()
        }
    };


    connection.onerror = (error) => {
        console.error("WebSocket error:", error.message);
    };

    connection.onclose = () => {
        console.log("Disconnected from Binance WebSocket");
    };
};



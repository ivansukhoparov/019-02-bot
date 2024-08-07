import {APP_MODES} from "../base/services/utils/common";

require("dotenv").config();

export class AppSettings {
    public appMode:string = "TEST"
    public marketName = "Binance"

    public commissionAmount = 0.1
    public startAmount = 90
    public startCurrency: string = "USDT"
    public minStartAmount = 10
    public thresholdValue: number =0
    public stopThreshold: number =0

    public tradeMode: "SPOT" | "MARGIN" = "SPOT"
    public excludeShortFluctuations = true

    public marketData = {
        baseUrl: "https://testnet.binance.vision",
        websocket: "wss://testnet.binance.vision/ws/",
        apiKey: "vj32ugTRz4opP9C086t2iHiW6Hinn5nkx3BwMk7vdqGTVvhXphKcjBnJwyUvwJMM",
        secretKey: "H9f2TLAyvYFwaFPF08YqJFmXuRkjPbn61QXnENJc1qVm6ozDgregLC0irCTtBMad"
    }

    constructor() {
        const appMode = process.env.APP_MODE
        if (appMode === APP_MODES.test || appMode === APP_MODES.prod){
            this.appMode=appMode
        }else{
            throw new Error("undefined app mode")
        }
        this.marketName = process.env.MARKET!
        this.startCurrency = process.env.START_CURRENCY!
        this.thresholdValue = +process.env[this.appMode + "_THRESHOLD_VALUE"]!
        this.stopThreshold = +process.env[this.appMode + "_STOP_THRESHOLD"]!

        this.marketData.baseUrl = process.env[this.appMode + "_BASE_URL"]!
        this.marketData.websocket = process.env[this.appMode + "_WEBSOCKET"]!
        this.marketData.apiKey = process.env[this.appMode + "_API_KEY"]!
        this.marketData.secretKey = process.env[this.appMode + "_SECRET_KEY"]!

        this.marketData.secretKey = process.env[this.appMode + "_SECRET_KEY"]!
        this.marketData.secretKey = process.env[this.appMode + "_SECRET_KEY"]!
        this.marketData.secretKey = process.env[this.appMode + "_SECRET_KEY"]!
        this.marketData.secretKey = process.env[this.appMode + "_SECRET_KEY"]!

        console.log(this.appMode)
    }
}

export const appSettings = new AppSettings()
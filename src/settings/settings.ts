import {APP_MODES} from "../base/services/utils/common";

require("dotenv").config();

export class AppSettings {
    public appMode:string = "TEST"
    public marketName:string = "BINANCE"

    public commissionAmount:number = 0.1
    public startAmount:number = 90
    public startCurrency: string = "USDT"
    public minStartAmount:number = 10
    public thresholdValue: number =0
    public stopThreshold: number =0

    public tradeMode: "SPOT" | "MARGIN" = "SPOT"
    public excludeShortFluctuations = true

    public marketData = {
        baseUrl: "https://api.huobi.pro",
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

        const prefix = this.marketName+"_"+this.appMode

        this.startCurrency = process.env.START_CURRENCY!
        this.thresholdValue = +process.env[this.appMode + "_THRESHOLD_VALUE"]!
        this.stopThreshold = +process.env[this.appMode + "_STOP_THRESHOLD"]!

        this.marketData.baseUrl = process.env[prefix + "_BASE_URL"]!
        this.marketData.websocket = process.env[prefix + "_WEBSOCKET"]!
        this.marketData.apiKey = process.env[prefix + "_API_KEY"]!
        this.marketData.secretKey = process.env[prefix + "_SECRET_KEY"]!

        console.log(this.appMode)
    }
}

export const appSettings = new AppSettings()
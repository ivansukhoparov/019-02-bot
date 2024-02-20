import {OrderResponseType} from "../fetch-binance/input";

export type SessionLog = {
    id: string
    date: string
    startedAd: number
    finishedAt: number
    startUsdtBalance: number
}

export type TradeSequenceLog = {
    id: string
    sessionId: string
    startedAd: number
    finishedAt: number
    startUsdtBalance: number
    finishedUsdtBalance: number
    sequence: {}
    recheckResult:number
    executeLogs: ExecuteInstructionLog[]
}

export type ExecuteInstructionLog = {
    startedAd: number
    finishedAt: number
    instructionNumber: number
    currentCurrency: string
    targetCurrency: string
    tradeAmount: number
    sentData?:any
    executeResult: string
    executeLog: OrderResponseType
}

import fetch from "node-fetch";

export interface IHttpAdapter {
     request(url: string, init?: any):Promise<any>
}
import fetch from "node-fetch";

export interface HttpAdapterInterface {
     request(url: string, init?: any):Promise<any>
}
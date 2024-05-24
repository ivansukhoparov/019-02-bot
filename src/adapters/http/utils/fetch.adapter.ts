import fetch from "node-fetch";
import {ApiResponseType} from "../../../types/fetch-binance/input";
import {ActionTimer} from "../../../common/utils/timer";
import {HttpAdapterInterface} from "../interfaces/http.adapter.interface";

export class FetchAdapter implements HttpAdapterInterface{

	 async request(url: string, init?: any):Promise<any> {
		try {
			const response = await fetch(url, init);
			return await response.json();
		} catch (error) {
			console.log(error);
			throw new Error();
		}

	}
}


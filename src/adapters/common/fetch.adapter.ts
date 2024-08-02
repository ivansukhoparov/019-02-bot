import fetch from "node-fetch";
import {ApiResponseType} from "../../types/fetch-binance/input";
import {ActionTimer} from "../../common/utils/timer";
import {HttpAdapterInterface} from "../../base/interfaces/http.adapter.interface";
import {injectable} from "inversify";

@injectable()
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


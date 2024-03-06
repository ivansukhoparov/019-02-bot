import fetch from "node-fetch";
import {ApiResponseType} from "../../../types/fetch-binance/input";
import {ActionTimer} from "../../../common/utils/timer";

export class FetchAdapter {
	static async request(url: string, init?: any):Promise<ApiResponseType> {

		try {
			const timer =  new ActionTimer("FetchAdapter/request")
			timer.start()
			const response = await fetch(url, init);
			const responseJson: any = await response.json();
			const result =  this._responseMapper(responseJson);
			timer.stop()
			return result

		} catch (error) {
			console.log(error);
			throw new Error();
		}
	}

	static _responseMapper(response: any):ApiResponseType {
		const responseKeys = Object.keys(response);
		if (responseKeys.length === 2 && responseKeys[0] === "code" && responseKeys[1] === "msg") {
			return {
				type: "error",
				content: response
			};
		} else {
			return {
				type: "success",
				content: response
			};
		}
	}
}


import fetch from "node-fetch";
import {FetchResponseType} from "../../../types/fetch-binance/input";

export class FetchAdapter {
	static async request(url: string, init?: any):Promise<FetchResponseType> {

		try {
			const response = await fetch(url, init);
			const responseJson: any = await response.json();
			return this._responseMapper(responseJson);
		} catch (error) {
			console.log(error);
			throw new Error();
		}
	}

	static _responseMapper(response: any):FetchResponseType {
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


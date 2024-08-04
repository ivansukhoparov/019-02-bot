import fetch from "node-fetch";
import {IHttpAdapter} from "../../interfaces/http.adapter.interface";
import {injectable} from "inversify";

@injectable()
export class FetchAdapter implements IHttpAdapter{

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


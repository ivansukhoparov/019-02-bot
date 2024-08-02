import fetch from "node-fetch";
import {HttpAdapterInterface} from "../../interfaces/http.adapter.interface";
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


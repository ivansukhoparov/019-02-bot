import fetch from "node-fetch";

export class fetchAdapter{
    static async request (url: string, init: any) {

        try {
            const response = await fetch(url, init);
            return await response.json();

        } catch (error) {
            return {Error: error}
        }
    }

}

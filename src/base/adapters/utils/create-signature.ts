import crypto from "crypto";

export function createSignature(queryString: string, secret:string, algorithm:string = "sha256") {
	return crypto.createHmac(algorithm, secret).update(queryString).digest("hex");
}

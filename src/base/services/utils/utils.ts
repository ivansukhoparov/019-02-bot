

export const askOrBid = (action: "buy" | "sell") => {
	switch (action) {
	case "buy":
		return "ask";
	case "sell":
		return "bid";
	}
};
export const getReverseAction = (action: "buy" | "sell") => {
	switch (action) {
	case "buy":
		return "sell";
	case "sell":
		return "buy";
	}
};


export const generateCombinations = (arr: any[], base:any) => {

	const combinations: any[] = [];
	const ticker_1 = base

	for (let i = 0; i < arr.length; i++) {
		const ticker_0 = arr[i]

		for (let j = 0; j < arr.length; j++) {
			const ticker_2 = arr[j]

			if (ticker_0!== ticker_1 && ticker_2!==ticker_1 && ticker_0!==ticker_2){
				combinations.push([ticker_0,ticker_1,ticker_2])
			}

		}
	}

	return combinations;
}

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

export function generateCombinations(arr: any[], comboLength: number) {
	function combinator(currentCombo: any[], startIndex: number) {
		if (currentCombo.length === comboLength) {
			combinations.push([...currentCombo]);
			return;
		}

		for (let i = startIndex; i < arr.length; i++) {
			currentCombo.push(arr[i]);
			combinator(currentCombo, i + 1);
			currentCombo.pop();
		}
	}

	const combinations: any[] = [];
	combinator([], 0);
	return combinations;
}


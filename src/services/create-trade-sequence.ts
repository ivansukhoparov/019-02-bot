import {getSymbol} from "./utils/get-simbol";
import {TradeInstructionType} from "../types/sequences";


// example of argument [ 'USDT', 'EUR', 'BTC' ]
export const createTradeSequence = (coins: [string, string, string], symbols: any) => {
	// common currency is coin[0] (BTC)
	// base currency is coins[1] (USDT)
	// second currency is coin[2] (EUR)

	// FIRST
	// So at first we buy common currency for first currency (coin[0] (BTC) for coins[1] (USDT))
	// therefore first symbol will be coin[0]+coins[1] (BTCUSDT) with action-buy and price-ask
	// but if we don't have coin[0]+coins[1] (BTCUSDT) symbol in collection we reverse symbol and
	// try coins[1]+coin[0] (USDTBTC) with action-sell and price-bid

	const _1_Instruction: TradeInstructionType | null = getSymbol(coins[0], coins[1], coins[1],"buy", symbols);

	// SECOND
	// So at second we sell common currency for second currency (coin[0] (BTC) for coins[2] (EUR))
	// therefore second symbol will be coin[0]+coins[2] (BTCEUR) with action-sell and price-bid
	// but if we don't have coin[0]+coins[2] (BTCEUR) symbol in collection we reverse symbol and
	// try coins[2]+coin[0] (EURBTC) with action-buy and price-ask

	const _2_Instruction: TradeInstructionType | null = getSymbol(coins[0], coins[2],coins[0],"sell", symbols);

	// THIRD
	// So at third we exchange second currency for first currency (coin[2] (EUR) for coins[1] (USDT))
	// therefore third symbol will be coin[2]+coins[1] (EURUSDT) with action-sell and price-bid
	// but if we don't have coin[2]+coins[1] (EURUSDT) symbol in collection we reverse symbol and
	// try coins[1]+coin[2] (USDTEUR) with action-buy and price-ask

	const _3_Instruction: TradeInstructionType | null = getSymbol(coins[2], coins[1], coins[2],"sell", symbols);

	if (_1_Instruction && _2_Instruction && _3_Instruction) {
		return {_1_Instruction, _2_Instruction, _3_Instruction};
	} else {
		return null;
	}
};

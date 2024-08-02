export const getUniqueCoins = (tradableTickers: any[]) => {
    return tradableTickers.reduce((acc: any, item: any) => {
        if (!acc.includes(item.baseAsset)) {
            return [...acc, item.baseAsset];
        } else if (!acc.includes(item.quoteAsset)) {
            return [...acc, item.quoteAsset];
        }
        return acc;
    }, []);
};
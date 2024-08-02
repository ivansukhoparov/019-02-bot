export function roundDownNumber(number1: number | string, number2: number | string) {
    const decimalPlaces = (number2.toString().split(".")[1] || []).length;
    const multiplier = Math.pow(10, decimalPlaces);
    return Math.floor(+number1 * multiplier) / multiplier;
}
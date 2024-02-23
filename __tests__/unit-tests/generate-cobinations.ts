import {generateCombinations} from "../../src/services/utils/utils";
import * as $C from 'js-combinatorics';


const testArr3 = [1, 2, 3]
const testArr4 = [1, 2, 3, 4]
const result4 = [
    [1, 2, 3],
    [1, 2, 4],
    [1, 3, 2],
    [1, 3, 4],
    [1, 4, 2],
    [1, 4, 3],
    [2, 1, 3],
    [2, 1, 4],
    [2, 3, 1],
    [2, 3, 4],
    [2, 4, 1],
    [2, 4, 3],
    [3, 1, 2],
    [3, 1, 4],
    [3, 2, 1],
    [3, 2, 4],
    [3, 4, 1],
    [3, 4, 2],
    [4, 1, 2],
    [4, 1, 3],
    [4, 2, 1],
    [4, 2, 3],
    [4, 3, 1],
    [4, 3, 2]];
const result3 = [
    [1, 2, 3],
    [1, 3, 2],
    [2, 1, 3],
    [2, 3, 1],
    [3, 1, 2],
    [3, 2, 1],
];
let comb = new $C.Combination("abcd", 3);


describe("create combination function", () => {

    it("+", () => {

        const combination = generateCombinations(testArr4, 1);
 //console.log(result.filter((el:any) => el[1]===1))
        console.log(combination)
expect(combination).toEqual(result4.filter((el:any) => el[1]===1))
     //   expect(combination).toEqual(result)
    })

    it("+", () => {

        const combination = generateCombinations(testArr4, 2);
        //console.log(result.filter((el:any) => el[1]===1))
        console.log(combination)
        expect(combination).toEqual(result4.filter((el:any) => el[1]===2))
        //   expect(combination).toEqual(result)
    })

    it("+", () => {

        const combination = generateCombinations(testArr3, 1);
        //console.log(result.filter((el:any) => el[1]===1))
        console.log(combination)
        expect(combination).toEqual(result3.filter((el:any) => el[1]===1))
        //   expect(combination).toEqual(result)
    })
})

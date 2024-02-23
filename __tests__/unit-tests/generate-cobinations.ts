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

const arrr= [-0.09502480435250504,
    -0.09240894455305693,
    0.03913858647547386,
    0.24639767443954952,
    0.7769730097433865,
    -0.43315700080776764,
    0.05147887485813385,
    0.04547942831476348,
    -1.5818942665772653,
    0.07189451360420662,
    -0.7977008040047622,
    0.01783137781526989,
    0.01783137781526989,
    -1.3098513360199888,
    0.22430842592657996,
    -0.5883100239317685,
    0.03278607096231667,
    0.10283922458643247,
    0.20969660455332928,
    0.20969660455332928,
    0.20969660455332928,
    0.05466512854229677,
    0.07361669317609199,
    0.07361669317609199,
    0.07361669317609199,
    0.07361669317609199,
    0.0663353070247581,
    0.045840496354003335,
    0.045840496354003335,
    0.028610451136614756,
    0.04753828368916402,
    0.045908405461744906,
    0.03829381811797816,
    0.046833845110342054,
    -0.02586489586337848,
    0.1346424737049574,
    0.2410400903439438,
    0.14030012331554076,
    0.21458823708977093,
    0.22989307021660466,
    0.23762201094564261,
    0.19780393676074937,
    -0.8282629166062918,
    0.1801268544992638,
    0.1686992457645431,
    0.1686992457645431,]


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
    it("+", () => {

        const foo = (a:any)=>{
            let sum = 0;
            for (let i= 0; i<a.length; i++){
                sum += a[i]
            }
            return sum
        }

        console.log(foo(arrr))
        expect(1).toEqual(1)

    })


})

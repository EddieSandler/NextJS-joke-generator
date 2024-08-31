import { pipeline } from '@xenova/transformers';



let classifier = await pipeline('sentiment-analysis');

let result = await classifier('I love transformers!');

console.log(result);
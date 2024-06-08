import { generateReportsChrome, generateReportsEdge } from "./utils.js";

const startTimeChrome = performance.now();

await generateReportsChrome();

const endTimeChrome = performance.now();

console.log(
  "Total time for CHROME analyses: " +
    ((endTimeChrome - startTimeChrome) / 1000).toFixed(3) +
    " seconds"
);

const startTimeEdge = performance.now();

await generateReportsEdge();

const endTimeEdge = performance.now();

console.log(
  "Total time for EDGE analyses: " +
    ((endTimeEdge - startTimeEdge) / 1000).toFixed(3) +
    " seconds"
);

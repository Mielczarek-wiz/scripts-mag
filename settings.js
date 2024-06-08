export const options = [
  {
    output: "json", // could be html, json, csv
    onlyCategories: ["performance"],
    emulatedFormFactor: "desktop",
    onlyAudits: [
      "first-contentful-paint",
      "largest-contentful-paint",
      "first-meaningful-paint",
      "speed-index",
      "total-blocking-time",
      "server-response-time",
    ],
  },
  {
    output: "json", // could be html, json, csv
    onlyCategories: ["performance"],
    emulatedFormFactor: "mobile",
    onlyAudits: [
      "first-contentful-paint",
      "largest-contentful-paint",
      "first-meaningful-paint",
      "speed-index",
      "total-blocking-time",
      "server-response-time",
    ],
  },
];

export const flags = ["--headless"];


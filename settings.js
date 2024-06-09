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
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
    },
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
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
    },
  },
];

export const flags = ["--headless"];
export const pages = [
  { page: "/home", displayName: "home" },
  { page: "/Category0", displayName: "category" },
  { page: "/Category0/0", displayName: "recipe" },
];

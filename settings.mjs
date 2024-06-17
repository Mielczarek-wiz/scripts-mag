export const options = [
  {
    output: "json", // could be html, json, csv
    onlyCategories: ["performance"],
    emulatedFormFactor: "desktop",
    onlyAudits: [
      "first-contentful-paint",
      "largest-contentful-paint",
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
      "speed-index",
      "total-blocking-time",
      "server-response-time",
    ],
  },
];

export const flags = ["--headless"];
export const pages = [
  { page: "/home", displayName: "home" },
  { page: "/Category0", displayName: "category" },
  { page: "/Category0/0", displayName: "recipe" },
];

export const browsers = ["chrome", "edge"];

import lighthouse from "lighthouse";
import fs from "fs";
import { options, pages } from "./settings.mjs";
import { getLauncher } from "./launcher.mjs";
import "dotenv/config";

export const runTest = async (browser = "chrome") => {
  console.log(
    "****** Starting Lighthouse " + browser.toUpperCase() + " analysis ******"
  );
  const startTime = performance.now();

  for (const lighthouseOption of options) {
    console.log("****** " + lighthouseOption.emulatedFormFactor + " ******");
    for (const page of pages) {
      const reports = [];
      console.log("****** PAGE: " + page.displayName + " ******");
      for (let i = 0; i < process.env.NUM_OF_REPEATS; i++) {
        console.log("*** Iteration " + i + " ***");
        const launcher = await getLauncher(browser);

        try {
          const runnerResult = await lighthouse(
            process.env.FRONTEND_URL + page.page,
            {
              ...lighthouseOption,
              port: launcher.port,
            }
          );
          const numericValues = retriveValues(
            runnerResult.lhr.audits,
            lighthouseOption
          );
          reports.push(numericValues);
        } catch (error) {
          console.error("lighthouse", error);
        } finally {
          await wait(500);
          launcher.kill();
        }
      }
      console.log("****** Making CSV and JSON reports ******");
      makeCSV(
        reports,
        lighthouseOption.onlyAudits,
        browser,
        page.displayName,
        lighthouseOption.emulatedFormFactor
      );
      makeReport(
        JSON.stringify(calculateResults(reports)),
        browser,
        page.displayName,
        lighthouseOption.emulatedFormFactor
      );
    }
  }

  const endTime = performance.now();
  console.log(
    "Ending.. Total time for " +
      browser.toUpperCase() +
      " analyses: " +
      ((endTime - startTime) / 1000).toFixed(3) +
      " seconds"
  );
};

const makeCSV = (reports, audits, browser, page, device) => {
  const dir =
    "reports/" +
    process.env.TEST_NAME +
    "/" +
    browser +
    "/" +
    page +
    "/" +
    device;
  const header = audits.join(",") + "\n";
  const rows = reports.map((report) => {
    return audits.map((audit) => report[audit]).join(",");
  });
  const csv = header + rows.join("\n");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dir + "/" + process.env.INSTANCE_SIZE + ".csv", csv);
};

const retriveValues = (audits, lighthouseOption) => {
  const entries = lighthouseOption.onlyAudits.map((audit) => {
    return [audit, parseFloat(audits[audit].numericValue.toFixed(3))];
  });
  return Object.fromEntries(entries);
};

const calculateResults = (reports) => {
  const reducedReport = reports.reduce((acc, report) => {
    for (const [key, value] of Object.entries(report)) {
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(value);
    }
    return acc;
  }, {});

  return Object.fromEntries(
    Object.entries(reducedReport).map(([key, values]) => {
      return [
        key,
        {
          mean: trimMean(values),
          median: findMedian(values),
        },
      ];
    })
  );
};

const makeReport = (report, browser, page, device) => {
  const dir =
    "reports/" +
    process.env.TEST_NAME +
    "/" +
    browser +
    "/" +
    page +
    "/" +
    device;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dir + "/" + process.env.INSTANCE_SIZE + ".json", report);
};

const wait = async (val) => {
  return new Promise((resolve) => setTimeout(resolve, val));
};

const trimMean = (values) => {
  const sortedValues = values.sort((a, b) => a - b);
  const trimmedValues = sortedValues.slice(1, sortedValues.length - 1);
  return parseFloat(
    (
      trimmedValues.reduce((acc, value) => acc + value, 0) /
      trimmedValues.length
    ).toFixed(3)
  );
};
const findMedian = (values) => {
  const sortedValues = values.sort((a, b) => a - b);
  const trimmedValues = sortedValues.slice(1, sortedValues.length - 1);
  const middleIndex = Math.floor(trimmedValues.length / 2);

  if (trimmedValues.length % 2 === 0) {
    return (trimmedValues[middleIndex - 1] + trimmedValues[middleIndex]) / 2;
  } else {
    return trimmedValues[middleIndex];
  }
};

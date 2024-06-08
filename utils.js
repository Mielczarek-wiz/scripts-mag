import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import * as edgeLauncher from "chromium-edge-launcher";
import fs from "fs";
import { flags, options } from "./settings.js";
import "dotenv/config";

export const generateReportsEdge = async () => {
  console.log("****** Starting Lighthouse EDGE analysis ******");
  for (const lighthouseOption of options) {
    const reports = [];

    console.log("****** " + lighthouseOption.emulatedFormFactor + " ******");

    for (let i = 0; i < process.env.NUM_OF_REPEATS; i++) {
      console.log("*** Iteration " + i + " ***");
      const edge = await edgeLauncher.launch({
        edgeFlags: flags,
      });

      try {
        const runnerResult = await lighthouse(process.env.FRONTEND_URL, {
          ...lighthouseOption,
          port: edge.port,
        });
        const numericValues = retriveValues(
          runnerResult.lhr.audits,
          lighthouseOption
        );

        reports.push(numericValues);
      } catch (error) {
        console.error("lighthouse", error);
      } finally {
        await wait(500);
        edge.kill();
      }
    }

    calculateResults(reports);
    makeReport(
      JSON.stringify(calculateResults(reports)),
      "edge",
      lighthouseOption.emulatedFormFactor
    );
  }
  console.log("****** Ending Lighthouse analysis ******");
};

export const generateReportsChrome = async () => {
  console.log("****** Starting Lighthouse CHROME analysis ******");
  for (const lighthouseOption of options) {
    const reports = [];

    console.log("****** " + lighthouseOption.emulatedFormFactor + " ******");

    for (let i = 0; i < process.env.NUM_OF_REPEATS; i++) {
      console.log("*** Iteration " + i + " ***");
      const chrome = await chromeLauncher.launch({
        chromeFlags: flags,
      });

      try {
        const runnerResult = await lighthouse(process.env.FRONTEND_URL, {
          ...lighthouseOption,
          port: chrome.port,
        });
        const numericValues = retriveValues(
          runnerResult.lhr.audits,
          lighthouseOption
        );

        reports.push(numericValues);
      } catch (error) {
        console.error("lighthouse", error);
      } finally {
        await wait(500);
        chrome.kill();
      }
    }

    calculateResults(reports);
    makeReport(
      JSON.stringify(calculateResults(reports)),
      "chrome",
      lighthouseOption.emulatedFormFactor
    );
  }
  console.log("****** Ending Lighthouse analysis ******");
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

  const meanReport = Object.fromEntries(
    Object.entries(reducedReport).map(([key, values]) => {
      return [key + " AVG", trimMean(values)];
    })
  );

  return meanReport;
};

const makeReport = (report, browser, device) => {
  const dir =
    "reports/" +
    process.env.TEST_NAME +
    "/" +
    browser +
    "/" +
    process.env.INSTANCE_SIZE;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dir + "/" + device + ".json", report);
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

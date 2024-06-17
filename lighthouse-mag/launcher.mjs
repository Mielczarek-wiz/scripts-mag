import * as chromeLauncher from "chrome-launcher";
import * as edgeLauncher from "chromium-edge-launcher";
import { flags } from "./settings.mjs";

export const getLauncher = async (browser) => {
  switch (browser.toLowerCase()) {
    case "chrome":
      return await chromeLauncher.launch({
        chromeFlags: flags,
      });
    case "edge":
      return await edgeLauncher.launch({
        edgeFlags: flags,
      });
    default:
      return await chromeLauncher.launch({
        chromeFlags: flags,
      });
  }
};

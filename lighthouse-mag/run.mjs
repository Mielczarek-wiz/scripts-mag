import { browsers } from "./settings.mjs";
import { runTest } from "./utils.mjs";

for (const browser of browsers) {
  await runTest(browser);
}

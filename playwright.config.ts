import type {
  Config,
  PlaywrightTestOptions,
  PlaywrightWorkerOptions,
} from "@playwright/test";
import * as path from "path";

process.env.PWPAGE_IMPL = "electron";

const config: Config<PlaywrightWorkerOptions & PlaywrightTestOptions> = {
  testIgnore: "*.test.ts",
  testMatch: "*.spec.ts",
  snapshotDir: "./snapshots",
  outputDir: "./test-results/",
  timeout: 30000,
  globalTimeout: 5400000,
  workers: process.env.CI ? 1 : undefined,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 0,
  reporter: "html",
};

export default config;

import {
  ElectronApplication,
  _electron as electron,
  expect,
} from "@playwright/test";
import { test } from "@playwright/test";
import {
  clickMenuItemById,
  findLatestBuild,
  ipcMainCallFirstListener,
  ipcRendererCallFirstListener,
  parseElectronApp,
  ipcMainInvokeHandler,
  ipcRendererInvoke,
} from "electron-playwright-helpers";

test.describe("Testing example", () => {
  let electronApp: ElectronApplication;

  test.beforeAll(async () => {
    // find the latest build in the out directory
    const latestBuild = findLatestBuild();
    // parse the directory and find paths and other info
    const appInfo = parseElectronApp(latestBuild);
    // set the CI environment variable to true
    process.env.CI = "e2e";
    electronApp = await electron.launch({
      args: [appInfo.main],
      executablePath: appInfo.executable,
      recordVideo: {
        dir: "videos/",
      },
    });
    electronApp.on("window", async (page) => {
      const filename = page.url()?.split("/").pop();
      console.log(`Window opened: ${filename}`);
      // capture errors
      page.on("pageerror", (error) => {
        console.error(error);
      });
      // capture console messages
      page.on("console", (msg) => {
        console.log(msg.text());
      });
    });
  });

  test.afterAll(async () => {
    await new Promise((res) => setTimeout(res, 1000));
    await electronApp.close();
  });

  test("a", async () => {
    // Get the first window that the app opens, wait if necessary.
    const window = await electronApp.firstWindow();
    // Print the title.
    console.log(await window.title());
    // Capture a screenshot.
    await window.screenshot({ path: "intro.png" });
    // Direct Electron console to Node terminal.
    window.on("console", console.log);
    // Click button.
    await window.click("text=count is 0");
    await expect(window.locator("text=count is 1")).toBeVisible();
    await window.close();
  });
});

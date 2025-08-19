import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";

export async function launchBrowser() {
  const isServerless = !!process.env['KOYEB'];

  if (isServerless) {
    console.log("Koyeb detected - using @sparticuz/chromium");

    return await puppeteer.launch({
      args: chromium.args,
      defaultViewport: {
        width: 1920,
        height: 1080
      },
      executablePath: await chromium.executablePath(), // ✅ proper binary path
      headless: true, // ✅ ensures compatibility
    });
  }

  // Local dev → normal puppeteer
  return await puppeteer.launch({ headless: true });
}

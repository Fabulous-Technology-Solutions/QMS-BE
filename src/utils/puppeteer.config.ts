import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function launchBrowser() {
  const isServerless = !!process.env['KOYEB'];

  if (isServerless) {
    console.log("Koyeb detected - using @sparticuz/chromium with puppeteer-core");

    return await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: {
        width: 1920,
        height: 1080
      },
      executablePath: await chromium.executablePath(), // ✅ proper binary path
      headless: true, // ✅ ensures compatibility
    });
  }

  // Local dev → normal puppeteer (includes bundled Chromium)
  console.log("Local environment - using regular puppeteer with bundled Chromium");
  return await puppeteer.launch({ 
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });
}

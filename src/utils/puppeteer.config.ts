import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";

export async function launchBrowser() {
  const isServerless = !!process.env['KOYEB'];

  if (isServerless) {
    console.log("Koyeb detected - using @sparticuz/chromium");

    return await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(), // ✅ the actual binary
      headless: true,
    });
  }

  // Local dev → normal puppeteer
  return await puppeteer.launch({ headless: true });
}

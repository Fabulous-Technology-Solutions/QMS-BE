import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function launchBrowser() {
  // Detect serverless automatically (Vercel, Netlify, AWS, Koyeb, etc.)
  const isServerless = !!(
    process.env["KOYEB"] ||
    process.env["VERCEL"] ||
    process.env["AWS_LAMBDA_FUNCTION_NAME"] ||
    process.env["NETLIFY"]
  );

  if (isServerless) {
    console.log("Serverless detected - using @sparticuz/chromium with puppeteer-core");

    return await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: { width: 1920, height: 1080 },
      executablePath: await chromium.executablePath(), // ✅ serverless chromium
      headless: true, // ensures compatibility
    });
  }

  // Local dev → normal puppeteer with bundled Chromium
  console.log("Local environment - using regular puppeteer with bundled Chromium");
  return await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });
}

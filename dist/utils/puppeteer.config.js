"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchBrowser = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const chromium_1 = __importDefault(require("@sparticuz/chromium"));
async function launchBrowser() {
    // Detect serverless automatically (Vercel, Netlify, AWS, Koyeb, etc.)
    const isServerless = !!(process.env["KOYEB"] ||
        process.env["VERCEL"] ||
        process.env["AWS_LAMBDA_FUNCTION_NAME"] ||
        process.env["NETLIFY"]);
    if (isServerless) {
        console.log("Serverless detected - using @sparticuz/chromium with puppeteer-core");
        return await puppeteer_core_1.default.launch({
            args: chromium_1.default.args,
            defaultViewport: { width: 1920, height: 1080 },
            executablePath: await chromium_1.default.executablePath(),
            headless: true, // ensures compatibility
        });
    }
    // Local dev → normal puppeteer with bundled Chromium
    console.log("Local environment - using regular puppeteer with bundled Chromium");
    return await puppeteer_1.default.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
        ],
    });
}
exports.launchBrowser = launchBrowser;

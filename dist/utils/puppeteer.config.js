"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchBrowser = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const chromium_1 = __importDefault(require("@sparticuz/chromium"));
async function launchBrowser() {
    const isServerless = !!process.env['KOYEB'];
    if (isServerless) {
        console.log("Koyeb detected - using @sparticuz/chromium");
        return await puppeteer_1.default.launch({
            args: chromium_1.default.args,
            defaultViewport: {
                width: 1920,
                height: 1080
            },
            executablePath: await chromium_1.default.executablePath(),
            headless: true, // ✅ ensures compatibility
        });
    }
    // Local dev → normal puppeteer
    return await puppeteer_1.default.launch({ headless: true });
}
exports.launchBrowser = launchBrowser;

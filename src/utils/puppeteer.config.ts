import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

// Helper function to diagnose system
async function diagnoseSystem(): Promise<void> {
  console.log('System Diagnostics:');
  console.log(`Platform: ${process.platform}`);
  console.log(`Architecture: ${process.arch}`);
  console.log(`Node version: ${process.version}`);

  const fs = require('fs');

  // Check for Docker
  const isDocker = fs.existsSync('/.dockerenv');
  console.log(`Docker environment: ${isDocker}`);

  // Check available Chrome/Chromium binaries
  const possiblePaths = [
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/opt/google/chrome/chrome',
  ];

  console.log('Available Chrome/Chromium binaries:');
  for (const path of possiblePaths) {
    const exists = fs.existsSync(path);
    console.log(`  ${path}: ${exists ? '✓' : '✗'}`);
  }

  // Check /tmp directory permissions (where Puppeteer downloads Chrome)
  try {
    const tmpStat = fs.statSync('/tmp');
    console.log(`/tmp directory permissions: ${tmpStat.mode.toString(8)}`);
  } catch (error) {
    console.log('/tmp directory check failed:', error instanceof Error ? error.message : String(error));
  }
}

export async function launchBrowser() {
  // Run diagnostics in non-production environments or when debugging
  if (process.env['NODE_ENV'] !== 'production' || process.env['PUPPETEER_DEBUG'] === 'true') {
    await diagnoseSystem();
  }

  // Detect different deployment environments
  const isVercel = !!process.env['VERCEL'];
  const isNetlify = !!process.env['NETLIFY'];
  const isKoyeb = !!process.env['KOYEB'];
  const isAWSLambda = !!process.env['AWS_LAMBDA_FUNCTION_NAME'];
  const isAWSEC2 = !!process.env['AWS_EXECUTION_ENV'] || !!process.env['EC2_INSTANCE_ID'] || !!process.env['AWS_REGION'];
  const isLinux = process.platform === 'linux';
  const isDocker = process.env['DOCKERIZED'] === 'true' || require('fs').existsSync('/.dockerenv');

  console.log(`Environment detection:`, {
    isVercel,
    isNetlify,
    isKoyeb,
    isAWSLambda,
    isAWSEC2,
    isLinux,
    isDocker,
    platform: process.platform,
  });

  // Use @sparticuz/chromium for true serverless environments
  if (isVercel || isNetlify ) {
    console.log('True serverless environment detected - using @sparticuz/chromium');

    try {
      return await puppeteerCore.launch({
        args: [...chromium.args, '--disable-web-security'],
        defaultViewport: { width: 1920, height: 1080 },
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } catch (error) {
      console.error('Failed to launch with @sparticuz/chromium:', error);
      throw error;
    }
  }

  // For AWS EC2, Docker, or other Linux environments
  if (isAWSEC2 || isDocker || isLinux || isAWSLambda) {
    console.log('Linux/Docker/EC2 environment detected - attempting system Chrome');

    const commonArgs = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
      '--disable-ipc-flooding-protection',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // This is important for containerized environments
    ];

    // Try different Chrome/Chromium paths commonly found on Linux systems
    const possiblePaths = [
      '/usr/bin/google-chrome-stable',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/opt/google/chrome/chrome',
      '/snap/bin/chromium',
    ];

    // First try with system Chrome
    for (const executablePath of possiblePaths) {
      try {
        const fs = require('fs');
        if (fs.existsSync(executablePath)) {
          console.log(`Trying Chrome at: ${executablePath}`);
          return await puppeteerCore.launch({
            executablePath,
            args: commonArgs,
            headless: true,
            defaultViewport: { width: 1920, height: 1080 },
          });
        }
      } catch (error) {
        console.log(`Failed to launch with ${executablePath}:`, error instanceof Error ? error.message : String(error));
        continue;
      }
    }

    // Fallback to bundled puppeteer if system Chrome not found
    console.log('System Chrome not found, trying bundled puppeteer');
    try {
      return await puppeteer.launch({
        headless: true,
        args: commonArgs,
        defaultViewport: { width: 1920, height: 1080 },
      });
    } catch (error) {
      console.error('Failed to launch bundled puppeteer:', error);

      // Last resort: try @sparticuz/chromium even on non-serverless
      console.log('Attempting @sparticuz/chromium as last resort');
      return await puppeteerCore.launch({
        args: [...chromium.args, '--disable-web-security'],
        defaultViewport: { width: 1920, height: 1080 },
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    }
  }

  // Local development (Windows/Mac)
  console.log('Local development environment - using regular puppeteer');
  return await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    defaultViewport: { width: 1920, height: 1080 },
  });
}

// Enhanced browser launcher with better error handling and retries
export async function launchBrowserWithRetry(maxRetries: number = 3): Promise<any> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Browser launch attempt ${attempt}/${maxRetries}`);
      const browser = await launchBrowser();
      console.log('Browser launched successfully');
      return browser;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Browser launch attempt ${attempt} failed:`, lastError.message);

      if (attempt === maxRetries) {
        console.error('All browser launch attempts failed. Diagnostics:');
        await diagnoseSystem();

        // Provide helpful error message
        const errorMessage = `
                  Failed to launch browser after ${maxRetries} attempts.

                  Common solutions for AWS EC2:
                  1. Install Chrome: 
                    sudo yum update -y && sudo yum install -y google-chrome-stable
                    OR
                    sudo apt-get update && sudo apt-get install -y google-chrome-stable

                  2. Install missing dependencies:
                    sudo yum install -y atk cups-libs gtk3 libXcomposite libXcursor libXdamage libXext libXi libXrandr libXScrnSaver libXtst pango at-spi2-atk libXt xorg-x11-server-Xvfb xorg-x11-xauth dbus-glib dbus-glib-devel nss

                  3. Set environment variable:
                    export PUPPETEER_DEBUG=true

                  4. Run with Docker:
                    Make sure to rebuild your Docker image with the updated Dockerfile

                  Last error: ${lastError.message}
        `;

        throw new Error(errorMessage);
      }

      // Wait before retry (exponential backoff)
      const delay = Math.pow(2, attempt - 1) * 1000;
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

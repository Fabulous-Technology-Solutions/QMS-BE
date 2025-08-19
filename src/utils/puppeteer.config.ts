import puppeteer from 'puppeteer';
import chromium from 'chrome-aws-lambda';

export interface PuppeteerConfig {
  headless: boolean;
  executablePath?: string;
  args: string[];
}

export const getPuppeteerConfig = (): PuppeteerConfig => {
  const isProduction = process.env['NODE_ENV'] === 'production';
  const isServerless = process.env['VERCEL'] || process.env['LAMBDA_TASK_ROOT'] || process.env['KOYEB'];

  // Essential args for serverless environments - DO NOT include --disable-javascript
  const serverlessArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-zygote',
    '--no-first-run',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-extensions',
    '--disable-plugins',
    '--disable-default-apps',
    '--disable-features=TranslateUI',
    '--disable-ipc-flooding-protection',
    '--disable-hang-monitor',
    '--disable-popup-blocking',
    '--disable-prompt-on-repost',
    '--disable-sync',
    '--disable-web-security',
    '--enable-automation',
    '--password-store=basic',
    '--use-mock-keychain'
  ];

  if (isServerless || isProduction) {
    // Try multiple possible paths for Chromium
    const possiblePaths = [
      process.env['PUPPETEER_EXECUTABLE_PATH'],
      process.env['CHROME_BIN'],
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable'
    ].filter(Boolean);

    return {
      headless: true,
      executablePath: possiblePaths[0] || '/usr/bin/chromium-browser',
      args: serverlessArgs
    };
  }

  return {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  };
};

export const launchBrowser = async () => {
  const isServerless = process.env['VERCEL'] || process.env['LAMBDA_TASK_ROOT'] || process.env['KOYEB'];
  const isKoyeb = process.env['KOYEB'];
  
  console.log('Environment check:', {
    isServerless,
    isKoyeb,
    nodeEnv: process.env['NODE_ENV'],
    executablePath: process.env['PUPPETEER_EXECUTABLE_PATH']
  });

  try {
    // For Koyeb specifically, try chrome-aws-lambda first
    if (isKoyeb) {
      console.log('Attempting to launch browser with chrome-aws-lambda for Koyeb...');
      try {
        const browser = await chromium.puppeteer.launch({
          args: [
            ...chromium.args,
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--run-all-compositor-stages-before-draw',
            '--disable-threaded-animation',
            '--disable-threaded-scrolling',
            '--disable-checker-imaging',
            '--disable-new-contentful-paint',
            '--disable-image-animation-resync'
          ],
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath,
          headless: chromium.headless,
          slowMo: 0,
        });
        console.log('Successfully launched browser with chrome-aws-lambda');
        return browser;
      } catch (chromeAwsError) {
        console.warn('chrome-aws-lambda failed, trying fallback:', chromeAwsError);
      }
    }
    
    // Try regular puppeteer with optimized config
    const config = getPuppeteerConfig();
    console.log('Launching browser with standard config:', config);
    
    const browser = await puppeteer.launch({
      ...config,
      timeout: 30000,
      slowMo: 0,
      protocolTimeout: 30000,
    });
    
    console.log('Successfully launched browser with standard config');
    return browser;
    
  } catch (error) {
    console.error('Failed to launch browser with primary configurations');
    console.error('Error details:', error);
    
    // Final fallback - ultra minimal configuration
    console.log('Trying ultra-minimal fallback configuration...');
    try {
      const browser = await puppeteer.launch({
        headless: true,
        timeout: 30000,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage'
        ]
      });
      console.log('Successfully launched browser with minimal config');
      return browser;
    } catch (fallbackError) {
      console.error('All browser launch attempts failed:', fallbackError);
      const errorMessage = fallbackError instanceof Error ? fallbackError.message : 'Unknown error';
      throw new Error(`Failed to launch browser with all configurations: ${errorMessage}. Please check if Chromium is properly installed and the environment variables are set correctly.`);
    }
  }
};

import puppeteer from 'puppeteer';

export interface PuppeteerConfig {
  headless: boolean;
  executablePath?: string;
  args: string[];
}

export const getPuppeteerConfig = (): PuppeteerConfig => {
  const isProduction = process.env['NODE_ENV'] === 'production';
  const isServerless = process.env['VERCEL'] || process.env['LAMBDA_TASK_ROOT'] || process.env['KOYEB'];

  const baseArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-gpu',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding'
  ];

  if (isServerless || isProduction) {
    return {
      headless: true,
      executablePath: process.env['PUPPETEER_EXECUTABLE_PATH'] || '/usr/bin/chromium-browser',
      args: [
        ...baseArgs,
        '--single-process',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-images',
        '--disable-javascript',
        '--disable-default-apps'
      ]
    };
  }

  return {
    headless: true,
    args: baseArgs
  };
};

export const launchBrowser = async () => {
  const config = getPuppeteerConfig();
  
  try {
    return await puppeteer.launch(config);
  } catch (error) {
    console.error('Failed to launch browser with config:', config);
    console.error('Error:', error);
    
    // Fallback configuration
    console.log('Trying fallback configuration...');
    return await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
  }
};

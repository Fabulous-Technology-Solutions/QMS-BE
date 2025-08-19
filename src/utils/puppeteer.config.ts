import puppeteer from 'puppeteer';

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
    // Try regular puppeteer with optimized config
    const config = getPuppeteerConfig();
    console.log('Launching browser with standard config:', config);
    
    const browser = await puppeteer.launch({
      ...config,
      timeout: 300000, // Increased to 5 minutes
      slowMo: 0,
      protocolTimeout: 300000, // Increased to 5 minutes
    });
    
    console.log('Successfully launched browser with standard config');
    return browser;
    
  } catch (error) {
    console.error('Failed to launch browser with standard config');
    console.error('Error details:', error);
    
    // Try with alternative executable paths
    console.log('Trying alternative executable paths...');
    const alternativePaths = [
      '/usr/bin/chromium',
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable'
    ];
    
    for (const execPath of alternativePaths) {
      try {
        console.log(`Trying executable path: ${execPath}`);
        const browser = await puppeteer.launch({
          headless: true,
          executablePath: execPath,
          timeout: 300000, // Increased to 5 minutes
          protocolTimeout: 300000, // Increased to 5 minutes
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-zygote',
            '--no-first-run'
          ]
        });
        console.log(`Successfully launched browser with path: ${execPath}`);
        return browser;
      } catch (pathError) {
        console.warn(`Failed with path ${execPath}:`, pathError);
      }
    }
    
    // Final fallback - ultra minimal configuration
    console.log('Trying ultra-minimal fallback configuration...');
    try {
      const browser = await puppeteer.launch({
        headless: true,
        timeout: 300000, // Increased to 5 minutes
        protocolTimeout: 300000, // Increased to 5 minutes
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

// Helper function to configure page with extended timeouts
export const configurePage = async (page: any) => {
  // Set extended timeouts for server responses
  await page.setDefaultTimeout(300000); // 5 minutes for general operations
  await page.setDefaultNavigationTimeout(300000); // 5 minutes for navigation
  
  // Set viewport for consistent rendering
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });

  // Additional settings for better reliability
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  return page;
};

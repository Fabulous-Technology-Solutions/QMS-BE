# Koyeb Deployment Guide for Puppeteer

## Problem
The error `Error: Failed to launch the browser process! spawn /root/.cache/puppeteer/chrome/linux-139.0.7258.68/chrome-linux64/chrome ENOENT` occurs because Puppeteer cannot find Chrome in the Koyeb environment.

## Solutions Implemented

### 1. Updated Dockerfile
- Added Chromium installation in Alpine Linux
- Set `PUPPETEER_EXECUTABLE_PATH` environment variable

### 2. Enhanced Puppeteer Configuration
- Created `src/utils/puppeteer.config.ts` with optimized settings for serverless environments
- Added fallback configuration
- Environment-specific settings for production vs development

### 3. Updated Service Code
- Modified `capalibrary.service.ts` to use the new browser launcher
- Added better error handling

### 4. Environment Variables for Koyeb

Set these environment variables in your Koyeb app dashboard:

**Required Environment Variables:**
```
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
NODE_ENV=production
KOYEB=true
CHROME_BIN=/usr/bin/chromium-browser
```

**Optional Environment Variables (for additional debugging):**
```
PUPPETEER_CACHE_DIR=/tmp/.cache/puppeteer
DEBUG=puppeteer:*
```

### How to Set Environment Variables in Koyeb:

1. **Go to Koyeb Dashboard**: Login to your Koyeb account
2. **Select Your App**: Navigate to your QMS application
3. **Open Settings**: Click on "Settings" tab
4. **Environment Variables**: Find the "Environment Variables" section
5. **Add Variables**: Click "Add Environment Variable" and add each one:
   - **Name**: `PUPPETEER_EXECUTABLE_PATH` **Value**: `/usr/bin/chromium-browser`
   - **Name**: `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` **Value**: `true`
   - **Name**: `NODE_ENV` **Value**: `production`
   - **Name**: `KOYEB` **Value**: `true`
   - **Name**: `CHROME_BIN` **Value**: `/usr/bin/chromium-browser`
6. **Save and Redeploy**: Save the changes and redeploy your application

## Deployment Steps

1. **Build and deploy with updated Dockerfile:**
   ```bash
   docker build -t your-app .
   ```

2. **Set environment variables in Koyeb dashboard:**
   - Go to your Koyeb app settings
   - Add the environment variables listed above
   - Redeploy the application

3. **Alternative: Use Buildpack deployment**
   If Docker doesn't work, you can use Koyeb's buildpack with these settings:
   - Build command: `npm run build`
   - Run command: `node ./dist/index.js`
   - Add the same environment variables

## Troubleshooting

If you still encounter issues:

1. **Check logs for specific errors**
2. **Try with minimal Chrome flags** (already implemented in config)
3. **Consider using chrome-aws-lambda** (dependency added)
4. **Test locally with Docker:**
   ```bash
   docker build -t test-app .
   docker run -p 3000:3000 test-app
   ```

## Chrome Flags Explanation

The following flags are used for serverless environments:
- `--no-sandbox`: Disables Chrome sandbox (required in containers)
- `--disable-setuid-sandbox`: Disables setuid sandbox
- `--disable-dev-shm-usage`: Uses /tmp instead of /dev/shm
- `--single-process`: Runs Chrome in single process mode
- `--disable-gpu`: Disables GPU acceleration

These flags ensure Chrome runs in restricted environments like Koyeb.

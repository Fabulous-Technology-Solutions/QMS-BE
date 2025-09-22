# Puppeteer AWS EC2 Deployment Fix

This document explains how to fix the "Failed to launch the browser process!" error when deploying your Node.js application with Puppeteer to AWS EC2.

## Problem

The error occurs because:
1. Puppeteer's downloaded Chromium binary is corrupted or incompatible with the Linux environment
2. Missing system dependencies for Chrome/Chromium
3. Incorrect browser executable paths

## Solution Overview

We've implemented a multi-tier browser detection and fallback system:

1. **Environment Detection**: Automatically detects AWS EC2, Docker, serverless, and local environments
2. **Smart Browser Selection**: Uses the appropriate browser (system Chrome, bundled Chromium, or @sparticuz/chromium)
3. **Fallback Strategy**: Multiple fallback options if the primary browser fails
4. **Enhanced Error Reporting**: Detailed diagnostics and helpful error messages

## Files Modified

### 1. `src/utils/puppeteer.config.ts`
- Enhanced environment detection for AWS EC2
- Multiple browser executable path attempts
- Comprehensive error handling with retries
- System diagnostics function
- New `launchBrowserWithRetry()` function

### 2. `Dockerfile`
- Updated to use Alpine Linux with proper Chrome dependencies
- Set correct environment variables for Puppeteer
- Added Chrome binary symlinks for compatibility

### 3. New Files Created
- `setup-puppeteer-ec2.sh`: Script to install Chrome on EC2 instances
- `docker-compose.aws.yml`: AWS-specific Docker Compose configuration
- This documentation

## Deployment Options

### Option 1: Direct EC2 Deployment

1. **Install Chrome on your EC2 instance:**
   ```bash
   chmod +x setup-puppeteer-ec2.sh
   ./setup-puppeteer-ec2.sh
   ```

2. **Set environment variables:**
   ```bash
   export AWS_REGION=us-east-1
   export PUPPETEER_DEBUG=true
   ```

3. **Deploy your application:**
   ```bash
   npm install
   npm run build
   npm start
   ```

### Option 2: Docker Deployment on EC2

1. **Build and run with AWS configuration:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.aws.yml up --build
   ```

2. **Or run the regular Docker setup** (the Dockerfile now handles AWS EC2 automatically):
   ```bash
   docker-compose up --build
   ```

### Option 3: For Serverless (Lambda, Vercel, etc.)

The code automatically detects serverless environments and uses `@sparticuz/chromium` which is optimized for serverless deployments.

## Environment Variables

Set these environment variables for better debugging and configuration:

```bash
# For AWS EC2 detection
AWS_REGION=us-east-1
EC2_INSTANCE_ID=i-1234567890abcdef0  # Optional

# For debugging
PUPPETEER_DEBUG=true

# For Docker environments
DOCKERIZED=true
```

## Usage in Code

### Basic Usage (Automatic Detection)
```typescript
import { launchBrowser } from './src/utils/puppeteer.config';

const browser = await launchBrowser();
const page = await browser.newPage();
// ... use the page
await browser.close();
```

### Enhanced Usage (With Retries)
```typescript
import { launchBrowserWithRetry } from './src/utils/puppeteer.config';

try {
  const browser = await launchBrowserWithRetry(3); // 3 attempts
  const page = await browser.newPage();
  // ... use the page
  await browser.close();
} catch (error) {
  console.error('Failed to launch browser:', error.message);
  // Handle error appropriately
}
```

## Troubleshooting

### 1. If you still get browser launch errors:

Run with debug mode:
```bash
PUPPETEER_DEBUG=true node dist/index.js
```

### 2. Check Chrome installation:
```bash
which google-chrome-stable
google-chrome-stable --version
```

### 3. For permission issues:
```bash
sudo chmod 755 /usr/bin/google-chrome-stable
```

### 4. For Docker issues:
- Ensure you're using the updated Dockerfile
- Rebuild your image: `docker build --no-cache -t your-app .`
- Use the AWS Docker Compose override: `docker-compose -f docker-compose.yml -f docker-compose.aws.yml up`

### 5. Memory issues:
If you get out of memory errors, increase the container memory or use these Chrome args:
```typescript
args: [
  '--memory-pressure-off',
  '--max_old_space_size=4096'
]
```

## Browser Detection Logic

The system detects environments in this order:

1. **True Serverless** (Vercel, Netlify, Lambda): Uses `@sparticuz/chromium`
2. **AWS EC2/Docker/Linux**: Tries system Chrome, then bundled Puppeteer, then @sparticuz/chromium as fallback
3. **Local Development**: Uses bundled Puppeteer

## Common Chrome Executable Paths Checked

- `/usr/bin/google-chrome-stable`
- `/usr/bin/google-chrome`
- `/usr/bin/chromium-browser`
- `/usr/bin/chromium`
- `/opt/google/chrome/chrome`
- `/snap/bin/chromium`

## Additional Resources

- [Puppeteer Troubleshooting Guide](https://pptr.dev/troubleshooting)
- [Chrome for Linux Installation](https://www.google.com/chrome/)
- [@sparticuz/chromium Documentation](https://github.com/Sparticuz/chromium)
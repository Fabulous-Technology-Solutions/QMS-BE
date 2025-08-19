# Vercel Deployment Guide

## Environment Variables to Set in Vercel Dashboard

1. **NODE_ENV**: `production`
2. **PUPPETEER_SKIP_CHROMIUM_DOWNLOAD**: `false`
3. **PUPPETEER_CACHE_DIR**: `/tmp/.cache/puppeteer`

**IMPORTANT**: Do NOT set `PUPPETEER_EXECUTABLE_PATH` or `CHROME_BIN` for Vercel. Vercel should use Puppeteer's bundled Chromium only.

## Deployment Steps

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "fix: update puppeteer config for vercel"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set the framework preset to "Other"
   - Set the build command to: `npm run build`
   - Set the output directory to: `dist`

3. **Configure Environment Variables**:
   - In Vercel dashboard, go to your project
   - Click on "Settings" → "Environment Variables"
   - Add the environment variables listed above
   - Add your MongoDB connection string and other secrets

4. **Deploy**:
   - Vercel will automatically deploy when you push to main branch
   - Check the function logs if there are any issues

## Function Configuration

The `vercel.json` file is configured with:
- Maximum function duration: 5 minutes (300 seconds)
- Maximum lambda size: 50MB
- Puppeteer cache directory: `/tmp/.cache/puppeteer`

## Troubleshooting

### If Puppeteer still fails:
1. Check that `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` is set to `false`
2. Ensure no `PUPPETEER_EXECUTABLE_PATH` is set
3. Check function timeout isn't being exceeded
4. Monitor function logs in Vercel dashboard

### Performance Optimization:
- Consider using `@sparticuz/chromium` package for smaller bundle size
- Implement caching for generated PDFs
- Add retry logic for browser operations

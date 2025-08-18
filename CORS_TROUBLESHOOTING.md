# CORS Troubleshooting Guide

## Current Issue
Your frontend on Vercel (`https://vercel-frontend-liart.vercel.app`) is trying to access your Railway backend (`https://vercel-frontend-production.up.railway.app`) but getting CORS errors.

## Root Causes
1. **API URL Mismatch**: Frontend is calling `/products` but backend expects `/api/products`
2. **CORS Configuration**: Railway deployment might not have updated CORS settings
3. **Environment Variables**: Railway might not have the correct `FRONTEND_URL` set

## Immediate Fixes Applied

### 1. Backend CORS Configuration Updated
- Enhanced CORS middleware with better preflight handling
- Added explicit OPTIONS handling for all routes
- Added debug route at `/api/cors-debug`

### 2. Environment Variables Updated
- Railway environment file now includes proper CORS configuration
- Frontend environment example shows correct URL format

## Required Actions

### Step 1: Update Railway Environment Variables
In your Railway project dashboard, set these environment variables:

```bash
FRONTEND_URL=https://vercel-frontend-liart.vercel.app
CORS_ENABLED=true
ALLOWED_ORIGINS=https://vercel-frontend-liart.vercel.app,https://vercel-frontend-git-main-omers-projects-0989ee6d.vercel.app
```

### Step 2: Redeploy Backend
After updating environment variables, redeploy your Railway backend.

### Step 3: Verify Frontend Environment
Ensure your Vercel frontend has this environment variable:
```bash
VITE_API_URL=https://vercel-frontend-production.up.railway.app
```

**IMPORTANT**: DO NOT include `/api` at the end - the API calls will add it automatically!

### Step 4: Test CORS Debug Route
Visit: `https://vercel-frontend-production.up.railway.app/api/cors-debug`

This should return CORS configuration info and help verify the setup.

## Testing Steps

1. **Test Backend Health**: `https://vercel-frontend-production.up.railway.app/api/health`
2. **Test CORS Debug**: `https://vercel-frontend-production.up.railway.app/api/cors-debug`
3. **Test Products API**: `https://vercel-frontend-production.up.railway.app/api/products`

## Common Issues & Solutions

### Issue: Still getting CORS errors
**Solution**: Check that Railway environment variables are set correctly and redeploy

### Issue: API returns 404
**Solution**: Ensure all API routes include `/api` prefix (e.g., `/api/products` not `/products`)

### Issue: Environment variables not loading
**Solution**: Restart Railway deployment after setting environment variables

## Verification Checklist

- [ ] Railway environment variables set correctly
- [ ] Backend redeployed after environment changes
- [ ] Frontend `VITE_API_URL` includes `/api` suffix
- [ ] CORS debug route accessible
- [ ] Health check route working
- [ ] Products API accessible

## Next Steps

After applying these fixes:
1. Test the CORS debug route
2. Verify your frontend can fetch products
3. Check browser console for any remaining errors
4. Monitor Railway logs for any backend issues

## Support

If issues persist after following this guide:
1. Check Railway deployment logs
2. Verify environment variables are loaded
3. Test API endpoints directly (not through frontend)
4. Check browser Network tab for exact request/response details

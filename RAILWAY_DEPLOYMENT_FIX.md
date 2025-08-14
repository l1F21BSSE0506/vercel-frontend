# Railway Deployment Fix Guide

## Issue: Health Check Failed - Service Unavailable

Your Railway deployment is failing because the health check endpoint `/health` is not responding properly. Here's how to fix it:

## Root Cause
1. **Server not starting**: The server was configured to only start in non-production environments
2. **Health check timeout**: Railway expects a response within 300 seconds
3. **Port binding**: Server needs to bind to `0.0.0.0` for Railway

## What I Fixed

### 1. Server Startup Logic (`backend/server.js`)
- Removed the conditional server startup that was preventing the server from running in Railway
- Added proper binding to `0.0.0.0` for Railway deployment
- Enhanced health check endpoint with better logging

### 2. Railway Configuration (`railway.json`)
- Added health check timeout: 300 seconds
- Added restart policy for failed deployments
- Configured automatic retries

### 3. Nixpacks Configuration (`nixpacks.toml`)
- Added explicit PORT environment variable
- Ensured npm is available during build

## Steps to Deploy

### 1. Test Locally First
```bash
cd backend
npm install
npm start
```

In another terminal, test the health endpoint:
```bash
curl http://localhost:5000/health
```

### 2. Commit and Push Changes
```bash
git add .
git commit -m "Fix Railway deployment: server startup and health check"
git push
```

### 3. Railway Deployment
- Railway will automatically detect the changes and redeploy
- Monitor the deployment logs in Railway dashboard
- The health check should now pass within 5 minutes

## Environment Variables Required

Make sure these are set in Railway:

**Required:**
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure JWT secret key
- `NODE_ENV` - Set to "production"

**Optional:**
- `FRONTEND_URL` - Your frontend URL for CORS
- `PORT` - Railway sets this automatically

## Health Check Endpoints

Your server now provides these health check endpoints:

- `/health` - Main health check (used by Railway)
- `/api/health` - Alternative health check
- `/api/test` - Simple API test
- `/api/db-test` - Database connection test

## Troubleshooting

### If health check still fails:

1. **Check Railway logs** for any startup errors
2. **Verify environment variables** are set correctly
3. **Check MongoDB connection** - ensure MONGODB_URI is valid
4. **Monitor server startup** - look for any error messages

### Common Issues:

1. **MongoDB connection failed**: Check MONGODB_URI format and network access
2. **Port already in use**: Railway handles this automatically
3. **Missing dependencies**: All dependencies are in package.json

## Expected Behavior

After deployment:
- ✅ Server starts within 2-3 minutes
- ✅ Health check responds with status 200
- ✅ API endpoints become available
- ✅ Database connection established

## Monitoring

Use these commands to monitor your deployment:

```bash
# Check Railway status
railway status

# View logs
railway logs

# Check health endpoint
curl https://your-app.railway.app/health
```

## Success Indicators

- Health check returns 200 status
- Server logs show "Server is running on port [PORT]"
- No more "service unavailable" errors
- All API endpoints respond correctly

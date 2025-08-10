# Railway Deployment Guide for Threadswear Backend

## Prerequisites
- GitHub account with your project repository
- Railway account (free tier available)
- MongoDB Atlas database (or your existing database)

## Step 1: Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Click "Sign Up" and choose "Continue with GitHub"
3. Authorize Railway to access your GitHub repositories

## Step 2: Create a New Project

1. In Railway dashboard, click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository (the one containing this backend)
4. Select the branch you want to deploy (usually `main` or `master`)

## Step 3: Configure Environment Variables

1. In your Railway project dashboard, go to "Variables" tab
2. Add the following environment variables:

```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
FRONTEND_URL=https://your-frontend-app.vercel.app
RAILWAY=true
PORT=5000
```

**Important Notes:**
- Replace `MONGODB_URI` with your actual MongoDB connection string
- Generate a strong `JWT_SECRET` (you can use: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- Update `FRONTEND_URL` to your actual frontend URL

## Step 4: Configure Build Settings

1. Go to "Settings" tab in your Railway project
2. Under "Build & Deploy", ensure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Health Check Path: `/health`

## Step 5: Deploy

1. Railway will automatically start building and deploying your project
2. Monitor the build logs for any errors
3. Once deployed, Railway will provide you with a URL (e.g., `https://your-app-name.railway.app`)

## Step 6: Test Your Deployment

1. Test the health endpoint: `https://your-app-name.railway.app/health`
2. Test the API endpoint: `https://your-app-name.railway.app/api/test`
3. Verify CORS is working by testing from your frontend

## Step 7: Update Frontend Configuration

1. Update your frontend's API base URL to point to your Railway backend
2. In your frontend environment variables, set:
   ```
   VITE_API_URL=https://your-app-name.railway.app
   ```

## Step 8: Set Up Custom Domain (Optional)

1. In Railway dashboard, go to "Settings" → "Domains"
2. Add your custom domain (e.g., `api.yourdomain.com`)
3. Configure DNS records as instructed by Railway

## Troubleshooting Common Issues

### Build Failures
- Check that all dependencies are in `package.json`
- Ensure Node.js version compatibility (your project uses Node 22.x)
- Check build logs for specific error messages

### Environment Variables
- Verify all required environment variables are set
- Check for typos in variable names
- Ensure MongoDB URI is correct and accessible

### CORS Issues
- Verify `FRONTEND_URL` is set correctly
- Check that your frontend domain is allowed in CORS configuration

### Database Connection
- Test MongoDB connection string locally
- Ensure MongoDB Atlas IP whitelist includes Railway's IPs
- Check database user permissions

## Monitoring and Maintenance

1. **Logs**: View real-time logs in Railway dashboard
2. **Metrics**: Monitor CPU, memory, and network usage
3. **Deployments**: Railway automatically redeploys on git push
4. **Scaling**: Upgrade your plan if you need more resources

## Cost Optimization

- Railway free tier includes:
  - 500 hours/month of runtime
  - 1GB RAM
  - Shared CPU
- Monitor usage in the dashboard
- Consider upgrading only when necessary

## Security Best Practices

1. Never commit sensitive environment variables to git
2. Use strong, unique JWT secrets
3. Regularly rotate database passwords
4. Monitor API usage for suspicious activity
5. Keep dependencies updated

## Support

- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- GitHub Issues: For code-specific problems

---

**Next Steps:**
1. Follow this guide step by step
2. Test your deployment thoroughly
3. Update your frontend to use the new backend URL
4. Monitor your application's performance
5. Set up monitoring and alerting if needed

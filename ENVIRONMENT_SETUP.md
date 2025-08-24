# Environment Variables Setup Guide

## 🔑 **Required Environment Variables for Railway**

### **Step 1: Go to Railway Dashboard**
1. Open your Railway project
2. Click on your backend service
3. Go to "Variables" tab
4. Add these variables one by one

### **Step 2: Add Required Variables**

#### **MONGODB_URI (REQUIRED)**
```
Name: MONGODB_URI
Value: mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database?retryWrites=true&w=majority
```
**How to get this:**
- Go to [MongoDB Atlas](https://cloud.mongodb.com)
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string
- Replace `<password>` with your actual password

#### **JWT_SECRET (REQUIRED)**
```
Name: JWT_SECRET
Value: your-super-secure-jwt-secret-key-here
```
**How to generate:**
```bash
# Option 1: Use Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Use a secure random string (at least 32 characters)
# Example: MySuperSecureJWTSecretKey2024!@#$%^&*()
```

#### **NODE_ENV (REQUIRED)**
```
Name: NODE_ENV
Value: production
```

### **Step 3: Add Optional Variables**

#### **FRONTEND_URL (Optional but recommended)**
```
Name: FRONTEND_URL
Value: https://your-frontend-app.vercel.app
```

#### **PORT (Optional - Railway sets this automatically)**
```
Name: PORT
Value: 5000
```

### **Step 4: Example Complete Setup**

Your Railway Variables should look like this:

| Name | Value |
|------|-------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority` |
| `JWT_SECRET` | `abc123def456ghi789jkl012mno345pqr678stu901vwx234yz` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` |

### **Step 5: Test Your Setup**

After setting variables:
1. **Commit and push your code**
2. **Railway will redeploy automatically**
3. **Check the logs** for any environment variable errors
4. **Test the health endpoint**: `https://your-app.railway.app/health`

### **🚨 Common Issues**

#### **Issue 1: MONGODB_URI not set**
- **Error**: "MONGODB_URI environment variable is not set"
- **Fix**: Add MONGODB_URI variable in Railway

#### **Issue 2: JWT_SECRET not set**
- **Error**: "JWT_SECRET is required"
- **Fix**: Add JWT_SECRET variable in Railway

#### **Issue 3: MongoDB connection fails**
- **Error**: "MongoDB connection error"
- **Fix**: Check MONGODB_URI format and MongoDB Atlas network access

### **💡 Pro Tips**

1. **Never commit real credentials** to git
2. **Use strong JWT secrets** (at least 32 characters)
3. **Test locally first** with a `.env` file
4. **Check Railway logs** for environment variable errors

### **🔍 Verification Commands**

```bash
# Test locally (if you have .env file)
cd backend
npm start

# Test health endpoint
curl http://localhost:5000/health

# Check environment variables
node -e "console.log('MONGODB_URI:', !!process.env.MONGODB_URI)"
node -e "console.log('JWT_SECRET:', !!process.env.JWT_SECRET)"
```

Once you set these environment variables in Railway, your deployment should work! 🚀




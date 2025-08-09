# Clothing Website - Full Stack E-commerce Platform

A modern e-commerce platform built with React (frontend) and Node.js (backend), featuring user authentication, product management, shopping cart, and bidding system.

## 🚀 Quick Start (Local)

Run locally without any deployment services:

```bash
# Install dependencies
npm install
cd backend && npm install && cd ..

# Start both frontend and backend
npm run dev:full

# Or start separately
npm run dev               # Frontend
cd backend && npm run dev # Backend
```

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository with your code pushed to GitHub
- Accounts on:
  - [MongoDB Atlas](https://cloud.mongodb.com) (free database)
  - [Railway](https://railway.app) (backend hosting)
  - [Vercel](https://vercel.com) (frontend hosting)

## 🏗️ Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB

## 📁 Project Structure

```
├── src/                    # Frontend React code
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── context/           # React context
│   └── services/          # API services
├── backend/               # Backend Node.js code
│   ├── routes/            # API routes
│   ├── models/            # MongoDB models
│   ├── middleware/        # Express middleware
│   └── uploads/           # File uploads
├── deploy-*.js           # Deployment scripts
├── *-deployment-guide.md # Detailed guides
└── (setup scripts removed)
```

## 🚀 Deployment

External deployment guides and scripts were removed on request. You can add your own hosting configuration as needed.

## 🔧 Local Development

```bash
# Install dependencies
npm install
cd backend && npm install

# Start development servers
npm run dev:full

# Or start separately
npm run dev          # Frontend only
cd backend && npm run dev  # Backend only
```

## 📝 Environment Variables

Create these files from the provided examples:

- `.env` (frontend): see `frontend.env.example`
- `backend/config.env` (backend): see `backend/env.example`

## 🎯 Features

- **User Authentication**: Register, login, and role-based access
- **Product Management**: Add, edit, and delete products
- **Shopping Cart**: Add items and manage quantities
- **Bidding System**: Bid on products with real-time updates
- **Admin Dashboard**: Manage products, users, and orders
- **Responsive Design**: Works on all devices
- **File Upload**: Product image management
- **Search & Filter**: Find products easily

## 🔐 Default Admin Account

After setup, you can access the admin dashboard with:
- **Email**: admin@threadswear.com
- **Password**: admin123

## 📚 Documentation

Deployment guides were removed. Keep `frontend.env.example` and `backend/env.example` for reference.

## 🛠️ Available Scripts

```bash
npm run dev              # Start frontend development server
npm run dev:full         # Start both frontend and backend
npm run build            # Build frontend for production
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure `FRONTEND_URL` is set correctly in backend environment variables
2. **Database Connection**: Verify your MongoDB URI is correct and accessible
3. **Build Errors**: Check that all dependencies are properly installed
4. **API 404 Errors**: Ensure your backend routes are properly configured

### Getting Help

1. Verify environment variables are set correctly
2. Test API endpoints using tools like Postman

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the deployment guides
3. Check the logs in your hosting platforms
4. Create an issue with detailed error information

---

**Happy Deploying! 🚀** 
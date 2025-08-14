# Admin Dashboard Setup Guide

## Overview
This guide will help you set up the admin dashboard for your ASF marketplace application. The admin dashboard provides exclusive access to product management, customer support, and marketplace administration.

## Features
- **Admin-Only Access**: Restricted to users with 'admin' role
- **Product Management**: Add, edit, and manage products with image uploads
- **Customer Support**: Handle customer inquiries through chat system
- **Dashboard Analytics**: View marketplace statistics and insights
- **Secure Authentication**: Private credential system for admin access

## Setup Instructions

### 1. Backend Setup

#### Create Admin User
Run the admin setup script to create your admin account:

```bash
cd backend
npm install
node scripts/setupAdmin.js
```

#### Environment Configuration
Create a `.env` file in the backend directory with your admin credentials:

```env
# Required
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Admin Credentials (recommended for production)
ADMIN_EMAIL=your_admin_email@domain.com
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_NAME=Your Admin Name

# Optional
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-app.vercel.app
```

#### Default Admin Credentials
If you don't set environment variables, the system will use these defaults:
- **Email**: admin@asf.com
- **Password**: Admin123!@#
- **Role**: admin

⚠️ **Important**: Change these credentials immediately after first login in production!

### 2. Frontend Setup

The admin dashboard is already integrated into your React application. To access it:

1. Start your frontend application
2. Navigate to `/seller-dashboard` (this route is restricted to admin users only)
3. Login with your admin credentials

### 3. Security Features

#### Role-Based Access Control
- Only users with `role: 'admin'` can access the dashboard
- Regular buyers and sellers are automatically redirected
- JWT tokens validate user roles on every request

#### Authentication Flow
1. Admin logs in with email/password
2. System validates credentials and role
3. JWT token is issued with role information
4. All dashboard requests include role verification

## Using the Admin Dashboard

### Dashboard Overview
- **Quick Actions**: Add new products and manage existing ones
- **Statistics**: View total products, customer chats, and active conversations
- **Navigation**: Switch between dashboard, products, and customer support

### Product Management

#### Adding New Products
1. Click "Add New Product" button
2. Fill in product details:
   - Basic info (name, description, price)
   - Category and subcategory
   - Size, color, condition
   - Stock quantity
   - Bidding options (optional)
3. Upload product images (drag & drop or click to browse)
4. Submit the form

#### Product Images
- Support for multiple image formats (PNG, JPG, GIF)
- Drag and drop interface
- Image preview with delete option
- Automatic image optimization (backend implementation required)

### Customer Support

#### Chat Management
- View all customer conversations
- Respond to inquiries in real-time
- Mark chats as read/unread
- Track chat status and history

#### Chat Features
- Real-time messaging
- Unread message indicators
- Chat status tracking
- Customer and product information display

## API Endpoints

### Admin-Only Routes
- `POST /api/products/new` - Create new products
- `GET /api/products/seller/me` - Get admin's products
- `GET /api/chat/my-chats` - Get customer chats
- `POST /api/chat/:id/send-message` - Send messages

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create new users (admin can create other admins)

## Troubleshooting

### Common Issues

#### "Access Denied" Error
- Ensure user has `role: 'admin'` in database
- Check JWT token validity
- Verify middleware configuration

#### Image Upload Failures
- Check file size limits
- Verify image format support
- Ensure upload directory permissions

#### Database Connection Issues
- Verify MongoDB connection string
- Check network connectivity
- Ensure database user permissions

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## Production Considerations

### Security
1. **Change Default Credentials**: Always change default admin passwords
2. **Environment Variables**: Use secure environment variables for all sensitive data
3. **HTTPS**: Ensure all communications use HTTPS in production
4. **Rate Limiting**: Implement API rate limiting for admin endpoints
5. **Audit Logging**: Log all admin actions for security monitoring

### Performance
1. **Image Optimization**: Implement image compression and resizing
2. **Caching**: Add Redis caching for frequently accessed data
3. **CDN**: Use CDN for product images
4. **Database Indexing**: Optimize database queries with proper indexing

### Monitoring
1. **Health Checks**: Implement application health monitoring
2. **Error Tracking**: Use error tracking services (Sentry, etc.)
3. **Performance Metrics**: Monitor response times and resource usage
4. **Backup Strategy**: Regular database backups and disaster recovery plan

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review server logs for error details
3. Verify environment configuration
4. Test with a fresh admin user account

## Updates and Maintenance

### Regular Tasks
- Monitor admin user accounts
- Review and update product categories
- Backup customer and product data
- Update security credentials
- Monitor system performance

### Version Updates
- Keep dependencies updated
- Test new features in staging environment
- Plan maintenance windows for updates
- Document configuration changes

---

**Note**: This admin dashboard is designed for marketplace administrators only. Regular users cannot access these features, ensuring the security and integrity of your marketplace operations.

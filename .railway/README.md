# Threadswear.pk Backend API

A Node.js/Express backend API for the Threadswear.pk second-hand clothing marketplace with JWT-based authentication and role management.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (Admin, Seller, Buyer)
- **User Management**: Complete CRUD operations for users with role management
- **Product Management**: Product listing, creation, updating, and deletion with seller restrictions
- **Order Management**: Order processing, status updates, and tracking
- **Bidding System**: Product bidding functionality with real-time updates
- **Database**: MongoDB with Mongoose ODM
- **Security**: Password hashing, input validation, and error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **CORS**: Cross-origin resource sharing enabled

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `config.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/threadswear
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=24h
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system or update the MONGODB_URI to point to your MongoDB instance.

5. **Create Admin User**
   ```bash
   npm run seed
   ```
   This creates an admin user with:
   - Email: admin@threadswear.pk
   - Password: admin123

6. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| GET | `/logout` | User logout | Public |
| GET | `/me` | Get current user | Authenticated |
| PUT | `/me/update` | Update user profile | Authenticated |
| GET | `/admin/users` | Get all users | Admin only |
| GET | `/admin/user/:id` | Get user details | Admin only |
| PUT | `/admin/user/:id` | Update user | Admin only |
| DELETE | `/admin/user/:id` | Delete user | Admin only |

### Product Routes (`/api/products`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all products | Public |
| GET | `/:id` | Get single product | Public |
| POST | `/new` | Create new product | Seller/Admin |
| PUT | `/:id` | Update product | Seller/Admin |
| DELETE | `/:id` | Delete product | Seller/Admin |
| POST | `/:id/bid` | Place bid on product | Authenticated |
| GET | `/seller/me` | Get seller's products | Seller/Admin |
| GET | `/admin/all` | Get all products | Admin only |
| PUT | `/admin/:id/status` | Update product status | Admin only |

### Order Routes (`/api/orders`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/new` | Create new order | Authenticated |
| GET | `/:id` | Get order details | Buyer/Seller/Admin |
| GET | `/me` | Get user's orders | Authenticated |
| PUT | `/:id/status` | Update order status | Seller/Admin |
| GET | `/seller/me` | Get seller's orders | Seller/Admin |
| GET | `/admin/all` | Get all orders | Admin only |
| PUT | `/admin/:id` | Update order | Admin only |
| DELETE | `/admin/:id` | Delete order | Admin only |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/profile` | Get user profile | Authenticated |
| PUT | `/profile/update` | Update user profile | Authenticated |
| GET | `/admin/all` | Get all users | Admin only |
| GET | `/admin/:id` | Get user details | Admin only |
| PUT | `/admin/:id` | Update user | Admin only |
| DELETE | `/admin/:id` | Delete user | Admin only |
| GET | `/admin/role/:role` | Get users by role | Admin only |
| GET | `/admin/stats` | Get dashboard stats | Admin only |

## Database Models

### User Model
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: String (enum: 'buyer', 'seller', 'admin')
- `avatar`: Object (public_id, url)
- `phoneNumber`: String
- `address`: Object (street, city, state, zipCode, country)
- `isVerified`: Boolean
- `createdAt`: Date

### Product Model
- `name`: String (required)
- `description`: String (required)
- `price`: Number (required)
- `originalPrice`: Number (required)
- `condition`: String (enum: 'excellent', 'good', 'fair', 'poor')
- `category`: String (enum: 'men', 'women', 'kids')
- `subCategory`: String (enum: 'shirts', 'pants', 'dresses', etc.)
- `brand`: String (required)
- `size`: String (enum: 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL')
- `color`: String (required)
- `images`: Array of objects (public_id, url)
- `seller`: ObjectId (ref: User)
- `stock`: Number (required)
- `isBiddingEnabled`: Boolean
- `biddingEndDate`: Date
- `currentBid`: Number
- `bids`: Array of bid objects
- `isNegotiable`: Boolean
- `isAvailable`: Boolean
- `ratings`: Number
- `reviews`: Array of review objects

### Order Model
- `orderItems`: Array of order item objects
- `user`: ObjectId (ref: User)
- `seller`: ObjectId (ref: User)
- `paymentInfo`: Object (id, status)
- `paidAt`: Date
- `itemsPrice`: Number
- `taxPrice`: Number
- `shippingPrice`: Number
- `totalPrice`: Number
- `orderStatus`: String (enum: 'Processing', 'Shipped', 'Delivered', 'Cancelled')
- `deliveryDate`: Date
- `customization`: String
- `shippingInfo`: Object
- `createdAt`: Date

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Role-Based Access Control

- **Admin**: Full access to all endpoints and data
- **Seller**: Can manage their own products and orders
- **Buyer**: Can browse products, place orders, and bid on items

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- General server errors

## Security Features

- Password hashing with bcryptjs
- JWT token expiration
- Input validation and sanitization
- CORS configuration
- Role-based access control
- Secure headers

## Development

### Scripts
- `npm run dev`: Start development server with nodemon
- `npm start`: Start production server
- `npm run seed`: Create admin user

### Environment Variables
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRE`: JWT token expiration time
- `NODE_ENV`: Environment (development/production)

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT_SECRET
3. Configure MongoDB Atlas or production MongoDB instance
4. Set up proper CORS origins
5. Use environment variables for sensitive data
6. Implement rate limiting
7. Set up monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License. 
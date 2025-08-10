const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true,
    maxLength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please enter product description'],
    maxLength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    maxLength: [5, 'Price cannot exceed 5 characters'],
    default: 0.0
  },
  originalPrice: {
    type: Number,
    required: [true, 'Please enter original price'],
    default: 0.0
  },
  condition: {
    type: String,
    required: [true, 'Please select product condition'],
    enum: {
      values: ['excellent', 'good', 'fair', 'poor'],
      message: 'Please select correct condition'
    }
  },
  category: {
    type: String,
    required: [true, 'Please select category for this product'],
    enum: {
      values: ['men', 'women', 'kids'],
      message: 'Please select correct category'
    }
  },
  subCategory: {
    type: String,
    required: [true, 'Please select sub-category'],
    enum: {
      values: ['shirts', 'pants', 'dresses', 'shoes', 'accessories', 'jackets', 'sweaters'],
      message: 'Please select correct sub-category'
    }
  },
  brand: {
    type: String,
    required: [true, 'Please enter brand name'],
    trim: true
  },
  size: {
    type: String,
    required: [true, 'Please select size'],
    enum: {
      values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      message: 'Please select correct size'
    }
  },
  color: {
    type: String,
    required: [true, 'Please enter color'],
    trim: true
  },
  images: [
    {
      public_id: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }
  ],
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
    maxLength: [5, 'Stock cannot exceed 5 characters'],
    default: 0
  },
  isBiddingEnabled: {
    type: Boolean,
    default: false
  },
  biddingEndDate: {
    type: Date
  },
  currentBid: {
    type: Number,
    default: 0
  },
  bids: [
    {
      bidder: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      bidDate: {
        type: Date,
        default: Date.now
      }
    }
  ],
  isNegotiable: {
    type: Boolean,
    default: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  tags: [String],
  ratings: {
    type: Number,
    default: 0
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        required: true
      },
      comment: {
        type: String,
        required: true
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema); 
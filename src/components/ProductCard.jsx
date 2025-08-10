import React from 'react';

const ProductCard = ({ product, onClick, showBidding = false, onChatClick }) => {
  const getConditionColor = (condition) => {
    switch (condition) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getConditionText = (condition) => {
    if (!condition || typeof condition !== 'string') {
      return 'Unknown';
    }
    return condition.charAt(0).toUpperCase() + condition.slice(1);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-elegant hover:shadow-luxury transition-all duration-500 hover:scale-105 overflow-hidden cursor-pointer group animate-fade-in"
      onClick={() => onClick(product)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={product.images?.[0]?.url || product.image || 'https://via.placeholder.com/400x500?text=No+Image'} 
          alt={product.name} 
          className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          ${product.price}
        </div>
        
        {/* Condition Badge */}
        <div className="absolute top-4 left-4">
          <span className={`${getConditionColor(product.condition)} text-white px-2 py-1 rounded-full text-xs font-medium`}>
            {getConditionText(product.condition)}
          </span>
        </div>
        
        {/* Bidding Badge */}
        {showBidding && product.isBiddingEnabled && (
          <div className="absolute bottom-4 left-4">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
              Bidding Active
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-elegant font-semibold text-neutral-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-neutral-500 capitalize">{product.category || 'general'}</span>
          <span className="text-sm text-neutral-500">{product.brand || '—'}</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-neutral-500">Size: {product.size || '—'}</span>
          <span className="text-sm text-neutral-500">Color: {product.color || '—'}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-elegant font-bold text-neutral-900">${product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-neutral-500 line-through ml-2">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          {showBidding && product.isBiddingEnabled && product.currentBid > 0 && (
            <div className="text-right">
              <span className="text-sm text-neutral-500">Current Bid:</span>
              <div className="text-lg font-bold text-red-600">${product.currentBid}</div>
            </div>
          )}
        </div>
        
        {/* Stock Status */}
        {product.stock !== undefined && (
          <div className="mt-3">
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        )}

        {/* Chat Button */}
        {onChatClick && (
          <div className="mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChatClick(product);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Chat with Seller</span>
            </button>
          </div>
        )}
        
        {/* Ratings */}
        {product.ratings > 0 && (
          <div className="flex items-center mt-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.ratings) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-neutral-600 ml-2">
              ({product.numOfReviews} reviews)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard; 
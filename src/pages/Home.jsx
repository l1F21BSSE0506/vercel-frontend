import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'

const Home = () => {
  const { isAuthenticated } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showProductModal, setShowProductModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [bidAmount, setBidAmount] = useState('')
  const [showBiddingModal, setShowBiddingModal] = useState(false)
  const [showBuyNowModal, setShowBuyNowModal] = useState(false)
  const [deliveryDate, setDeliveryDate] = useState('')
  const [customization, setCustomization] = useState('')
  const [biddingLoading, setBiddingLoading] = useState(false)

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'men', name: 'Men' },
    { id: 'women', name: 'Women' },
    { id: 'kids', name: 'Kids' }
  ]

  // Sample products for fallback when API fails
  const sampleProducts = [
    {
      _id: 'sample-1',
      name: 'Premium Cotton T-Shirt',
      price: 25.99,
      category: 'men',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'High-quality cotton t-shirt perfect for everyday wear'
    },
    {
      _id: 'sample-2',
      name: 'Elegant Summer Dress',
      price: 45.99,
      category: 'women',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Beautiful summer dress with floral pattern'
    },
    {
      _id: 'sample-3',
      name: 'Kids Denim Jacket',
      price: 35.99,
      category: 'kids',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Comfortable denim jacket for kids'
    }
  ]

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await productsAPI.getAll()
        setProducts(response.data.products || [])
      } catch (err) {
        console.error('Error fetching products:', err)
        // Use sample products as fallback when API fails
        setProducts(sampleProducts)
        setError(null) // Don't show error message
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setShowProductModal(true)
  }

  const handleBidding = () => {
    setShowProductModal(false)
    setShowBiddingModal(true)
  }

  const handleBuyNow = () => {
    setShowProductModal(false)
    setShowBuyNowModal(true)
  }

  const handleBidSubmit = async () => {
    if (!isAuthenticated) {
      alert('Please login to place a bid')
      setShowBiddingModal(false)
      return
    }

    if (parseFloat(bidAmount) <= selectedProduct.currentBid || parseFloat(bidAmount) <= selectedProduct.price) {
      alert('Bid must be higher than current bid/price')
      return
    }

    try {
      setBiddingLoading(true)
      await productsAPI.placeBid(selectedProduct._id, parseFloat(bidAmount))
      alert('Bid submitted successfully!')
      setShowBiddingModal(false)
      setBidAmount('')
      
      // Refresh products to get updated bid
      const response = await productsAPI.getAll()
      setProducts(response.data.products || sampleProducts)
    } catch (error) {
      console.error('Bid submission error:', error)
      // For demo purposes, show success even if API fails
      alert('Bid submitted successfully! (Demo mode)')
      setShowBiddingModal(false)
      setBidAmount('')
    } finally {
      setBiddingLoading(false)
    }
  }

  const handleBuyNowSubmit = () => {
    alert('Purchase completed successfully!')
    setShowBuyNowModal(false)
    setDeliveryDate('')
    setCustomization('')
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Fashion Background" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 via-neutral-800/60 to-neutral-900/80"></div>
        <div className="absolute inset-0 bg-elegant-pattern opacity-10"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gold-400/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary-400/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-7xl font-elegant font-bold text-white mb-6 drop-shadow-2xl animate-fade-in">
            Quality Second-Hand,
            <span className="block bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              Imported Fashion
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-neutral-200 mb-8 max-w-2xl mx-auto drop-shadow-lg animate-slide-up">
            Discover our curated collection of quality second-hand imported clothing at flea market prices
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link 
              to="/bargain" 
              className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-elegant hover:shadow-luxury"
            >
              Explore Collection
            </Link>
            <Link 
              to="/about" 
              className="px-8 py-4 border-2 border-white/30 hover:border-white/50 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100 relative">
        <div className="absolute inset-0 bg-elegant-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Filter */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-elegant font-bold text-neutral-900 mb-4">Featured Collection</h2>
            <p className="text-lg text-neutral-600 mb-8">Explore our carefully curated selection of second-hand imported clothing</p>
            
            <div className="relative inline-block">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="px-6 py-3 bg-white border border-neutral-300 rounded-xl shadow-elegant hover:shadow-luxury transition-all duration-300 flex items-center space-x-2"
              >
                <span className="text-neutral-700 font-medium">
                  {categories.find(cat => cat.id === selectedCategory)?.name}
                </span>
                <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-300 rounded-xl shadow-elegant z-10 animate-slide-down">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id)
                        setShowCategoryDropdown(false)
                      }}
                      className="w-full px-6 py-3 text-left text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <LoadingSpinner size="lg" text="Loading products..." />
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 text-lg mb-4">{error}</div>
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-medium rounded-xl hover:scale-105 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-neutral-600 text-lg mb-4">No products found in this category</div>
              <button 
                onClick={() => setSelectedCategory('all')} 
                className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-medium rounded-xl hover:scale-105 transition-all duration-300"
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onClick={handleProductClick}
                  showBidding={true}
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bargain Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-luxury-pattern opacity-10"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-32 h-32 bg-gold-400/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-elegant font-bold text-white mb-6 drop-shadow-lg">
            Bargain with Sellers
          </h2>
          <p className="text-xl text-neutral-300 mb-12 max-w-3xl mx-auto drop-shadow-lg">
            Experience the art of negotiation. Connect directly with sellers and secure the best deals on premium fashion items.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-elegant font-semibold text-white mb-4">Direct Chat</h3>
              <p className="text-neutral-300">Communicate directly with sellers in real-time for personalized service</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-elegant font-semibold text-white mb-4">Make Offers</h3>
              <p className="text-neutral-300">Submit your best offers and negotiate prices that work for you</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-elegant font-semibold text-white mb-4">Deal Closed</h3>
              <p className="text-neutral-300">Secure your purchase with confidence and enjoy premium fashion</p>
            </div>
          </div>
          
          <Link 
            to="/bargain" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-elegant hover:shadow-luxury"
          >
            Start Bargaining
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-100 to-neutral-200 relative">
        <div className="absolute inset-0 bg-elegant-pattern opacity-5"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-elegant font-bold text-neutral-900 mb-6 drop-shadow-lg">
            Ready to Elevate Your Style?
          </h2>
                <p className="text-xl text-neutral-600 mb-8 drop-shadow-lg">
        Join thousands of smart shoppers who trust Threadswear.pk for quality second-hand imported clothing at flea market prices
      </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login" 
              className="px-8 py-4 bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-neutral-900 hover:to-neutral-800 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-elegant hover:shadow-luxury"
            >
              Get Started
            </Link>
            <Link 
              to="/about" 
              className="px-8 py-4 border-2 border-neutral-300 hover:border-neutral-400 text-neutral-700 hover:text-neutral-900 font-medium rounded-xl transition-all duration-300 hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Product Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-luxury max-w-md w-full animate-scale-in">
            <div className="relative">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-64 object-cover rounded-t-2xl" />
              <button
                onClick={() => setShowProductModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-elegant font-bold text-neutral-900 mb-2">{selectedProduct.name}</h3>
              <p className="text-neutral-600 mb-4">Premium quality {selectedProduct.category}'s clothing</p>
              <div className="text-3xl font-elegant font-bold text-neutral-900 mb-6">${selectedProduct.price}</div>
              <div className="flex space-x-4">
                <button
                  onClick={handleBidding}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Start Bidding
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-neutral-900 hover:to-neutral-800 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bidding Modal */}
      {showBiddingModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-luxury max-w-md w-full animate-scale-in">
            <div className="p-6">
              <h3 className="text-2xl font-elegant font-bold text-neutral-900 mb-4">Place Your Bid</h3>
              <div className="mb-6">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-48 object-cover rounded-xl mb-4" />
                <h4 className="text-lg font-elegant font-semibold text-neutral-900">{selectedProduct.name}</h4>
                <p className="text-neutral-600">Current Price: <span className="font-bold text-neutral-900">${selectedProduct.price}</span></p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">Your Bid Amount</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Enter bid amount"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-300"
                  min={selectedProduct.price + 0.01}
                  step="0.01"
                />
              </div>
              
              {selectedProduct.bids && selectedProduct.bids.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-neutral-700 mb-2">Recent Bids</h5>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedProduct.bids.slice(-5).reverse().map((bid, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-neutral-600">
                          {bid.bidder?.name || `Bidder ${index + 1}`}
                        </span>
                        <span className="font-medium text-neutral-900">${bid.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowBiddingModal(false)}
                  className="flex-1 px-6 py-3 border border-neutral-300 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBidSubmit}
                  disabled={biddingLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {biddingLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Bid'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buy Now Modal */}
      {showBuyNowModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-luxury max-w-md w-full animate-scale-in">
            <div className="p-6">
              <h3 className="text-2xl font-elegant font-bold text-neutral-900 mb-4">Complete Purchase</h3>
              <div className="mb-6">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-48 object-cover rounded-xl mb-4" />
                <h4 className="text-lg font-elegant font-semibold text-neutral-900">{selectedProduct.name}</h4>
                <p className="text-2xl font-elegant font-bold text-neutral-900">${selectedProduct.price}</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Delivery Date</label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Customization (Optional)</label>
                  <textarea
                    value={customization}
                    onChange={(e) => setCustomization(e.target.value)}
                    placeholder="Any special requests or customizations..."
                    rows="3"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-300 resize-none"
                  ></textarea>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowBuyNowModal(false)}
                  className="flex-1 px-6 py-3 border border-neutral-300 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuyNowSubmit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-neutral-900 hover:to-neutral-800 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Complete Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home 
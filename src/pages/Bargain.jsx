import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Bargain = () => {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [offerAmount, setOfferAmount] = useState('')
  const [isNegotiating, setIsNegotiating] = useState(false)

  const bargainProducts = [
    {
      id: 1,
      name: 'Imported Cotton T-Shirt (Pre-owned)',
      originalPrice: 29.99,
      currentPrice: 15.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'men',
      seller: 'Second-Hand Fashion',
      description: 'Quality imported cotton t-shirt, gently used, still in excellent condition.'
    },
    {
      id: 2,
      name: 'Vintage Denim Jacket (Second-hand)',
      originalPrice: 89.99,
      currentPrice: 45.99,
      image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'men',
      seller: 'Flea Market Finds',
      description: 'Authentic vintage denim jacket, imported, shows some wear but still stylish.'
    },
    {
      id: 3,
      name: 'Imported Designer Dress (Pre-loved)',
      originalPrice: 129.99,
      currentPrice: 65.99,
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'women',
      seller: 'Pre-Loved Boutique',
      description: 'Imported designer dress, previously owned but well-maintained, perfect for special occasions.'
    }
  ]

  const startBargain = (product) => {
    setSelectedProduct(product)
    setIsNegotiating(true)
    setMessages([
      {
        id: 1,
        sender: 'seller',
        message: `Hello! I'm ${product.seller}. I'm excited to help you with ${product.name}. What would you like to know about this item?`,
        type: 'message'
      }
    ])
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        sender: 'user',
        message: newMessage,
        type: 'message'
      }
      setMessages([...messages, userMessage])
      setNewMessage('')
      
      // Simulate seller response
      setTimeout(() => {
        const sellerResponse = {
          id: messages.length + 2,
          sender: 'seller',
          message: generateSellerResponse(newMessage),
          type: 'message'
        }
        setMessages(prev => [...prev, sellerResponse])
      }, 1000)
    }
  }

  const makeOffer = () => {
    if (offerAmount && parseFloat(offerAmount) > 0) {
      const offerMessage = {
        id: messages.length + 1,
        sender: 'user',
        message: `I'd like to offer $${offerAmount} for this item.`,
        type: 'offer',
        amount: parseFloat(offerAmount)
      }
      setMessages([...messages, offerMessage])
      setOfferAmount('')
      
      // Simulate seller counter-offer
      setTimeout(() => {
        const counterOffer = generateCounterOffer(parseFloat(offerAmount))
        const sellerResponse = {
          id: messages.length + 2,
          sender: 'seller',
          message: `Thank you for your offer! I can offer you a special price of $${counterOffer}. This is my best price for this premium item.`,
          type: 'counter-offer',
          amount: counterOffer
        }
        setMessages(prev => [...prev, sellerResponse])
      }, 1500)
    }
  }

  const generateSellerResponse = (userMessage) => {
    const responses = [
      "That's a great question! This item is made with premium materials and excellent craftsmanship.",
      "I appreciate your interest! This piece is one of our most popular items due to its quality and design.",
      "You have excellent taste! This item features our signature attention to detail and premium finish.",
      "I'm glad you're considering this piece! It's crafted with the finest materials and designed for lasting elegance."
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const generateCounterOffer = (userOffer) => {
    const discount = Math.random() * 0.15 + 0.05 // 5-20% discount
    return Math.round((selectedProduct.currentPrice * (1 - discount)) * 100) / 100
  }

  const acceptOffer = (amount) => {
    const acceptMessage = {
      id: messages.length + 1,
      sender: 'user',
      message: `Perfect! I accept your offer of $${amount}. Let's proceed with the purchase.`,
      type: 'message'
    }
    setMessages([...messages, acceptMessage])
    
    setTimeout(() => {
      const confirmationMessage = {
        id: messages.length + 2,
        sender: 'seller',
        message: `Excellent! Your purchase is confirmed at $${amount}. You'll receive a confirmation email shortly. Thank you for choosing ${selectedProduct.seller}!`,
        type: 'message'
      }
      setMessages(prev => [...prev, confirmationMessage])
    }, 1000)
  }

  const closeBargain = () => {
    setIsNegotiating(false)
    setSelectedProduct(null)
    setMessages([])
    setNewMessage('')
    setOfferAmount('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <div className="bg-white shadow-elegant border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-elegant font-bold text-neutral-900">Bargain Zone</h1>
              <p className="text-neutral-600 mt-1">Negotiate directly with sellers for the best deals</p>
            </div>
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-xl text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-all duration-300"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Shop
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isNegotiating ? (
          /* Product Selection Grid */
          <div>
            <div className="text-center mb-12">
              <h2 className="text-2xl font-elegant font-bold text-neutral-900 mb-4">Select a Product to Bargain</h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">Choose from our bargain-eligible products and start negotiating with sellers for the best price</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bargainProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-elegant hover:shadow-luxury transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Bargain Available
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-elegant font-semibold text-neutral-900 mb-2">{product.name}</h3>
                    <p className="text-neutral-600 text-sm mb-4">{product.description}</p>
                    <button 
                      onClick={() => startBargain(product)} 
                      className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-elegant hover:shadow-luxury"
                    >
                      Start Bargaining
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Bargaining Interface */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-elegant p-6 sticky top-8">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-48 object-cover rounded-xl mb-4" />
                <h3 className="text-xl font-elegant font-semibold text-neutral-900 mb-2">{selectedProduct.name}</h3>
                <p className="text-neutral-600 text-sm mb-4">{selectedProduct.description}</p>
                <button 
                  onClick={closeBargain} 
                  className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium py-3 px-6 rounded-xl transition-all duration-300"
                >
                  Close Bargain
                </button>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 px-6 py-4">
                  <h3 className="text-white font-semibold">Bargaining with {selectedProduct.seller}</h3>
                </div>
                
                {/* Messages Area */}
                <div className="h-96 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.sender === 'user' 
                          ? 'bg-gradient-to-r from-neutral-800 to-neutral-900 text-white' 
                          : 'bg-neutral-100 text-neutral-900'
                      }`}>
                        {message.type === 'offer' && (
                          <div className="font-bold text-lg">${message.amount}</div>
                        )}
                        {message.type === 'counter-offer' && (
                          <div className="font-bold text-lg">${message.amount}</div>
                        )}
                        <div className="text-sm">{message.message}</div>
                        {message.type === 'counter-offer' && (
                          <button 
                            onClick={() => acceptOffer(message.amount)} 
                            className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors"
                          >
                            Accept Offer
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Input Area */}
                <div className="border-t border-neutral-200 p-6">
                  <div className="flex space-x-4 mb-4">
                    <input
                      type="number"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      placeholder="Enter your offer amount"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-300 text-neutral-900"
                      min="0"
                      step="0.01"
                    />
                    <button 
                      onClick={makeOffer} 
                      disabled={!offerAmount}
                      className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Make Offer
                    </button>
                  </div>
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-300 text-neutral-900"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button 
                      onClick={sendMessage} 
                      disabled={!newMessage.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-neutral-900 hover:to-neutral-800 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Bargain 
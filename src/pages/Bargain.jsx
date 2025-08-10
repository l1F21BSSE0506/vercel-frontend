import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getCurrencyDisplay, convertUSDToPKR, formatPKR } from '../utils/currencyConverter';

const Bargain = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [showCurrency, setShowCurrency] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const bargainProducts = [
    {
      id: 1,
      name: 'Imported Cotton T-Shirt (Pre-owned)',
      originalPrice: 29.99,
      currentPrice: 15.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'men',
      seller: 'Second-Hand Fashion',
      description: 'Quality imported cotton t-shirt, gently used, still in excellent condition.',
      condition: 'excellent',
      size: 'M',
      color: 'White'
    },
    {
      id: 2,
      name: 'Vintage Denim Jacket (Second-hand)',
      originalPrice: 89.99,
      currentPrice: 45.99,
      image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'men',
      seller: 'Flea Market Finds',
      description: 'Authentic vintage denim jacket, imported, shows some wear but still stylish.',
      condition: 'good',
      size: 'L',
      color: 'Blue'
    },
    {
      id: 3,
      name: 'Imported Designer Dress (Pre-loved)',
      originalPrice: 129.99,
      currentPrice: 65.99,
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'women',
      seller: 'Pre-Loved Boutique',
      description: 'Imported designer dress, previously owned but well-maintained, perfect for special occasions.',
      condition: 'excellent',
      size: 'S',
      color: 'Black'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startBargain = (product) => {
    setSelectedProduct(product);
    setIsNegotiating(true);
    setMessages([
      {
        id: 1,
        sender: 'seller',
        message: `Hello! I'm ${product.seller}. I'm excited to help you with ${product.name}. What would you like to know about this item?`,
        type: 'message',
        timestamp: new Date()
      }
    ]);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        sender: 'user',
        message: newMessage,
        type: 'message',
        timestamp: new Date()
      };
      setMessages([...messages, userMessage]);
      setNewMessage('');
      setIsTyping(true);
      
      // Simulate seller response
      setTimeout(() => {
        setIsTyping(false);
        const sellerResponse = {
          id: messages.length + 2,
          sender: 'seller',
          message: generateSellerResponse(newMessage),
          type: 'message',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, sellerResponse]);
      }, 1000 + Math.random() * 2000);
    }
  };

  const makeOffer = () => {
    if (offerAmount.trim() && !isNaN(offerAmount)) {
      const offerMessage = {
        id: messages.length + 1,
        sender: 'user',
        message: `I'd like to offer ${getCurrencyDisplay(offerAmount, showCurrency)} for this item.`,
        type: 'offer',
        amount: parseFloat(offerAmount),
        timestamp: new Date()
      };
      setMessages([...messages, offerMessage]);
      setOfferAmount('');
      setIsTyping(true);
      
      // Simulate seller counter-offer
      setTimeout(() => {
        setIsTyping(false);
        const counterOffer = generateCounterOffer(parseFloat(offerAmount));
        const sellerResponse = {
          id: messages.length + 2,
          sender: 'seller',
          message: `Thank you for your offer! I can offer you ${getCurrencyDisplay(counterOffer, showCurrency)}. What do you think?`,
          type: 'counter-offer',
          amount: counterOffer,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, sellerResponse]);
      }, 1500 + Math.random() * 2000);
    }
  };

  const generateSellerResponse = (userMessage) => {
    const responses = [
      "That's a great question! Let me tell you more about the quality and condition.",
      "I appreciate your interest! This item has been carefully maintained and is in excellent condition.",
      "Great choice! This piece has a lot of character and unique features.",
      "I'm glad you're considering this item. It's definitely worth the investment.",
      "That's a thoughtful question. Let me provide you with all the details you need."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateCounterOffer = (userOffer) => {
    const discount = 0.1 + Math.random() * 0.2; // 10-30% discount
    return Math.round(userOffer * (1 + discount) * 100) / 100;
  };

  const acceptOffer = (amount) => {
    const acceptMessage = {
      id: messages.length + 1,
      sender: 'user',
      message: `Perfect! I accept your offer of ${getCurrencyDisplay(amount, showCurrency)}.`,
      type: 'accept',
      amount: amount,
      timestamp: new Date()
    };
    setMessages([...messages, acceptMessage]);
    
    setTimeout(() => {
      const sellerResponse = {
        id: messages.length + 2,
        sender: 'seller',
        message: `Excellent! I'm so glad we could reach an agreement. The item is yours for ${getCurrencyDisplay(amount, showCurrency)}. I'll send you the payment details shortly.`,
        type: 'message',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, sellerResponse]);
    }, 1000);
  };

  const closeBargain = () => {
    setIsNegotiating(false);
    setSelectedProduct(null);
    setMessages([]);
    setNewMessage('');
    setOfferAmount('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bargain & Negotiate
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find great deals on pre-owned and second-hand clothing. Negotiate directly with sellers to get the best prices!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Available Items
              </h2>
              <div className="space-y-4">
                {bargainProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedProduct?.id === product.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => startBargain(product)}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">
                          {product.seller} • {product.condition} condition
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-green-600">
                            {getCurrencyDisplay(product.currentPrice, showCurrency)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {getCurrencyDisplay(product.originalPrice, showCurrency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
              {isNegotiating ? (
                <div className="h-[600px] flex flex-col">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold">{selectedProduct.name}</h3>
                          <p className="text-blue-100 text-sm">
                            {selectedProduct.seller} • {selectedProduct.condition} condition
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={closeBargain}
                        className="text-white hover:text-blue-200 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex transition-all duration-300 ease-in-out ${
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg transition-all duration-300 ${
                          message.sender === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}>
                          <p className="text-sm">{message.message}</p>
                          {message.amount && (
                            <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                              <span className="text-xs text-blue-600 font-medium">
                                Offer: {getCurrencyDisplay(message.amount, showCurrency)}
                              </span>
                            </div>
                          )}
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start transition-all duration-300 ease-in-out">
                        <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-4 bg-white border-t border-gray-200 rounded-b-xl">
                    <div className="flex space-x-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <button
                        onClick={sendMessage}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        Send
                      </button>
                    </div>
                    
                    {/* Offer Section */}
                    <div className="mt-4 flex space-x-3">
                      <div className="flex-1">
                        <input
                          type="number"
                          value={offerAmount}
                          onChange={(e) => setOfferAmount(e.target.value)}
                          placeholder="Enter your offer amount..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <button
                        onClick={makeOffer}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        Make Offer
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      Start Bargaining
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Select an item from the left to start negotiating with the seller
                    </p>
                    <div className="text-blue-500 animate-bounce">
                      <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bargain; 
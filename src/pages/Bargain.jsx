import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCurrencyDisplay, convertUSDToPKR, formatPKR } from '../utils/currencyConverter';
import { sendMessage, startChat, getChat } from '../services/api';

const Bargain = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [showCurrency, setShowCurrency] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
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

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const startBargain = async (product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSelectedProduct(product);
    setIsNegotiating(true);
    setLoading(true);

    try {
      // Start a new chat with the seller
      const initialMessage = `Hi! I'm interested in ${product.name}. Can you tell me more about this item?`;
      
      const response = await startChat({
        productId: product.id,
        message: initialMessage
      });

      if (response.success) {
        setCurrentChat(response.data);
        setMessages(response.data.messages);
      } else {
        console.error('Failed to start chat:', response.message);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentChat) return;

    const messageToSend = newMessage.trim();
    setNewMessage('');
    setLoading(true);

    try {
      // Add message to local state immediately for better UX
      const tempMessage = {
        _id: Date.now(), // Temporary ID
        senderId: user._id,
        message: messageToSend,
        timestamp: new Date(),
        isRead: false
      };
      setMessages(prev => [...prev, tempMessage]);

      // Send message to backend
      const response = await sendMessage(currentChat._id, messageToSend);

      if (response.success) {
        // Update with real message from backend
        setMessages(response.data.messages);
        setCurrentChat(response.data);
      } else {
        // Remove temporary message if failed
        setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
        console.error('Failed to send message:', response.message);
      }
    } catch (error) {
      // Remove temporary message if failed
      setMessages(prev => prev.filter(msg => msg._id !== Date.now()));
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const makeOffer = async () => {
    if (!offerAmount.trim() || !currentChat) return;

    const offerMessage = `I'd like to offer ${getCurrencyDisplay(offerAmount, showCurrency)} for this item.`;
    setOfferAmount('');
    setLoading(true);

    try {
      const response = await sendMessage(currentChat._id, offerMessage);

      if (response.success) {
        setMessages(response.data.messages);
        setCurrentChat(response.data);
      } else {
        console.error('Failed to send offer:', response.message);
      }
    } catch (error) {
      console.error('Error sending offer:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeBargain = () => {
    setIsNegotiating(false);
    setSelectedProduct(null);
    setCurrentChat(null);
    setMessages([]);
    setNewMessage('');
    setOfferAmount('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isOwnMessage = (message) => {
    return message.senderId === user?._id;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to access the bargain chat.</p>
          <Link to="/login" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bargain & Negotiate
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chat directly with sellers to negotiate prices and get the best deals on pre-owned clothing!
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
                    {loading && messages.length === 0 ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    ) : (
                      <>
                        {messages.map((message) => (
                          <div
                            key={message._id}
                            className={`flex transition-all duration-300 ease-in-out ${
                              isOwnMessage(message) ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg transition-all duration-300 ${
                              isOwnMessage(message)
                                ? 'bg-blue-500 text-white' 
                                : 'bg-white text-gray-800 border border-gray-200'
                            }`}>
                              <p className="text-sm">{message.message}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {formatTime(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        {loading && (
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
                      </>
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
                          disabled={loading}
                        />
                      </div>
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || loading}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          disabled={loading}
                        />
                      </div>
                      <button
                        onClick={makeOffer}
                        disabled={!offerAmount.trim() || loading}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
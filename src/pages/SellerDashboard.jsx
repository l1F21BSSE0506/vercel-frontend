import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatAPI, productsAPI } from '../services/api';
import { getCurrencyDisplay } from '../utils/currencyConverter';

const SellerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chats');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Chat state
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // Products state
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalChats: 0,
    activeChats: 0
  });

  // Check authentication and role on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'seller' && user?.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch seller's products
      const productsResponse = await productsAPI.getSellerProducts();
      setProducts(productsResponse.data.products || []);
      
      // Fetch seller's chats
      const chatsResponse = await chatAPI.getMyChats();
      const sellerChats = chatsResponse.data.filter(chat => 
        chat.sellerId._id === user._id || chat.sellerId === user._id
      );
      setChats(sellerChats);
      
      // Calculate stats
      setStats({
        totalProducts: productsResponse.data.products?.length || 0,
        totalChats: sellerChats.length,
        activeChats: sellerChats.filter(chat => chat.status === 'active').length
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    setSendingMessage(true);
    try {
      const response = await chatAPI.sendMessage(selectedChat._id, newMessage.trim());
      
      if (response.success) {
        // Update the chat in the list
        setChats(prevChats => 
          prevChats.map(chat => 
            chat._id === selectedChat._id ? response.data : chat
          )
        );
        
        // Update selected chat
        setSelectedChat(response.data);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getUnreadCount = (chat) => {
    return chat.messages.filter(msg => 
      !msg.isRead && msg.senderId !== user._id
    ).length;
  };

  const markChatAsRead = async (chatId) => {
    try {
      await chatAPI.markAsRead(chatId);
      // Update local state
      setChats(prevChats => 
        prevChats.map(chat => 
          chat._id === chatId 
            ? { ...chat, messages: chat.messages.map(msg => ({ ...msg, isRead: true })) }
            : chat
        )
      );
    } catch (error) {
      console.error('Error marking chat as read:', error);
    }
  };

  if (!isAuthenticated || (user?.role !== 'seller' && user?.role !== 'admin')) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-lg font-semibold text-blue-600 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Chats</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalChats}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Chats</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeChats}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('chats')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'chats'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Customer Chats
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Products
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'chats' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chat List */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Conversations</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {chats.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No customer chats yet</p>
                    ) : (
                      chats.map((chat) => {
                        const unreadCount = getUnreadCount(chat);
                        const lastMessage = chat.messages[chat.messages.length - 1];
                        const isSelected = selectedChat?._id === chat._id;
                        
                        return (
                          <div
                            key={chat._id}
                            onClick={() => {
                              setSelectedChat(chat);
                              if (unreadCount > 0) {
                                markChatAsRead(chat._id);
                              }
                            }}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900 text-sm">
                                {chat.productId?.name || 'Product'}
                              </h4>
                              {unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-1">
                              {chat.buyerId?.name || 'Customer'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {lastMessage?.message || 'No messages yet'}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {formatDate(chat.lastMessageAt)}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Chat Interface */}
                <div className="lg:col-span-2">
                  {selectedChat ? (
                    <div className="bg-white border border-gray-200 rounded-lg h-96 flex flex-col">
                      {/* Chat Header */}
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {selectedChat.productId?.name || 'Product'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Chat with {selectedChat.buyerId?.name || 'Customer'}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            selectedChat.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedChat.status}
                          </span>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {selectedChat.messages.map((message) => (
                          <div
                            key={message._id}
                            className={`flex ${message.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-xs px-3 py-2 rounded-lg ${
                              message.senderId === user._id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              <p className="text-sm">{message.message}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {formatTime(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Message Input */}
                      <div className="p-4 border-t border-gray-200">
                        <div className="flex space-x-3">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={sendingMessage}
                          />
                          <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || sendingMessage}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                          >
                            {sendingMessage ? 'Sending...' : 'Send'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-lg h-96 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-lg font-medium">Select a chat to start messaging</p>
                        <p className="text-sm">Choose a customer conversation from the left to respond to their inquiries</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">My Products</h3>
                {products.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No products listed yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div key={product._id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <img
                          src={product.images?.[0] || 'https://via.placeholder.com/300x200'}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
                        <p className="text-lg font-bold text-green-600 mb-2">
                          {getCurrencyDisplay(product.price, true)}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            product.isAvailable 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.isAvailable ? 'Available' : 'Sold'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard; 
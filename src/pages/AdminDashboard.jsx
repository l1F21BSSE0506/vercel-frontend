import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI, chatAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Chat state
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    condition: 'New',
    category: '',
    size: '',
    brand: '',
    images: [''],
    isAvailable: true,
    biddingEnabled: false,
    currentBid: '',
    minBidIncrement: ''
  });
  
  const [editProductImage, setEditProductImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Only allow admin access
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, user, navigate, currentPage, searchTerm, selectedCategory]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats using API service
      const statsResponse = await productsAPI.getAll({ admin: true });
      setStats(statsResponse.data.stats);

      // Fetch products with pagination using API service
      const productsResponse = await productsAPI.getAll({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        category: selectedCategory,
        admin: true
      });
      setProducts(productsResponse.data.products);
      setTotalPages(productsResponse.data.pagination.pages);
      
      // Fetch admin's chats
      const chatsResponse = await chatAPI.getMyChats();
      setChats(chatsResponse.data);
      
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      // Create form data for file upload
      const formData = new FormData();
      
      // Add all product details to formData
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        currentBid: newProduct.currentBid ? parseFloat(newProduct.currentBid) : undefined,
        minBidIncrement: newProduct.minBidIncrement ? parseFloat(newProduct.minBidIncrement) : undefined,
        images: newProduct.images.filter(img => img.trim() !== '')
      };
      
      Object.keys(productData).forEach(key => {
        formData.append(key, typeof productData[key] === 'object' ? 
          JSON.stringify(productData[key]) : productData[key]);
      });
      
      // Add image file if selected
      if (productImage) {
        formData.append('productImage', productImage);
      }
      
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          // Note: Don't set Content-Type with FormData, browser will set it with boundary
        },
        body: formData
      });

      if (response.ok) {
        setShowAddForm(false);
        setNewProduct({
          name: '', description: '', price: '', condition: 'New',
          category: '', size: '', brand: '', images: [''],
          isAvailable: true, biddingEnabled: false, currentBid: '', minBidIncrement: ''
        });
        setProductImage(null);
        setImagePreview('');
        fetchDashboardData();
      }
    } catch (err) {
      setError('Failed to add product');
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditProductImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      // Create form data for file upload
      const formData = new FormData();
      
      // Add all product details to formData
      const productData = {
        ...editingProduct,
        price: parseFloat(editingProduct.price),
        currentBid: editingProduct.currentBid ? parseFloat(editingProduct.currentBid) : undefined,
        minBidIncrement: editingProduct.minBidIncrement ? parseFloat(editingProduct.minBidIncrement) : undefined
      };
      
      Object.keys(productData).forEach(key => {
        formData.append(key, typeof productData[key] === 'object' ? 
          JSON.stringify(productData[key]) : productData[key]);
      });
      
      // Add image file if selected
      if (editProductImage) {
        formData.append('productImage', editProductImage);
      }
      
      const response = await fetch(`/api/admin/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          // Note: Don't set Content-Type with FormData, browser will set it with boundary
        },
        body: formData
      });

      if (response.ok) {
        setEditingProduct(null);
        setEditProductImage(null);
        setEditImagePreview('');
        fetchDashboardData();
      }
    } catch (err) {
      setError('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          fetchDashboardData();
        }
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  const addSampleProducts = async () => {
    try {
      const response = await fetch('/api/admin/seed-products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      setError('Failed to add sample products');
    }
  };

  // Handle sending a message in the selected chat
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;
    
    try {
      await chatAPI.sendMessage(selectedChat._id, newMessage);
      setNewMessage('');
      // Refresh the chat to show the new message
      const chatResponse = await chatAPI.getChat(selectedChat._id);
      setSelectedChat(chatResponse.data);
      
      // Also update the chats list
      const chatsResponse = await chatAPI.getMyChats();
      setChats(chatsResponse.data);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };
  
  if (loading) return <LoadingSpinner text="Loading admin dashboard..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your products, users, messages, and view statistics</p>
        </div>
        
        {/* Dashboard Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`${activeTab === 'dashboard' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`${activeTab === 'products' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`${activeTab === 'messages' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Messages
              </button>
              <button
                onClick={() => setActiveTab('finances')}
                className={`${activeTab === 'finances' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Finances
              </button>
            </nav>
          </div>
        </div>

        {/* Conditional Content Based on Active Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Total Products</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Available Products</h3>
              <p className="text-3xl font-bold text-green-600">{stats.availableProducts}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Bidding Products</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.biddingProducts}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
              <p className="text-3xl font-bold text-orange-600">{stats.totalUsers}</p>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Customer Messages</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
              {/* Chat List */}
              <div className="border-r border-gray-200 overflow-y-auto h-full">
                {chats.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No messages yet</div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {chats.map((chat) => (
                      <li 
                        key={chat._id} 
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedChat?._id === chat._id ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedChat(chat)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-gray-600">{chat.buyerId?.name?.charAt(0) || 'U'}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {chat.buyerId?.name || 'Unknown User'}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {chat.productId?.name || 'Unknown Product'}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${chat.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {chat.status === 'active' ? 'Active' : 'Closed'}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Chat Messages */}
              <div className="col-span-2 flex flex-col h-full">
                {selectedChat ? (
                  <>
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {selectedChat.buyerId?.name || 'Unknown User'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Product: {selectedChat.productId?.name || 'Unknown Product'}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedChat.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {selectedChat.status === 'active' ? 'Active' : 'Closed'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-4 overflow-y-auto">
                      {selectedChat.messages.map((message, index) => (
                        <div 
                          key={index} 
                          className={`mb-4 flex ${message.senderId?._id === user?._id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${message.senderId?._id === user?._id ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'}`}>
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(message.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {selectedChat.status === 'active' && (
                      <div className="p-4 border-t border-gray-200">
                        <form onSubmit={handleSendMessage} className="flex space-x-2">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                          />
                          <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                          >
                            Send
                          </button>
                        </form>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Select a conversation to view messages</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Finances Tab */}
        {activeTab === 'finances' && (
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Financial Overview</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
                  <p className="text-3xl font-bold text-green-600">$12,450.00</p>
                  <p className="text-sm text-gray-500 mt-2">+15% from last month</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900">Pending Payments</h3>
                  <p className="text-3xl font-bold text-yellow-600">$2,380.00</p>
                  <p className="text-sm text-gray-500 mt-2">5 transactions pending</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900">Total Orders</h3>
                  <p className="text-3xl font-bold text-blue-600">142</p>
                  <p className="text-sm text-gray-500 mt-2">+8% from last month</p>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <tr key={item}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">ORD-{1000 + item}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Customer {item}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Product {item}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(Math.random() * 1000).toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item % 3 === 0 ? 'bg-yellow-100 text-yellow-800' : item % 2 === 0 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                              {item % 3 === 0 ? 'Pending' : item % 2 === 0 ? 'Completed' : 'Processing'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(Date.now() - item * 86400000).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Products Tab - Actions */}
        {activeTab === 'products' && (
          <>
            <div className="bg-white rounded-lg shadow mb-8 p-6">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add New Product
                </button>
                <button
                  onClick={addSampleProducts}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Add Sample Products
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow mb-8 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">All Categories</option>
                  {stats?.categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Products</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={product.images[0] || '/placeholder.jpg'}
                                alt={product.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Add Product Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
              <form onSubmit={handleAddProduct}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2 md:col-span-2"
                    rows="3"
                    required
                  />
                  <select
                    value={newProduct.condition}
                    onChange={(e) => setNewProduct({...newProduct, condition: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Size"
                    value={newProduct.size}
                    onChange={(e) => setNewProduct({...newProduct, size: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Brand"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <span className="text-sm text-gray-500">or</span>
                      <input
                        type="url"
                        placeholder="Image URL"
                        value={newProduct.images[0]}
                        onChange={(e) => setNewProduct({...newProduct, images: [e.target.value]})}
                        className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
                      />
                    </div>
                    {imagePreview && (
                      <div className="mt-3">
                        <img 
                          src={imagePreview} 
                          alt="Product preview" 
                          className="h-32 w-32 object-cover border rounded"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newProduct.isAvailable}
                        onChange={(e) => setNewProduct({...newProduct, isAvailable: e.target.checked})}
                        className="mr-2"
                      />
                      Available
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newProduct.biddingEnabled}
                        onChange={(e) => setNewProduct({...newProduct, biddingEnabled: e.target.checked})}
                        className="mr-2"
                      />
                      Enable Bidding
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
              <form onSubmit={handleUpdateProduct}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2 md:col-span-2"
                    rows="3"
                    required
                  />
                  <select
                    value={editingProduct.condition}
                    onChange={(e) => setEditingProduct({...editingProduct, condition: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Category"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Size"
                    value={editingProduct.size}
                    onChange={(e) => setEditingProduct({...editingProduct, size: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Brand"
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageChange}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <span className="text-sm text-gray-500">or</span>
                      <input
                        type="url"
                        placeholder="Image URL"
                        value={editingProduct.images?.[0] || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, images: [e.target.value]})}
                        className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
                      />
                    </div>
                    {editImagePreview ? (
                      <div className="mt-3">
                        <img 
                          src={editImagePreview} 
                          alt="Product preview" 
                          className="h-32 w-32 object-cover border rounded"
                        />
                      </div>
                    ) : editingProduct.images?.[0] ? (
                      <div className="mt-3">
                        <img 
                          src={editingProduct.images[0]} 
                          alt="Current product" 
                          className="h-32 w-32 object-cover border rounded"
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingProduct.isAvailable}
                        onChange={(e) => setEditingProduct({...editingProduct, isAvailable: e.target.checked})}
                        className="mr-2"
                      />
                      Available
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingProduct.biddingEnabled}
                        onChange={(e) => setEditingProduct({...editingProduct, biddingEnabled: e.target.checked})}
                        className="mr-2"
                      />
                      Enable Bidding
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Update Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_BASE_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:5000/api';

const SellerDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Check authentication and role on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'admin') {
      navigate('/login');
      return;
    }

    fetchUserData();
    fetchDashboardData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to fetch user data');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch stats
      const statsResponse = await axios.get(`${API_BASE_URL}/users/admin/stats`, { headers });
      const productsResponse = await axios.get(`${API_BASE_URL}/products/admin/all`, { headers });
      const ordersResponse = await axios.get(`${API_BASE_URL}/orders/admin/all`, { headers });
      const usersResponse = await axios.get(`${API_BASE_URL}/auth/admin/users`, { headers });

      setStats({
        totalProducts: productsResponse.data.count,
        totalOrders: ordersResponse.data.count,
        totalUsers: usersResponse.data.count,
        totalRevenue: ordersResponse.data.totalAmount || 0
      });
      
      setProducts(productsResponse.data.products);
      setOrders(ordersResponse.data.orders);
      setUsers(usersResponse.data.users);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const updateProductStatus = async (productId, isAvailable) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/products/admin/${productId}/status`, 
        { isAvailable }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const updateOrderStatus = async (orderId, orderStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/orders/admin/${orderId}`, 
        { orderStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <header className="bg-white shadow-elegant border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-neutral-900 to-neutral-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                T
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-neutral-900">Threadswear.pk</h1>
                <p className="text-sm text-neutral-600">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-neutral-600">Welcome, {user?.name}</span>
              <button 
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: '📊' },
              { id: 'products', name: 'Products', icon: '👕' },
              { id: 'orders', name: 'Orders', icon: '📦' },
              { id: 'users', name: 'Users', icon: '👥' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-neutral-900 text-white shadow-elegant'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-neutral-900">Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-elegant p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <span className="text-2xl">👕</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-600">Total Products</p>
                    <p className="text-2xl font-bold text-neutral-900">{stats.totalProducts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-elegant p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-600">Total Orders</p>
                    <p className="text-2xl font-bold text-neutral-900">{stats.totalOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-elegant p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-600">Total Users</p>
                    <p className="text-2xl font-bold text-neutral-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-elegant p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-neutral-900">₹{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-elegant p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div>
                        <p className="font-medium text-neutral-900">Order #{order._id.slice(-6)}</p>
                        <p className="text-sm text-neutral-600">{order.user?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-neutral-900">₹{order.totalPrice}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-elegant p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Products</h3>
                <div className="space-y-3">
                  {products.slice(0, 5).map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div>
                        <p className="font-medium text-neutral-900">{product.name}</p>
                        <p className="text-sm text-neutral-600">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-neutral-900">₹{product.price}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Management */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-neutral-900">Products Management</h2>
              <button className="btn-primary">Add New Product</button>
            </div>
            
            <div className="bg-white rounded-xl shadow-elegant overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center">
                              <span className="text-neutral-600">👕</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-neutral-900">{product.name}</div>
                              <div className="text-sm text-neutral-500">{product.brand}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">₹{product.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">{product.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => updateProductStatus(product._id, !product.isAvailable)}
                            className={`mr-2 px-3 py-1 rounded-md text-xs ${
                              product.isAvailable 
                                ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            {product.isAvailable ? 'Disable' : 'Enable'}
                          </button>
                          <button className="text-neutral-600 hover:text-neutral-900">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Management */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-neutral-900">Orders Management</h2>
            
            <div className="bg-white rounded-xl shadow-elegant overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                          #{order._id.slice(-6)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900">{order.user?.name}</div>
                          <div className="text-sm text-neutral-500">{order.user?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">₹{order.totalPrice}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="text-sm border border-neutral-300 rounded-md px-2 py-1"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-neutral-600 hover:text-neutral-900">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Management */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-neutral-900">Users Management</h2>
            
            <div className="bg-white rounded-xl shadow-elegant overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                              <span className="text-neutral-600 font-medium">{user.name.charAt(0)}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-neutral-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-neutral-600 hover:text-neutral-900 mr-2">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard; 
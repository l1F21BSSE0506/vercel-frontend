import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const { user } = useAuth();
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

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchDashboardData();
    }
  }, [user, currentPage, searchTerm, selectedCategory]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const statsData = await statsResponse.json();
      setStats(statsData.stats);

      // Fetch products with pagination
      const productsResponse = await fetch(
        `/api/admin/products?page=${currentPage}&limit=10&search=${searchTerm}&category=${selectedCategory}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const productsData = await productsResponse.json();
      setProducts(productsData.products);
      setTotalPages(productsData.pagination.pages);
      
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          currentBid: newProduct.currentBid ? parseFloat(newProduct.currentBid) : undefined,
          minBidIncrement: newProduct.minBidIncrement ? parseFloat(newProduct.minBidIncrement) : undefined,
          images: newProduct.images.filter(img => img.trim() !== '')
        })
      });

      if (response.ok) {
        setShowAddForm(false);
        setNewProduct({
          name: '', description: '', price: '', condition: 'New',
          category: '', size: '', brand: '', images: [''],
          isAvailable: true, biddingEnabled: false, currentBid: '', minBidIncrement: ''
        });
        fetchDashboardData();
      }
    } catch (err) {
      setError('Failed to add product');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...editingProduct,
          price: parseFloat(editingProduct.price),
          currentBid: editingProduct.currentBid ? parseFloat(editingProduct.currentBid) : undefined,
          minBidIncrement: editingProduct.minBidIncrement ? parseFloat(editingProduct.minBidIncrement) : undefined
        })
      });

      if (response.ok) {
        setEditingProduct(null);
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

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSpinner text="Loading admin dashboard..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your products, users, and view statistics</p>
        </div>

        {/* Stats Cards */}
        {stats && (
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

        {/* Actions */}
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
                          <div className="text-sm text-gray-500">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

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
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={newProduct.images[0]}
                    onChange={(e) => setNewProduct({...newProduct, images: [e.target.value]})}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
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
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const navigate = useNavigate()
  const { login, isAuthenticated, user } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'seller' || user?.role === 'admin') {
        navigate('/seller-dashboard')
      } else {
        navigate('/')
      }
    }
  }, [isAuthenticated, user, navigate])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      const result = await authAPI.register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role
      })
      
      if (result.data.success) {
        setSuccess('Account created successfully! Redirecting to login...')
        
        // Auto-login after successful registration
        setTimeout(async () => {
          try {
            const loginResult = await login({
              email: formData.email.trim().toLowerCase(),
              password: formData.password
            })
            
            if (loginResult.success) {
              // Redirect will be handled by useEffect
            } else {
              navigate('/login')
            }
          } catch (error) {
            navigate('/login')
          }
        }, 2000)
      } else {
        setError(result.data.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Pattern and Floating Elements */}
      <div className="absolute inset-0 bg-elegant-pattern opacity-5"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gold-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary-400/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Header with Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-3 mb-8 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl flex items-center justify-center shadow-elegant group-hover:shadow-luxury transition-all duration-300">
                <span className="text-white font-elegant font-bold text-xl">T</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <span className="font-elegant font-bold text-3xl text-neutral-900">Threadswear.pk</span>
          </Link>
          <h2 className="text-3xl font-elegant font-bold text-neutral-900 mb-2">Create Account</h2>
          <p className="text-neutral-600 text-lg">Join our second-hand fashion marketplace</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-luxury p-8 border border-neutral-200/50">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-neutral-700 mb-2">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300 placeholder-neutral-400"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300 placeholder-neutral-400"
                placeholder="Enter your email address"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-neutral-700 mb-2">Account Type</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300 bg-white"
              >
                <option value="buyer">Buyer - Browse and purchase items</option>
                <option value="seller">Seller - List and sell your items</option>
              </select>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300 placeholder-neutral-400"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-neutral-500">Password must be at least 6 characters long</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-neutral-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300 placeholder-neutral-400"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-neutral-900 hover:to-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-all duration-300 hover:scale-105 shadow-elegant hover:shadow-luxury disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-neutral-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-gold-600 hover:text-gold-500 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup 
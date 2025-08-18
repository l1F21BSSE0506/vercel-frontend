import React, { useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Waiting from './pages/Waiting'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Bargain from './pages/Bargain'
import SellerDashboard from './pages/SellerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AdminSetup from './pages/AdminSetup'

function App() {
  const [chatHandler, setChatHandler] = useState(null)

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar onOpenChatList={() => chatHandler?.() || null} />
            <main className="pt-16 lg:pt-20">
              <Routes>
                <Route path="/" element={<Home onSetChatHandler={setChatHandler} />} />
                <Route path="/about" element={<About />} />
                <Route path="/waiting" element={<Waiting />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/bargain" element={<Bargain />} />
                <Route path="/seller-dashboard" element={<SellerDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin-setup" element={<AdminSetup />} />
                <Route path="/test" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Test Route Working!</h1></div>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App 
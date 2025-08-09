import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Waiting from './pages/Waiting'
import Login from './pages/Login'
import Bargain from './pages/Bargain'
import SellerDashboard from './pages/SellerDashboard'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main className="pt-16 lg:pt-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/waiting" element={<Waiting />} />
                <Route path="/login" element={<Login />} />
                <Route path="/bargain" element={<Bargain />} />
                <Route path="/seller-dashboard" element={<SellerDashboard />} />
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
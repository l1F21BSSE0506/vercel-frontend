import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
  const values = [
    {
      icon: '🎯',
      title: 'Quality First',
      description: 'We never compromise on quality. Every piece in our collection meets the highest standards.'
    },
    {
      icon: '🌱',
      title: 'Sustainable Fashion',
      description: 'Committed to eco-friendly practices and sustainable materials in our production process.'
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'Constantly pushing boundaries to bring you the latest trends and cutting-edge designs.'
    },
    {
      icon: '🤝',
      title: 'Customer Focus',
      description: 'Your satisfaction is our priority. We listen, adapt, and deliver what you truly want.'
    }
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      bio: 'Passionate about fashion and sustainability, Sarah leads our mission to revolutionize the clothing industry.'
    },
    {
      name: 'Michael Chen',
      role: 'Creative Director',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      bio: 'With over 10 years in fashion design, Michael brings creativity and innovation to every collection.'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      bio: 'Emma ensures smooth operations and exceptional customer experience across all touchpoints.'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '500+', label: 'Products' },
    { number: '50+', label: 'Countries Served' },
    { number: '98%', label: 'Satisfaction Rate' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 animate-slide-up">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 animate-fade-in">
              From a small passion project to a global fashion destination, we're dedicated to bringing you the best in style and quality.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
                      <p className="text-lg text-gray-600 mb-6">
          At Threadswear.pk, we believe that everyone deserves access to quality fashion at affordable prices. Our mission is to provide carefully curated second-hand imported clothing that offers both style and value, making fashion accessible to everyone.
        </p>
                      <p className="text-lg text-gray-600 mb-8">
          Founded in 2020, we started with a simple idea: make quality imported fashion accessible to everyone through our second-hand marketplace. Today, we're proud to serve customers across Pakistan with our commitment to quality, affordability, and sustainable fashion choices.
        </p>
              <Link to="/waiting" className="btn-primary">
                Explore Our Collection
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🌟</div>
                  <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">
                    Vision 2025
                  </h3>
                  <p className="text-gray-700">
                    To become the leading sustainable fashion brand, inspiring positive change in the industry while delivering exceptional style and quality to our customers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and every decision we make
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          The passionate individuals behind Threadswear.pk's second-hand fashion marketplace
        </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card overflow-hidden text-center">
                <div className="relative">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
          Join the Threadswear.pk Community
        </h2>
                      <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Be part of our journey as we continue to make quality fashion accessible and sustainable through our second-hand marketplace
            </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/waiting" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              Shop Now
            </Link>
            <Link to="/" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About 
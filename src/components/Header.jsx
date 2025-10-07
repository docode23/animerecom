import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import DonationButton from './DonationButton'

const Header = () => {
  const location = useLocation()
  
  return (
    <header className="vintage-paper retro-border border-b-4 border-retro-brown sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link to="/" className="flex items-center space-x-2 md:space-x-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-retro-brown retro-border flex items-center justify-center">
              <span className="text-vintage-paper text-xl md:text-2xl font-bold">🎬</span>
            </div>
            <div>
              <h1 className="retro-title text-xl md:text-2xl lg:text-3xl">
                Retro Anime Finder
              </h1>
              <p className="vintage-subtitle text-xs md:text-sm lg:text-base">
                Discover your next classic adventure
              </p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Donation Button - Always Visible */}
            <DonationButton className="order-1" />
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-4 lg:space-x-6 order-2">
              <Link 
                to="/" 
                className={`retro-text font-bold px-3 py-2 transition-colors text-sm lg:text-base ${
                  location.pathname === '/' 
                    ? 'text-retro-orange border-b-2 border-retro-orange' 
                    : 'text-vintage-ink hover:text-retro-brown'
                }`}
              >
                QUIZ
              </Link>
              {location.pathname === '/results' && (
                <span className="retro-text font-bold px-3 py-2 text-retro-orange border-b-2 border-retro-orange text-sm lg:text-base">
                  RESULTS
                </span>
              )}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Decorative border */}
      <div className="h-2 bg-gradient-to-r from-retro-brown via-retro-orange to-retro-brown"></div>
    </header>
  )
}

export default Header

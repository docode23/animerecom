import React, { useState } from 'react'

const DonationButton = ({ className = "" }) => {
  const [showQR, setShowQR] = useState(false)

  return (
    <div className={`relative ${className}`}>
      {/* Donation Button */}
      <button
        onClick={() => setShowQR(!showQR)}
        className="retro-button bg-retro-gold hover:bg-retro-orange text-vintage-ink font-bold px-3 py-2 sm:px-4 text-xs sm:text-sm shadow-lg transform hover:scale-105 transition-all duration-200"
      >
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="text-sm sm:text-base">💰</span>
          <div className="text-left">
            <div className="text-xs leading-tight">Help me fight my</div>
            <div className="text-xs leading-tight font-bold">COLLEGE BACKLOG!</div>
          </div>
        </div>
      </button>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="vintage-card max-w-sm w-full relative">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-2 right-2 w-8 h-8 bg-retro-brown retro-border flex items-center justify-center text-vintage-paper font-bold hover:bg-retro-red"
            >
              ×
            </button>
            
            <div className="p-6 text-center">
              <h3 className="retro-title text-lg mb-3 text-vintage-ink">
                Save a Student! 🎓
              </h3>
              
              <p className="text-sm text-vintage-ink mb-4 leading-relaxed">
                Your donation helps me survive college and keep building cool anime apps! 
                Every rupee counts in the battle against academic doom! 📚⚔️
              </p>
              
              <div className="bg-white p-4 retro-border inline-block mb-4">
                <img 
                  src="/donation-qr.png" 
                  alt="Donation QR Code"
                  className="w-48 h-48 mx-auto"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'block'
                  }}
                />
                <div className="hidden text-vintage-ink text-sm p-4">
                  QR Code not found. Please add donation-qr.png to public folder.
                </div>
              </div>
              
              <p className="text-xs text-vintage-ink opacity-75">
                Scan with any UPI app to donate
              </p>
              
              <div className="mt-4 text-xs text-vintage-ink">
                <span className="retro-badge bg-retro-purple">UPI</span>
                <span className="retro-badge bg-retro-blue ml-1">GPay</span>
                <span className="retro-badge bg-retro-green ml-1">PhonePe</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DonationButton

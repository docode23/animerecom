import React from 'react'

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`loading-spinner ${sizeClasses[size]} mb-2`}></div>
      <p className="retro-text text-vintage-ink text-sm">{text}</p>
    </div>
  )
}

export default LoadingSpinner

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'retro-cream': '#F5F5DC',
        'retro-brown': '#8B4513',
        'retro-orange': '#FF8C00',
        'retro-red': '#DC143C',
        'retro-green': '#228B22',
        'retro-blue': '#4169E1',
        'retro-purple': '#8A2BE2',
        'retro-gold': '#FFD700',
        'vintage-paper': '#FDF5E6',
        'vintage-ink': '#2F4F4F',
      },
      fontFamily: {
        'retro': ['Courier New', 'monospace'],
        'vintage': ['Georgia', 'serif'],
      },
      boxShadow: {
        'retro': '4px 4px 0px 0px rgba(0,0,0,0.3)',
        'vintage': '2px 2px 8px rgba(0,0,0,0.2)',
      },
      animation: {
        'flicker': 'flicker 2s infinite alternate',
        'typewriter': 'typewriter 3s steps(40) 1s 1 normal both',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        typewriter: {
          'from': { width: '0' },
          'to': { width: '100%' },
        }
      }
    },
  },
  plugins: [],
}

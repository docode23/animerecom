import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Quiz from './components/Quiz'
import Results from './components/Results'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-vintage-paper via-retro-cream to-vintage-paper">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </main>
      
      {/* Vintage texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-5 bg-repeat" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B4513' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
           }}>
      </div>
    </div>
  )
}

export default App

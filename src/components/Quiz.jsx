import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DonationButton from './DonationButton'

const Quiz = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({
    genres: [],
    mood: '',
    pacing: '',
    target_audience: '',
    complexity: ''
  })
  const [vocabularies, setVocabularies] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load vocabularies from the generated index
    fetch('/anime-index.json')
      .then(res => res.json())
      .then(data => {
        setVocabularies(data.metadata.vocabularies)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load anime data:', err)
        setLoading(false)
      })
  }, [])

  // Curated options for better user experience
  const questions = [
    {
      id: 'genres',
      title: 'What genres spark your interest?',
      subtitle: 'Select all that appeal to you (choose 2-4)',
      type: 'multiple',
      options: [
        'action', 'adventure', 'comedy', 'drama', 'fantasy', 
        'romance', 'sci-fi', 'horror', 'mystery', 'slice of life',
        'sports', 'supernatural', 'historical', 'mecha'
      ]
    },
    {
      id: 'mood',
      title: 'What mood are you seeking?',
      subtitle: 'Choose the vibe that calls to you',
      type: 'single',
      options: [
        'adventurous', 'emotional', 'hilarious', 'intense', 
        'melancholic', 'inspiring', 'dark', 'wholesome', 'epic'
      ]
    },
    {
      id: 'pacing',
      title: 'How do you prefer your story paced?',
      subtitle: 'Select your preferred rhythm',
      type: 'single',
      options: [
        'fast', 'medium', 'slow', 'episodic', 'very_fast'
      ]
    },
    {
      id: 'target_audience',
      title: 'What audience level suits you?',
      subtitle: 'Choose your comfort zone',
      type: 'single',
      options: [
        'family', 'teen', 'teen_adult', 'mature', 'all_ages'
      ]
    },
    {
      id: 'complexity',
      title: 'How complex should the narrative be?',
      subtitle: 'Select your preferred depth',
      type: 'single',
      options: [
        'low', 'medium', 'high', 'very_high'
      ]
    }
  ]

  const handleAnswer = (questionId, value) => {
    if (questions[currentStep].type === 'multiple') {
      const currentAnswers = answers[questionId] || []
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(a => a !== value)
        : [...currentAnswers, value]
      setAnswers(prev => ({ ...prev, [questionId]: newAnswers }))
    } else {
      setAnswers(prev => ({ ...prev, [questionId]: value }))
    }
  }

  const canProceed = () => {
    const currentQuestion = questions[currentStep]
    const currentAnswer = answers[currentQuestion.id]
    
    if (currentQuestion.type === 'multiple') {
      return currentAnswer && currentAnswer.length > 0
    }
    return currentAnswer && currentAnswer.trim() !== ''
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Navigate to results with answers
      const searchParams = new URLSearchParams()
      Object.entries(answers).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          searchParams.set(key, JSON.stringify(value))
        } else {
          searchParams.set(key, value)
        }
      })
      navigate(`/results?${searchParams.toString()}`)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="retro-text text-vintage-ink">Loading anime database...</p>
        </div>
      </div>
    )
  }

  if (!vocabularies) {
    return (
      <div className="text-center py-12">
        <div className="vintage-card max-w-md mx-auto">
          <h2 className="retro-title text-xl mb-4">Database Error</h2>
          <p className="text-vintage-ink">Failed to load anime data. Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="retro-text text-sm text-vintage-ink">
            Question {currentStep + 1} of {questions.length}
          </span>
          <span className="retro-text text-sm text-vintage-ink">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-vintage-paper retro-border h-4">
          <div 
            className="h-full bg-gradient-to-r from-retro-brown to-retro-orange transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="vintage-card mb-8">
        <div className="text-center mb-8">
          <h2 className="retro-title text-2xl md:text-3xl mb-4">
            {currentQuestion.title}
          </h2>
          <p className="vintage-subtitle text-lg">
            {currentQuestion.subtitle}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {currentQuestion.type === 'multiple' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentQuestion.options.map((option) => (
                <label 
                  key={option}
                  className="flex items-center p-4 vintage-paper retro-border cursor-pointer hover:bg-retro-cream transition-colors"
                >
                  <input
                    type="checkbox"
                    className="retro-checkbox"
                    checked={answers[currentQuestion.id]?.includes(option) || false}
                    onChange={() => handleAnswer(currentQuestion.id, option)}
                  />
                  <span className="retro-text capitalize font-medium text-vintage-ink">
                    {option.replace(/_/g, ' ')}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => (
                <label 
                  key={option}
                  className="flex items-center p-4 vintage-paper retro-border cursor-pointer hover:bg-retro-cream transition-colors"
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    className="retro-checkbox"
                    checked={answers[currentQuestion.id] === option}
                    onChange={() => handleAnswer(currentQuestion.id, option)}
                  />
                  <span className="retro-text capitalize font-medium text-vintage-ink">
                    {option.replace(/_/g, ' ')}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`retro-button ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          ← Previous
        </button>

        <div className="flex space-x-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 retro-border ${
                index <= currentStep ? 'bg-retro-orange' : 'bg-vintage-paper'
              }`}
            ></div>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`retro-button ${!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {currentStep === questions.length - 1 ? 'Get Recommendations →' : 'Next →'}
        </button>
      </div>

      {/* Donation Section */}
      <div className="mt-8 pt-6 border-t-2 border-retro-brown">
        <div className="text-center">
          <p className="text-sm text-vintage-ink mb-4">
            💡 <strong>Pro tip:</strong> Support the developer to unlock premium features like advanced filters! 
            (Just kidding, but your donation really helps! 😄)
          </p>
          <DonationButton className="inline-block" />
        </div>
      </div>
    </div>
  )
}

export default Quiz

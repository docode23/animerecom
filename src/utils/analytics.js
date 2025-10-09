// Google Analytics utility functions

export const trackEvent = (action, category = 'User Interaction', label = '', value = 0) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    })
  }
}

export const trackQuizStart = () => {
  trackEvent('quiz_start', 'Quiz', 'User started anime quiz')
}

export const trackQuizComplete = (preferences) => {
  trackEvent('quiz_complete', 'Quiz', 'User completed anime quiz')
  
  // Track specific preferences for insights
  if (preferences.genres?.length) {
    trackEvent('genres_selected', 'Quiz', preferences.genres.join(','))
  }
  if (preferences.mood) {
    trackEvent('mood_selected', 'Quiz', preferences.mood)
  }
}

export const trackRecommendationView = (animeTitle, rank) => {
  trackEvent('recommendation_view', 'Recommendations', animeTitle, rank)
}

export const trackRecommendationClick = (animeTitle, rank) => {
  trackEvent('recommendation_click', 'Recommendations', animeTitle, rank)
}

export const trackDonationClick = () => {
  trackEvent('donation_click', 'Monetization', 'Donation button clicked')
}

export const trackRetakeQuiz = () => {
  trackEvent('retake_quiz', 'Quiz', 'User retook the quiz')
}

export const trackSearchError = (errorMessage) => {
  trackEvent('search_error', 'Error', errorMessage)
}

export const trackPageView = (pageName) => {
  if (typeof gtag !== 'undefined') {
    gtag('config', 'G-L8818GNGH8', {
      page_title: pageName,
      page_location: window.location.href
    })
  }
}

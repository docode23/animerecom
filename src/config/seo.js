// SEO Configuration for Retro Anime Recommender

export const seoConfig = {
  // Base site information
  siteName: "Retro Anime Recommender",
  siteUrl: "https://your-domain.com", // Replace with your actual domain
  defaultTitle: "Retro Anime Recommender - Find Your Perfect Anime Match",
  defaultDescription: "Discover your next favorite anime with our intelligent recommendation engine. Take our personalized quiz and get curated anime suggestions based on your preferences, mood, and viewing style.",
  defaultKeywords: "anime recommendations, anime finder, anime quiz, anime discovery, personalized anime, anime suggestion engine, find anime, anime database, anime matcher",
  defaultImage: "https://your-domain.com/og-image.jpg",
  
  // Social media handles (optional)
  social: {
    twitter: "@YourTwitterHandle", // Replace with your Twitter handle
    facebook: "YourFacebookPage", // Replace with your Facebook page
  },
  
  // Analytics
  googleAnalyticsId: "G-L8818GNGH8",
  
  // Organization schema
  organization: {
    name: "Retro Anime Recommender",
    url: "https://your-domain.com",
    logo: "https://your-domain.com/logo.png",
    description: "A personalized anime recommendation platform helping users discover their perfect anime matches through intelligent algorithms and user preferences."
  },
  
  // Page-specific SEO configurations
  pages: {
    home: {
      title: "Retro Anime Recommender - Find Your Perfect Anime Match",
      description: "Take our personalized anime quiz to discover your next favorite series. Get intelligent recommendations based on your preferences, mood, and viewing style.",
      keywords: "anime quiz, anime recommendations, find anime, personalized anime, anime discovery tool",
      path: "/"
    },
    quiz: {
      title: "Anime Quiz - Find Your Perfect Anime Match | Retro Anime Recommender",
      description: "Take our personalized anime quiz to discover your next favorite series. Answer questions about your preferences and get tailored anime recommendations.",
      keywords: "anime quiz, anime personality test, find anime, anime recommendations quiz, personalized anime finder, anime discovery quiz",
      path: "/"
    },
    results: {
      titleTemplate: "Anime Recommendations: {topAnime} | Retro Anime Recommender",
      descriptionTemplate: "Discover anime like {topAnime} based on your preferences for {genres}. Get personalized anime recommendations with our intelligent matching system.",
      keywordsTemplate: "{topAnime}, {genres}, anime recommendations, personalized anime, anime finder",
      path: "/results"
    }
  },
  
  // Common anime genres for SEO
  popularGenres: [
    "action", "adventure", "comedy", "drama", "fantasy", 
    "romance", "sci-fi", "horror", "mystery", "slice of life",
    "sports", "supernatural", "historical", "mecha"
  ],
  
  // Popular anime combinations for sitemap generation
  popularCombinations: [
    {
      genres: ["action", "adventure"],
      mood: "exciting",
      pacing: "fast",
      description: "Action-packed adventure anime recommendations"
    },
    {
      genres: ["romance", "comedy"],
      mood: "lighthearted",
      pacing: "relaxed",
      description: "Romantic comedy anime recommendations"
    },
    {
      genres: ["fantasy", "adventure"],
      mood: "epic",
      pacing: "moderate",
      description: "Epic fantasy adventure anime recommendations"
    },
    {
      genres: ["sci-fi", "drama"],
      mood: "thoughtful",
      pacing: "slow",
      description: "Thoughtful sci-fi drama anime recommendations"
    },
    {
      genres: ["slice of life", "comedy"],
      mood: "relaxing",
      pacing: "slow",
      description: "Relaxing slice of life anime recommendations"
    }
  ]
}

// Helper functions for SEO
export const generatePageTitle = (pageKey, data = {}) => {
  const pageConfig = seoConfig.pages[pageKey]
  if (!pageConfig) return seoConfig.defaultTitle
  
  if (pageConfig.titleTemplate && data.topAnime) {
    return pageConfig.titleTemplate.replace('{topAnime}', data.topAnime)
  }
  
  return pageConfig.title || seoConfig.defaultTitle
}

export const generatePageDescription = (pageKey, data = {}) => {
  const pageConfig = seoConfig.pages[pageKey]
  if (!pageConfig) return seoConfig.defaultDescription
  
  if (pageConfig.descriptionTemplate && data.topAnime && data.genres) {
    return pageConfig.descriptionTemplate
      .replace('{topAnime}', data.topAnime)
      .replace('{genres}', data.genres)
  }
  
  return pageConfig.description || seoConfig.defaultDescription
}

export const generatePageKeywords = (pageKey, data = {}) => {
  const pageConfig = seoConfig.pages[pageKey]
  if (!pageConfig) return seoConfig.defaultKeywords
  
  if (pageConfig.keywordsTemplate && data.topAnime && data.genres) {
    return pageConfig.keywordsTemplate
      .replace('{topAnime}', data.topAnime)
      .replace('{genres}', data.genres)
  }
  
  return pageConfig.keywords || seoConfig.defaultKeywords
}

export const generateCanonicalUrl = (path = '') => {
  return `${seoConfig.siteUrl}${path}`
}

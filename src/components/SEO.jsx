import { useEffect } from 'react'

const SEO = ({ 
  title = "Retro Anime Recommender - Find Your Perfect Anime Match",
  description = "Discover your next favorite anime with our intelligent recommendation engine. Take our personalized quiz and get curated anime suggestions based on your preferences, mood, and viewing style.",
  keywords = "anime recommendations, anime finder, anime quiz, anime discovery, personalized anime, anime suggestion engine, find anime, anime database, anime matcher",
  image = "https://your-domain.com/og-image.jpg",
  url = "https://your-domain.com/",
  type = "website",
  structuredData = null
}) => {
  useEffect(() => {
    // Update document title
    document.title = title

    // Update meta tags
    const updateMetaTag = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let element = document.querySelector(selector)
      
      if (element) {
        element.setAttribute('content', content)
      } else {
        element = document.createElement('meta')
        if (property) {
          element.setAttribute('property', name)
        } else {
          element.setAttribute('name', name)
        }
        element.setAttribute('content', content)
        document.head.appendChild(element)
      }
    }

    // Update basic meta tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    
    // Update Open Graph tags
    updateMetaTag('og:title', title, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:image', image, true)
    updateMetaTag('og:url', url, true)
    updateMetaTag('og:type', type, true)
    
    // Update Twitter tags
    updateMetaTag('twitter:title', title, true)
    updateMetaTag('twitter:description', description, true)
    updateMetaTag('twitter:image', image, true)
    updateMetaTag('twitter:url', url, true)

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      canonical.setAttribute('href', url)
    } else {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      canonical.setAttribute('href', url)
      document.head.appendChild(canonical)
    }

    // Add structured data if provided
    if (structuredData) {
      let structuredDataScript = document.querySelector('#structured-data')
      if (structuredDataScript) {
        structuredDataScript.textContent = JSON.stringify(structuredData)
      } else {
        structuredDataScript = document.createElement('script')
        structuredDataScript.id = 'structured-data'
        structuredDataScript.type = 'application/ld+json'
        structuredDataScript.textContent = JSON.stringify(structuredData)
        document.head.appendChild(structuredDataScript)
      }
    }

    // Track page view with Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('config', 'G-L8818GNGH8', {
        page_title: title,
        page_location: url
      })
    }
  }, [title, description, keywords, image, url, type, structuredData])

  return null // This component doesn't render anything
}

export default SEO

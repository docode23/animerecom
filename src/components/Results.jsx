import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getRecommendations, formatAnimeForDisplay } from '../utils/recommendations'
import AnimeCard from './AnimeCard'
import DonationButton from './DonationButton'
import SEO from './SEO'
import { trackRetakeQuiz, trackSearchError } from '../utils/analytics'

const Results = () => {
  const [searchParams] = useSearchParams()
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userPrefs, setUserPrefs] = useState(null)

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        // Parse user preferences from URL params
        const prefs = {
          genres: JSON.parse(searchParams.get('genres') || '[]'),
          mood: searchParams.get('mood') || '',
          pacing: searchParams.get('pacing') || '',
          target_audience: searchParams.get('target_audience') || '',
          complexity: searchParams.get('complexity') || ''
        }
        
        setUserPrefs(prefs)
        
        // Load anime database
        const response = await fetch('/anime-index.json')
        if (!response.ok) {
          throw new Error('Failed to load anime database')
        }
        
        const animeDatabase = await response.json()
        
        // Get recommendations
        const recs = getRecommendations(prefs, animeDatabase, 15)
        const formattedRecs = recs.map(formatAnimeForDisplay)
        
        // Debug logging
        console.log('User preferences:', prefs)
        console.log('All 15 recommendations:', formattedRecs.map(r => ({
          title: r.title,
          similarity: r.similarity,
          genres: r.genres
        })))
        
        // Fetch AniList data for all recommendations with proper rate limiting
        const recsWithAniList = await fetchAniListDataForAll(formattedRecs)
        
        setRecommendations(recsWithAniList)
        setLoading(false)
      } catch (err) {
        console.error('Error loading recommendations:', err)
        trackSearchError(err.message)
        setError(err.message);
        setLoading(false);
      }
    };
    
    loadRecommendations();
  }, [searchParams]);

  // Fetch AniList data in parallel batches for performance
  const fetchAniListDataForAll = async (animeList) => {
    console.log(`Fetching AniList data for ${animeList.length} anime...`);
    const allResults = [];
    const CHUNK_SIZE = 5; // Fetch 5 anime at a time

    for (let i = 0; i < animeList.length; i += CHUNK_SIZE) {
      const chunk = animeList.slice(i, i + CHUNK_SIZE);
      console.log(`Fetching batch ${i / CHUNK_SIZE + 1}...`);

      const chunkPromises = chunk.map(async (anime) => {
        try {
          const cleanTitle = anime.title.replace(/[^\w\s:!-]/g, '').replace(/\s+/g, ' ').trim();
          
          const query = `
            query ($search: String) {
              Media(search: $search, type: ANIME) {
                id, title { romaji, english }, coverImage { large }, description(asHtml: false), averageScore, genres, studios { nodes { name } }, startDate { year }, episodes, status
              }
            }
          `;

          const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ query, variables: { search: cleanTitle } })
          });

          if (!response.ok) {
            console.warn(`HTTP ${response.status} for \"${anime.title}\"`);
            return anime; // Return original anime on failure
          }

          const data = await response.json();

          if (data.errors) {
            console.warn(`AniList API errors for \"${anime.title}\":`, data.errors);
            return anime;
          }

          if (data.data?.Media) {
            console.log(`✓ Found: ${anime.title}`);
            return { ...anime, anilistData: data.data.Media };
          } else {
            console.warn(`✗ Not Found: ${anime.title}`);
            return anime;
          }
        } catch (error) {
          console.error(`✗ Fetch Error for \"${anime.title}\":`, error.message);
          return anime;
        }
      });

      // Wait for the current batch to complete
      const batchResults = await Promise.all(chunkPromises);
      allResults.push(...batchResults);

      // Wait before processing the next batch to respect rate limits
      if (i + CHUNK_SIZE < animeList.length) {
        console.log('Waiting 1 second before next batch...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Completed AniList fetching. ${allResults.filter(r => r.anilistData).length}/${allResults.length} successful`);
    return allResults;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="retro-text text-vintage-ink text-lg">
            Searching through the archives...
          </p>
          <p className="vintage-subtitle text-sm mt-2">
            Finding matches & fetching cover art from AniList
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="vintage-card max-w-md mx-auto">
          <h2 className="retro-title text-xl mb-4 text-retro-red">Error</h2>
          <p className="text-vintage-ink mb-4">{error}</p>
          <Link to="/" className="retro-button inline-block">
            Try Again
          </Link>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="vintage-card max-w-md mx-auto">
          <h2 className="retro-title text-xl mb-4">No Matches Found</h2>
          <p className="text-vintage-ink mb-4">
            We couldn't find any anime matching your preferences. Try adjusting your selections.
          </p>
          <Link to="/" className="retro-button inline-block" onClick={() => trackRetakeQuiz()}>
            Take Quiz Again
          </Link>
        </div>
      </div>
    )
  }

  // Generate dynamic SEO data based on recommendations
  const generateSEOData = () => {
    if (!recommendations.length || !userPrefs) return {}

    const topAnime = recommendations.slice(0, 3).map(anime => anime.title).join(', ')
    const genres = userPrefs.genres.join(', ').replace(/_/g, ' ')
    
    const title = `Anime Recommendations: ${topAnime} | Retro Anime Recommender`
    const description = `Discover anime like ${topAnime} based on your preferences for ${genres}. Get personalized anime recommendations with our intelligent matching system.`
    const keywords = `${topAnime}, ${genres}, anime recommendations, personalized anime, anime finder`
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Personalized Anime Recommendations",
      "description": description,
      "numberOfItems": recommendations.length,
      "itemListElement": recommendations.slice(0, 10).map((anime, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Movie",
          "name": anime.title,
          "genre": anime.genres || [],
          "description": anime.anilistData?.description || `Anime recommendation based on your preferences`,
          "image": anime.anilistData?.coverImage?.large,
          "aggregateRating": anime.anilistData?.averageScore ? {
            "@type": "AggregateRating",
            "ratingValue": anime.anilistData.averageScore / 10,
            "bestRating": 10
          } : undefined
        }
      }))
    }

    return { title, description, keywords, structuredData }
  }

  const seoData = generateSEOData()

  return (
    <div className="max-w-7xl mx-auto">
      {/* SEO Component */}
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        url={`https://your-domain.com/results?${searchParams.toString()}`}
        structuredData={seoData.structuredData}
      />
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="retro-title text-3xl md:text-4xl mb-4">
          Your Anime Recommendations
        </h1>
        <p className="vintage-subtitle text-lg mb-6">
          Curated based on your preferences
        </p>
        
        {/* User Preferences Summary */}
        {userPrefs && (
          <div className="vintage-card max-w-4xl mx-auto mb-8">
            <h3 className="retro-text font-bold text-lg mb-4 text-vintage-ink">
              Your Selections:
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {userPrefs.genres.map(genre => (
                <span key={genre} className="retro-badge">
                  {genre.replace(/_/g, ' ')}
                </span>
              ))}
              {userPrefs.mood && (
                <span className="retro-badge bg-retro-blue">
                  {userPrefs.mood.replace(/_/g, ' ')}
                </span>
              )}
              {userPrefs.pacing && (
                <span className="retro-badge bg-retro-green">
                  {userPrefs.pacing.replace(/_/g, ' ')}
                </span>
              )}
              {userPrefs.target_audience && (
                <span className="retro-badge bg-retro-purple">
                  {userPrefs.target_audience.replace(/_/g, ' ')}
                </span>
              )}
              {userPrefs.complexity && (
                <span className="retro-badge bg-retro-red">
                  {userPrefs.complexity.replace(/_/g, ' ')}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Donation Section - Prominent */}
      <div className="mb-8">
        <div className="vintage-card bg-gradient-to-r from-retro-gold to-retro-orange p-6 text-center">
          <h3 className="retro-title text-xl mb-2 text-vintage-ink">
            🎓 Enjoying the recommendations? 
          </h3>
          <p className="text-sm text-vintage-ink mb-4 max-w-2xl mx-auto">
            Help me survive college and keep building awesome anime discovery tools! 
            Your support keeps the servers running and my caffeine levels optimal! ☕
          </p>
          <DonationButton className="inline-block" />
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12 justify-items-center">
        {recommendations.map((anime, index) => (
          <AnimeCard 
            key={`${anime.title}-${index}`} 
            anime={anime} 
            rank={index + 1}
          />
        ))}
      </div>

      {/* Footer Actions */}
      <div className="text-center space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="retro-button" onClick={() => trackRetakeQuiz()}>
            ← Take Quiz Again
          </Link>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="retro-button"
          >
            ↑ Back to Top
          </button>
        </div>
        
        <div className="vintage-card max-w-2xl mx-auto">
          <p className="vintage-subtitle text-sm">
            <strong>Pro Tip:</strong> These recommendations are based on content similarity, 
            ratings, and popularity. Each anime is scored based on how well it matches 
            your preferences. The similarity score shows how closely it aligns with your taste!
          </p>
        </div>
      </div>
    </div>
  )
}

export default Results

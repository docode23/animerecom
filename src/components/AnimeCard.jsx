import React, { useState } from 'react'
import { trackRecommendationView, trackRecommendationClick } from '../utils/analytics'

const AnimeCard = ({ anime, rank }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  // Use pre-fetched AniList data
  const anilistData = anime.anilistData

  const getScoreColor = (score) => {
    if (score >= 8.5) return 'text-retro-green'
    if (score >= 7.5) return 'text-retro-orange'
    if (score >= 6.5) return 'text-retro-blue'
    return 'text-retro-red'
  }

  const getSimilarityColor = (similarity) => {
    if (similarity >= 8) return 'bg-retro-green'
    if (similarity >= 6) return 'bg-retro-orange'
    if (similarity >= 4) return 'bg-retro-blue'
    return 'bg-retro-red'
  }

  const getEpisodeLength = (episodes) => {
    if (episodes === 1) return 'Movie'
    if (episodes <= 13) return 'Short'
    if (episodes <= 26) return 'Standard'
    if (episodes <= 50) return 'Long'
    return 'Very Long'
  }


  const cleanDescription = (desc) => {
    if (!desc) return 'No description available.'
    return desc.replace(/<[^>]*>/g, '').substring(0, 200) + '...'
  }

  return (
    <div className="anime-card vintage-card relative overflow-hidden w-full">
      {/* Rank Badge */}
      <div className="absolute top-2 left-2 w-6 h-5 sm:w-8 sm:h-6 bg-retro-brown retro-border flex items-center justify-center z-20">
        <span className="text-vintage-paper retro-text font-bold text-xs">#{rank}</span>
      </div>

      {/* Cover Image Section */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-retro-brown to-retro-orange mb-2 sm:mb-3">
        {anilistData?.coverImage?.large && !imageError ? (
          <img
            src={anilistData.coverImage.large}
            alt={anime.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-vintage-paper p-3">
              <div className="text-3xl mb-2">🎬</div>
              <div className="retro-text text-sm font-bold leading-tight">
                {anime.title.length > 20 ? anime.title.substring(0, 20) + '...' : anime.title}
              </div>
            </div>
          </div>
        )}
        
        {/* Rating overlay */}
        <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 flex items-center space-x-1">
          <div className="bg-vintage-paper retro-border px-1 py-1 sm:px-2">
            <span className={`retro-text font-bold text-xs ${getScoreColor(anilistData?.averageScore ? anilistData.averageScore / 10 : anime.rating || 7.0)}`}>
              ★ {anilistData?.averageScore ? (anilistData.averageScore / 10).toFixed(1) : anime.rating || '7.0'}
            </span>
          </div>
          <div className="bg-retro-brown retro-border px-1 py-1">
            <span className="text-vintage-paper retro-text font-bold text-xs">
              {anilistData?.startDate?.year || anime.year || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section - Responsive */}
      <div className="px-2 pb-2 sm:px-3 sm:pb-3">
        {/* Title */}
        <h3 className="retro-title text-sm sm:text-base mb-1 sm:mb-2 text-vintage-ink leading-tight">
          {anime.title}
        </h3>

        {/* English Title */}
        {anilistData?.title?.english && anilistData.title.english !== anime.title && (
          <div className="text-xs text-vintage-ink italic mb-2 text-center">
            "{anilistData.title.english}"
          </div>
        )}

        {/* Episode Info */}
        <div className="flex justify-center items-center mb-2 sm:mb-3">
          <div className="retro-badge bg-vintage-ink text-xs">
            {anilistData?.episodes ? `${getEpisodeLength(anilistData.episodes)} • ${anilistData.episodes} EP` : 
             anime.episodes ? `${getEpisodeLength(anime.episodes)} • ${anime.episodes} EP` : 'Episodes: Unknown'}
          </div>
        </div>

        {/* Genres from AniList */}
        <div className="mb-2 sm:mb-3">
          <div className="flex flex-wrap gap-1 justify-center">
            {(anilistData?.genres || anime.genres || []).slice(0, 2).map(genre => (
              <span key={genre} className="retro-badge text-xs">
                {genre.replace(/_/g, ' ').toUpperCase()}
              </span>
            ))}
            {(anilistData?.genres || anime.genres || []).length > 2 && (
              <span className="retro-badge bg-vintage-ink text-xs">
                +{(anilistData?.genres || anime.genres || []).length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Synopsis - Compact for mobile */}
        {anilistData?.description && (
          <div className="mb-2 sm:mb-3 p-2 bg-retro-cream retro-border">
            <p className="text-xs text-vintage-ink leading-relaxed">
              {window.innerWidth < 640 ? 
                cleanDescription(anilistData.description).substring(0, 100) + '...' :
                cleanDescription(anilistData.description)
              }
            </p>
          </div>
        )}

        {/* Studio Info */}
        {anilistData?.studios?.nodes?.[0] && (
          <div className="text-center mb-2 sm:mb-3">
            <span className="retro-badge bg-retro-purple text-xs">
              {anilistData.studios.nodes[0].name}
            </span>
          </div>
        )}

        {/* AniList Button */}
        {anilistData?.id ? (
          <a
            href={`https://anilist.co/anime/${anilistData.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full retro-button bg-retro-brown hover:bg-retro-orange text-center block text-xs py-2"
            onClick={() => trackRecommendationClick(anime.title, rank)}
          >
            VIEW ON ANILIST →
          </a>
        ) : (
          <a
            href={`https://anilist.co/search/anime?search=${encodeURIComponent(anime.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full retro-button bg-retro-brown hover:bg-retro-orange text-center block text-xs py-2"
            onClick={() => trackRecommendationClick(anime.title, rank)}
          >
            SEARCH ON ANILIST →
          </a>
        )}
      </div>
    </div>
  )
}

export default AnimeCard

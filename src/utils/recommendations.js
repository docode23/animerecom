// Recommendation algorithm for anime matching

export const computeSimilarity = (userPrefs, anime) => {
  let preferenceScore = 0;
  let matchCount = 0;

  // Define the maximum possible score from preferences
  const MAX_PREFERENCE_SCORE = 50 + 35 + 25 + 15 + 10; // 135

  // --- Preference Matching --- 

  // 1. Genre matching (very high weight - 50 points)
  if (userPrefs.genres && userPrefs.genres.length > 0 && anime.features.genres) {
    const animeGenres = Array.isArray(anime.features.genres) ? anime.features.genres : [];
    const genreOverlap = animeGenres.filter(g => userPrefs.genres.includes(g)).length;
    if (genreOverlap > 0) {
      // Score is proportional to how many selected genres overlap
      const genreScore = (genreOverlap / userPrefs.genres.length) * 50;
      preferenceScore += genreScore;
      matchCount++;
    }
  }

  // 2. Mood matching (high weight - 35 points)
  if (userPrefs.mood && anime.features.mood) {
    let animeMoods = anime.features.mood;
    if (typeof animeMoods === 'string') {
      try { animeMoods = JSON.parse(animeMoods); } catch (e) { animeMoods = [animeMoods]; }
    }
    if (Array.isArray(animeMoods) && animeMoods.includes(userPrefs.mood)) {
      preferenceScore += 35;
      matchCount++;
    }
  }

  // 3. Pacing matching (medium weight - 25 points)
  if (userPrefs.pacing && anime.features.pacing === userPrefs.pacing) {
    preferenceScore += 25;
    matchCount++;
  }

  // 4. Target audience matching (medium weight - 15 points)
  if (userPrefs.target_audience && anime.features.target_audience === userPrefs.target_audience) {
    preferenceScore += 15;
    matchCount++;
  }

  // 5. Complexity matching (low weight - 10 points)
  if (userPrefs.complexity && anime.features.complexity === userPrefs.complexity) {
    preferenceScore += 10;
    matchCount++;
  }

  // If no preferences match at all, heavily penalize the score.
  if (matchCount === 0) {
    return 0;
  }

  // --- Normalization and Bonuses --- 

  // Normalize preference score to be out of 85 (leaving 15 for bonuses)
  const normalizedPreferenceScore = (preferenceScore / MAX_PREFERENCE_SCORE) * 85;

  let finalScore = normalizedPreferenceScore;

  // Add small bonuses for quality and popularity (max 15 points total)
  if (anime.numerics) {
    // Quality bonus (max 10 points)
    finalScore += (anime.numerics.rating || 0) * 10;
    // Popularity bonus (max 5 points)
    finalScore += (anime.numerics.popularity || 0) * 5;
  }

  // Final score is capped at 100
  return Math.min(Math.round(finalScore), 100);
};

export const getRecommendations = (userPrefs, animeDatabase, limit = 15) => {
  if (!animeDatabase || !animeDatabase.anime) {
    return [];
  }
  
  // Calculate scores for all anime
  const scoredAnime = animeDatabase.anime.map(anime => ({
    ...anime,
    similarity_score: computeSimilarity(userPrefs, anime)
  }));
  
  // Sort by score descending
  scoredAnime.sort((a, b) => b.similarity_score - a.similarity_score);
  
  // Apply strict diversity filter
  const diverseResults = [];
  const titlesSeen = new Set();
  const genreCounts = {};
  const settingCounts = {};
  const studioApprox = {}; // Approximate studio grouping by year/genre

  for (const anime of scoredAnime) {
    // Skip if we have enough results
    if (diverseResults.length >= limit) break;
    
    // Skip exact duplicates or very similar titles
    const normalizedTitle = anime.base_title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (titlesSeen.has(normalizedTitle)) continue;
    
    // Skip if title is too similar to existing ones
    let tooSimilar = false;
    for (const existingTitle of titlesSeen) {
      if (normalizedTitle.includes(existingTitle) || existingTitle.includes(normalizedTitle)) {
        if (Math.abs(normalizedTitle.length - existingTitle.length) < 3) {
          tooSimilar = true;
          break;
        }
      }
    }
    if (tooSimilar) continue;
    
    // Check genre diversity (max 2 per primary genre)
    const primaryGenre = anime.features.genres[0];
    if (primaryGenre) {
      genreCounts[primaryGenre] = (genreCounts[primaryGenre] || 0) + 1;
      if (genreCounts[primaryGenre] > 2) continue;
    }
    
    // Check setting diversity (max 2 per setting)
    const setting = anime.features.setting;
    if (setting) {
      settingCounts[setting] = (settingCounts[setting] || 0) + 1;
      if (settingCounts[setting] > 2) continue;
    }
    
    // Approximate studio grouping (same year + similar genre = likely same studio)
    const studioKey = `${anime.numerics.year}_${primaryGenre}`;
    studioApprox[studioKey] = (studioApprox[studioKey] || 0) + 1;
    if (studioApprox[studioKey] > 1) continue;
    
    titlesSeen.add(normalizedTitle);
    diverseResults.push(anime);
  }
  
  return diverseResults.slice(0, limit);
};

export const formatAnimeForDisplay = (anime) => {
  return {
    title: anime.base_title,
    genres: anime.features.genres,
    mood: anime.features.mood,
    rating: anime.raw.rating,
    year: anime.raw.year,
    episodes: anime.raw.episodes,
    popularity: anime.raw.popularity,
    similarity: Math.round(anime.similarity_score * 10) / 10,
    themes: anime.features.themes,
    setting: anime.features.setting,
    art_style: anime.features.art_style,
    pacing: anime.features.pacing,
    target_audience: anime.features.target_audience,
    complexity: anime.features.complexity
  };
};

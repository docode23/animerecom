import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const CSV_PATH = path.join(__dirname, '..', 'enhanced_anime_database.csv');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'anime-index.json');

console.log('🎬 Building anime recommendation index...');

// Ensure public directory exists
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Read and parse CSV
const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim());
const headers = lines[0].split(',');

console.log(`📊 Processing ${lines.length - 1} anime entries...`);

// Parse CSV data
const animeData = [];
const genreSet = new Set();
const moodSet = new Set();
const complexitySet = new Set();
const pacingSet = new Set();
const targetAudienceSet = new Set();
const themeSet = new Set();
const settingSet = new Set();
const artStyleSet = new Set();

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;
  
  try {
    // Parse CSV line (handling quoted fields)
    const fields = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim());
    
    if (fields.length < headers.length) continue;
    
    // Parse genres (handle array-like strings)
    let genres = [];
    try {
      const genreStr = fields[4].replace(/'/g, '"');
      if (genreStr.startsWith('[') && genreStr.endsWith(']')) {
        genres = JSON.parse(genreStr);
      } else {
        genres = [genreStr];
      }
    } catch {
      genres = [fields[4]];
    }
    
    // Clean and normalize data
    const cleanGenres = genres.map(g => g.toLowerCase().trim()).filter(g => g);
    const themes = fields[9] ? fields[9].split('_').map(t => t.toLowerCase().trim()) : [];
    
    cleanGenres.forEach(g => genreSet.add(g));
    themes.forEach(t => themeSet.add(t));
    moodSet.add(fields[5]?.toLowerCase().trim());
    complexitySet.add(fields[6]?.toLowerCase().trim());
    pacingSet.add(fields[7]?.toLowerCase().trim());
    targetAudienceSet.add(fields[8]?.toLowerCase().trim());
    settingSet.add(fields[10]?.toLowerCase().trim());
    artStyleSet.add(fields[11]?.toLowerCase().trim());
    
    // Normalize numeric values
    const episodes = parseInt(fields[1]) || 0;
    const year = parseInt(fields[2]) || 1980;
    const rating = parseFloat(fields[3]) || 0;
    const popularity = parseFloat(fields[12]) || 0;
    
    // Create anime entry
    const anime = {
      base_title: fields[0],
      features: {
        genres: cleanGenres,
        mood: fields[5]?.toLowerCase().trim(),
        complexity: fields[6]?.toLowerCase().trim(),
        pacing: fields[7]?.toLowerCase().trim(),
        target_audience: fields[8]?.toLowerCase().trim(),
        themes: themes,
        setting: fields[10]?.toLowerCase().trim(),
        art_style: fields[11]?.toLowerCase().trim()
      },
      numerics: {
        episodes: episodes,
        year: year,
        rating: rating / 10, // normalize to 0-1
        popularity: popularity / 100, // normalize to 0-1
        episodes_bucket: episodes <= 13 ? 0.2 : episodes <= 50 ? 0.5 : 0.8,
        year_norm: Math.max(0, Math.min(1, (year - 1980) / (2024 - 1980)))
      },
      raw: {
        episodes: episodes,
        year: year,
        rating: rating,
        popularity: popularity
      }
    };
    
    animeData.push(anime);
  } catch (error) {
    console.warn(`⚠️  Skipping malformed line ${i}: ${error.message}`);
  }
}

// Create vocabulary mappings
const vocabularies = {
  genres: Array.from(genreSet).filter(g => g).sort(),
  moods: Array.from(moodSet).filter(m => m).sort(),
  complexity: Array.from(complexitySet).filter(c => c).sort(),
  pacing: Array.from(pacingSet).filter(p => p).sort(),
  target_audience: Array.from(targetAudienceSet).filter(t => t).sort(),
  themes: Array.from(themeSet).filter(t => t).sort(),
  settings: Array.from(settingSet).filter(s => s).sort(),
  art_styles: Array.from(artStyleSet).filter(a => a).sort()
};

// Create final index
const index = {
  metadata: {
    total_anime: animeData.length,
    generated_at: new Date().toISOString(),
    vocabularies: vocabularies
  },
  anime: animeData
};

// Write to file
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2));

console.log(`✅ Successfully processed ${animeData.length} anime entries`);
console.log(`📝 Vocabularies: ${vocabularies.genres.length} genres, ${vocabularies.themes.length} themes`);
console.log(`💾 Index saved to: ${OUTPUT_PATH}`);
console.log('🎉 Build complete!');

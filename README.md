# 🎬 Retro Anime Recommender

A vintage-styled anime recommendation app built with React, Tailwind CSS, and Vite. Get personalized anime recommendations based on your preferences with a classic, retro aesthetic.

## ✨ Features

- **Retro Design**: Old-school vintage styling with classic typography and color schemes
- **Smart Recommendations**: Advanced algorithm that matches your preferences across multiple dimensions
- **5-Question Quiz**: Simple but comprehensive preference collection
- **Detailed Results**: Rich anime cards with ratings, genres, themes, and more
- **Responsive Design**: Works beautifully on desktop and mobile
- **Fast Performance**: Built with Vite for lightning-fast development and builds

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- pnpm (recommended package manager)
- Your anime CSV data file

### Installation

1. **Clone or download the project**
   ```bash
   cd ANIME
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build the anime index**
   ```bash
   pnpm run prebuild
   ```

4. **Start development server**
   ```bash
   pnpm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 Data Format

The app expects your CSV file (`enhanced_anime_database.csv`) with these columns:
- `base_title` - Anime title
- `episodes` - Number of episodes
- `year` - Release year
- `rating` - Rating score (0-10)
- `genres` - JSON array of genres like `['Action', 'Adventure']`
- `mood` - Overall mood/tone
- `complexity` - Narrative complexity level
- `pacing` - Story pacing
- `target_audience` - Intended audience
- `themes` - Underscore-separated themes
- `setting` - Story setting/world
- `art_style` - Animation style
- `popularity_score` - Popularity rating (0-100)

## 🎨 Retro Design Elements

- **Typography**: Courier Prime (monospace) and Crimson Text (serif)
- **Color Palette**: Warm browns, creams, and vintage paper tones
- **UI Elements**: Bordered boxes, retro buttons, and classic styling
- **Animations**: Subtle hover effects and transitions
- **Layout**: Card-based design with vintage aesthetics

## 🧠 Recommendation Algorithm

The app uses a sophisticated scoring system:

1. **Genre Matching** (Weight: 3.0) - Primary preference matching
2. **Mood Matching** (Weight: 2.5) - Emotional tone alignment
3. **Pacing Matching** (Weight: 2.0) - Story rhythm preferences
4. **Target Audience** (Weight: 1.8) - Age/maturity alignment
5. **Complexity Matching** (Weight: 1.5) - Narrative depth
6. **Quality Bonus** (Weight: 2.0) - Rating-based boost
7. **Popularity Bonus** (Weight: 0.8) - Balanced popularity factor
8. **Recency Bonus** (Weight: 0.3) - Slight preference for newer shows

### Diversity Filtering
- Maximum 3 anime per primary genre
- Maximum 2 anime per setting
- Ensures varied recommendations

## 🚀 Deployment

### Deploy to Vercel

1. **Build the project**
   ```bash
   pnpm run build
   ```

2. **Deploy to Vercel**
   ```bash
   pnpm dlx vercel --prod
   ```

Or connect your GitHub repository to Vercel for automatic deployments.

### Build Process

The build process:
1. Runs `scripts/build-index.js` to process your CSV
2. Generates `public/anime-index.json` with processed data
3. Builds the React app with Vite
4. Outputs to `dist/` directory

## 📁 Project Structure

```
ANIME/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # App header with navigation
│   │   ├── Quiz.jsx            # 5-question preference quiz
│   │   ├── Results.jsx         # Recommendation results page
│   │   └── AnimeCard.jsx       # Individual anime display card
│   ├── utils/
│   │   └── recommendations.js  # Recommendation algorithm
│   ├── App.jsx                 # Main app component
│   ├── main.jsx               # React entry point
│   ├── index.css              # Tailwind + custom styles
│   └── App.css                # Additional component styles
├── scripts/
│   └── build-index.js         # CSV processing script
├── public/
│   └── anime-index.json       # Generated anime database
├── enhanced_anime_database.csv # Your source data
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json               # Vercel deployment config
```

## 🎯 Usage

1. **Take the Quiz**: Answer 5 questions about your anime preferences
2. **Get Recommendations**: Receive 15 personalized anime suggestions
3. **Explore Results**: View detailed information about each recommendation
4. **Find More Info**: Click through to AniList for additional details

## 🛠️ Customization

### Styling
- Modify colors in `tailwind.config.js`
- Update fonts and animations in `src/index.css`
- Adjust retro elements in component files

### Algorithm
- Tune weights in `src/utils/recommendations.js`
- Modify diversity filters
- Add new matching criteria

### Data
- Update CSV column mapping in `scripts/build-index.js`
- Add new preference categories
- Extend anime metadata

## 🐛 Troubleshooting

### Common Issues

**Build fails with CSV error**
- Check CSV format and encoding
- Ensure all required columns are present
- Verify JSON arrays in genres column

**Recommendations not loading**
- Check browser console for errors
- Verify `anime-index.json` was generated
- Ensure proper URL parameters

**Styling issues**
- Clear browser cache
- Check Tailwind CSS build
- Verify font loading

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the app!

---

**Enjoy discovering your next favorite anime! 🎌**

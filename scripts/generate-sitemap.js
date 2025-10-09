import { seoConfig } from '../src/config/seo.js'
import fs from 'fs'
import path from 'path'

const generateSitemap = () => {
  const baseUrl = seoConfig.siteUrl
  const currentDate = new Date().toISOString().split('T')[0]
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Results Page Template -->
  <url>
    <loc>${baseUrl}/results</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Popular Genre Combinations -->`

  // Generate URLs for popular combinations
  seoConfig.popularCombinations.forEach((combo, index) => {
    const params = new URLSearchParams()
    params.set('genres', JSON.stringify(combo.genres))
    params.set('mood', combo.mood)
    params.set('pacing', combo.pacing)
    
    const url = `${baseUrl}/results?${params.toString()}`
    const priority = 0.7 - (index * 0.05) // Decrease priority for later items
    
    sitemap += `
  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${Math.max(priority, 0.5).toFixed(1)}</priority>
  </url>`
  })

  // Generate individual genre pages
  seoConfig.popularGenres.forEach((genre, index) => {
    const params = new URLSearchParams()
    params.set('genres', JSON.stringify([genre]))
    params.set('mood', 'any')
    params.set('pacing', 'any')
    
    const url = `${baseUrl}/results?${params.toString()}`
    const priority = 0.6 - (index * 0.01)
    
    sitemap += `
  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${Math.max(priority, 0.4).toFixed(1)}</priority>
  </url>`
  })

  sitemap += `

</urlset>`

  // Write sitemap to public directory
  const publicDir = path.join(process.cwd(), 'public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap)
  console.log('✅ Sitemap generated successfully!')
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap()
}

export default generateSitemap

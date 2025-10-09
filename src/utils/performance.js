// Performance monitoring utilities for Core Web Vitals

export const trackWebVitals = () => {
  // Track Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        
        if (typeof gtag !== 'undefined') {
          gtag('event', 'LCP', {
            event_category: 'Web Vitals',
            value: Math.round(lastEntry.startTime),
            custom_parameter_1: lastEntry.startTime > 2500 ? 'poor' : lastEntry.startTime > 1200 ? 'needs_improvement' : 'good'
          })
        }
      })
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      console.warn('LCP tracking not supported')
    }

    // Track First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'FID', {
              event_category: 'Web Vitals',
              value: Math.round(entry.processingStart - entry.startTime),
              custom_parameter_1: entry.processingStart - entry.startTime > 100 ? 'poor' : entry.processingStart - entry.startTime > 25 ? 'needs_improvement' : 'good'
            })
          }
        })
      })
      
      fidObserver.observe({ entryTypes: ['first-input'] })
    } catch (e) {
      console.warn('FID tracking not supported')
    }

    // Track Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0
      let clsEntries = []
      
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            clsEntries.push(entry)
          }
        })
        
        if (typeof gtag !== 'undefined') {
          gtag('event', 'CLS', {
            event_category: 'Web Vitals',
            value: Math.round(clsValue * 1000),
            custom_parameter_1: clsValue > 0.25 ? 'poor' : clsValue > 0.1 ? 'needs_improvement' : 'good'
          })
        }
      })
      
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      console.warn('CLS tracking not supported')
    }
  }
}

// Track page load performance
export const trackPageLoad = () => {
  window.addEventListener('load', () => {
    // Track total page load time
    const navigation = performance.getEntriesByType('navigation')[0]
    if (navigation && typeof gtag !== 'undefined') {
      gtag('event', 'page_load_time', {
        event_category: 'Performance',
        value: Math.round(navigation.loadEventEnd - navigation.fetchStart)
      })
      
      // Track Time to First Byte (TTFB)
      gtag('event', 'TTFB', {
        event_category: 'Performance',
        value: Math.round(navigation.responseStart - navigation.fetchStart)
      })
    }
  })
}

// Track resource loading performance
export const trackResourcePerformance = () => {
  window.addEventListener('load', () => {
    const resources = performance.getEntriesByType('resource')
    
    // Track slow resources
    resources.forEach((resource) => {
      if (resource.duration > 1000 && typeof gtag !== 'undefined') {
        gtag('event', 'slow_resource', {
          event_category: 'Performance',
          event_label: resource.name,
          value: Math.round(resource.duration)
        })
      }
    })
  })
}

// Initialize all performance tracking
export const initPerformanceTracking = () => {
  trackWebVitals()
  trackPageLoad()
  trackResourcePerformance()
}

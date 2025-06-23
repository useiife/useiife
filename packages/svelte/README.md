## Introduction

The `useIIFE` composable provides a powerful way to load and manage external scripts in your application. Built on top of `useHead()`, it offers advanced features for script loading, performance optimization, and safe script interaction.

## Script Singleton Pattern

A key feature of `useIIFE` is its singleton pattern - scripts with the same source or key are only loaded once globally, regardless of how many components request them.

```ts
import { useIIFE } from 'useiife'

useIIFE('https://maps.googleapis.com/maps/api/js')
```

### Creating Reusable Script Composables

For better organization and reuse, wrap script initialization in dedicated composables:

```ts
// composables/useGoogleMaps.ts
import { useIIFE } from 'useiife'

export function useGoogleMaps(options = {}) {
  return useIIFE({
    src: 'https://maps.googleapis.com/maps/api/js',
    key: 'google-maps',
    ...options
  })
}
```

## Default Behavior & Performance

By default, `useIIFE` is configured for optimal performance and privacy:

### Performance Attributes

- Scripts load after hydration by default for better performance
- `async: true` - Load without blocking render
- `defer: true` - Execute in document order after page has loaded
- `fetchpriority: 'low'` - Prioritize other critical resources first

### Privacy Attributes

- `crossorigin: 'anonymous'` - Prevent third-party cookie access
- `referrerpolicy: 'no-referrer'` - Block referrer headers to script domain

## Proxied Function Calls

The `proxy` feature allows you to safely call script functions even before the script has loaded:

```ts
import { useIIFE } from 'useiife'

const { proxy } = useIIFE('https://www.googletagmanager.com/gtag/js')

proxy.gtag('event', 'page_view')
```

These function calls are queued and executed once the script loads. If the script fails to load, the calls are silently dropped.

### Benefits of the Proxy Pattern

- Works during server-side rendering
- Resilient to script blocking (adblockers, etc.)
- Maintains function call order
- Allows script loading anytime without breaking application logic

### Limitations

- Cannot synchronously get return values from function calls
- May mask loading issues (script failing silently)
- More difficult to debug than direct calls
- Not suitable for all script APIs

### Direct API Access

For direct access to the script's API after loading:

```ts
import { useIIFE } from 'useiife'

const { onLoaded } = useIIFE('https://www.googletagmanager.com/gtag/js')

onLoaded(({ gtag }) => {
  const result = gtag('event', 'page_view')
  console.log(result)
})
```

## Loading Triggers

Control when scripts load using triggers:

```ts
import { useIIFE } from 'useiife'

// Load after a timeout
useIIFE('https://example.com/analytics.js', {
  trigger: new Promise(resolve => setTimeout(resolve, 3000))
})

// Load on user interaction
useIIFE('https://example.com/video-player.js', {
  trigger: (load) => {
    // Only runs on client
    document.querySelector('#video-container')
      ?.addEventListener('click', () => load())
  }
})

// Manual loading (useful for lazy loading)
const { load } = useIIFE('https://example.com/heavy-library.js', {
  trigger: 'manual'
})

// Load when needed
function handleSpecialFeature() {
  load()
  // Rest of the feature code...
}
```

## Resource Warmup Strategies

Optimize loading with resource hints to warm up connections before loading the script:

```ts
import { useIIFE } from 'useiife'

useIIFE('https://example.com/script.js', {
  // Choose a strategy
  warmupStrategy: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch'
})
```

### Strategy Selection Guide

- `preload` - High priority, use for immediately needed scripts
- `prefetch` - Lower priority, use for scripts needed soon
- `preconnect` - Establish early connection, use for third-party domains
- `dns-prefetch` - Lightest option, just resolves DNS
- `false` - Disable warmup entirely
- Function - Dynamic strategy based on conditions

### Manual Warmup Control

For granular control over resource warming:

```ts
import { useIIFE } from 'useiife'

const script = useIIFE('https://example.com/video-player.js', {
  trigger: 'manual'
})

// Add warmup hint when user might need the script
function handleHoverVideo() {
  script.warmup('preconnect')
}

// Load when definitely needed
function handlePlayVideo() {
  script.load()
}
```

## Complete Example

```ts
import { useIIFE } from 'useiife'

const analytics = useIIFE({
  src: 'https://example.com/analytics.js',
  key: 'analytics',
  defer: true,
  async: true,
  crossorigin: 'anonymous',
  referrerpolicy: 'no-referrer'
}, {
  warmupStrategy: 'preconnect',
  trigger: new Promise((resolve) => {
    // Load after user has been on page for 3 seconds
    setTimeout(resolve, 3000)
  })
})

// Track page view immediately (queued until script loads)
analytics.proxy.track('pageview')

// Access direct API after script is loaded
analytics.onLoaded(({ track }) => {
  // Do something with direct access
  const result = track('event', { category: 'engagement' })
  console.log('Event tracked:', result)
})

// Handle errors
analytics.onError((error) => {
  console.error('Failed to load analytics:', error)
})
```

## Best Practices

For effective script management:

- Use composables to encapsulate script initialization logic
- Consider user privacy when loading third-party scripts
- Use appropriate warmup strategies based on script importance
- Add error handling for critical scripts
- Use triggers to control loading timing for better performance
- Be mindful of proxy limitations for complex script APIs

## Common Use Cases

### Google Analytics

```ts
export function useGoogleAnalytics() {
  const script = useIIFE({
    src: 'https://www.googletagmanager.com/gtag/js',
    defer: true
  })

  // Initialize GA
  script.proxy.gtag('js', new Date())
  script.proxy.gtag('config', 'G-XXXXXXXXXX')

  return {
    ...script,
    trackEvent: (category, action, label) => {
      script.proxy.gtag('event', action, {
        event_category: category,
        event_label: label
      })
    }
  }
}
```
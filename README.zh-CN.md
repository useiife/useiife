## 介绍

`useIIFE` 提供了一种强大的方法来加载和管理应用程序中的外部脚本。它基于 `useHead()` 构建，为脚本加载、性能优化和安全脚本交互提供高级功能。

## 脚本单例模式

`useIIFE` 的一个关键特性是它的单例模式——具有相同 source 或 key 的脚本只全局加载一次，无论有多少组件请求它们。

```ts
import { useIIFE } from 'useiife'

useIIFE('https://maps.googleapis.com/maps/api/js')
```

### 创建可重用的 Script 可组合项

为了更好地组织和重复使用，请将脚本初始化封装在专用可组合项中：

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

## 默认行为和性能

默认情况下，`useIIFE` 配置为最佳性能和隐私性：

### 性能属性

- 默认情况下，脚本在激活后加载以获得更好的性能
- `async: true` - 加载而不阻塞渲染
- `defer: true` - 加载页面后按文档顺序执行
- `fetchpriority: 'low'` - 首先优先考虑其他关键资源

### 隐私属性

- `crossorigin: 'anonymous'` -  阻止第三方 cookie 访问
- `referrerpolicy: 'no-referrer'` - 阻止反向链接标头到脚本域

## 代理函数调用

`proxy` 该功能允许您在脚本加载之前安全地调用脚本函数：proxy

```ts
import { useIIFE } from 'useiife'

const { proxy } = useIIFE('https://www.googletagmanager.com/gtag/js')

proxy.gtag('event', 'page_view')
```

这些函数调用将排队并在脚本加载后执行。如果脚本加载失败，则调用将被静默丢弃。

### 代理模式的优点

- 在服务器端渲染期间工作
- 对脚本拦截（广告拦截器等）具有弹性
- 维护函数调用顺序
- 允许随时加载脚本，而不会破坏应用程序逻辑

### 局限性
- 无法从函数调用同步获取返回值
- 可能会掩盖加载问题（脚本以静默方式失败）
- 比直接调用更难调试
- 不适用于所有脚本 API

### 直接 API 访问

要在加载后直接访问脚本的 API：

```ts
import { useIIFE } from 'useiife'

const { onLoaded } = useIIFE('https://www.googletagmanager.com/gtag/js')

onLoaded(({ gtag }) => {
  const result = gtag('event', 'page_view')
  console.log(result)
})
```

## 加载触发器

使用触发器控制脚本加载时间：

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

## 资源预热策略

使用资源提示优化加载，以便在加载脚本之前预热连接：

```ts
import { useIIFE } from 'useiife'

useIIFE('https://example.com/script.js', {
  // Choose a strategy
  warmupStrategy: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch'
})
```

### 策略选择指南

- `preload` - 高优先级，用于立即需要的脚本
- `prefetch` - 优先级较低，用于即将需要的脚本
- `preconnect` - 建立早期连接，用于第三方域
- `dns-prefetch` - 最轻量级的选项，只解析DNS
- `false` - 完全禁用预热
- Function - 基于条件的动态策略

### 手动预热控制

要对资源变暖进行精细控制，请执行以下作：

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

## 完整示例

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

## 最佳实践

要进行有效的脚本管理：

- 使用可组合项封装脚本初始化逻辑
- 加载第三方脚本时考虑用户隐私
- 根据脚本重要性使用适当的预热策略
- 为关键脚本添加错误处理
- 使用触发器控制加载时间以获得更好的性能
- 请注意复杂脚本 API 的代理限制

## 常见用例

### 谷歌分析

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
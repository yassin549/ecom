/**
 * Lazy load non-critical scripts
 */

export function lazyLoadScript(src: string, options?: {
  async?: boolean
  defer?: boolean
  onLoad?: () => void
  onError?: () => void
}) {
  return new Promise<void>((resolve, reject) => {
    // Check if script already exists
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = options?.async ?? true
    script.defer = options?.defer ?? false

    script.onload = () => {
      options?.onLoad?.()
      resolve()
    }

    script.onerror = () => {
      options?.onError?.()
      reject(new Error(`Failed to load script: ${src}`))
    }

    document.body.appendChild(script)
  })
}

/**
 * Lazy load CSS
 */
export function lazyLoadCSS(href: string) {
  return new Promise<void>((resolve, reject) => {
    // Check if stylesheet already exists
    const existing = document.querySelector(`link[href="${href}"]`)
    if (existing) {
      resolve()
      return
    }

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href

    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`))

    document.head.appendChild(link)
  })
}

/**
 * Load scripts when idle
 */
export function loadWhenIdle(callback: () => void) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout: 2000 })
  } else {
    setTimeout(callback, 1)
  }
}

/**
 * Load scripts on interaction
 */
export function loadOnInteraction(
  callback: () => void,
  events: string[] = ['mousedown', 'touchstart', 'keydown', 'scroll']
) {
  const handler = () => {
    callback()
    events.forEach((event) => {
      window.removeEventListener(event, handler)
    })
  }

  events.forEach((event) => {
    window.addEventListener(event, handler, { once: true, passive: true })
  })
}

/**
 * Load scripts when visible
 */
export function loadWhenVisible(
  element: HTMLElement,
  callback: () => void,
  options?: IntersectionObserverInit
) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback()
        observer.disconnect()
      }
    })
  }, options)

  observer.observe(element)

  return () => observer.disconnect()
}

/**
 * Example usage:
 * 
 * // Load analytics after page is interactive
 * loadWhenIdle(() => {
 *   lazyLoadScript('https://www.googletagmanager.com/gtag/js?id=GA_ID')
 * })
 * 
 * // Load chat widget on first interaction
 * loadOnInteraction(() => {
 *   lazyLoadScript('https://widget.intercom.io/widget/APP_ID')
 * })
 * 
 * // Load video player when video is visible
 * const videoElement = document.querySelector('#video-container')
 * if (videoElement) {
 *   loadWhenVisible(videoElement, () => {
 *     lazyLoadScript('https://player.vimeo.com/api/player.js')
 *   })
 * }
 */

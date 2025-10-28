/**
 * Seasonal themes for delight moments
 */

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export type SeasonalTheme = {
  season: Season
  name: string
  emoji: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  startMonth: number
  endMonth: number
}

export const seasonalThemes: Record<Season, SeasonalTheme> = {
  spring: {
    season: 'spring',
    name: 'Printemps',
    emoji: '🌸',
    colors: {
      primary: '#ec4899', // Pink
      secondary: '#a855f7', // Purple
      accent: '#10b981', // Green
    },
    startMonth: 3, // March
    endMonth: 5, // May
  },
  summer: {
    season: 'summer',
    name: 'Été',
    emoji: '☀️',
    colors: {
      primary: '#f59e0b', // Amber
      secondary: '#ef4444', // Red
      accent: '#3b82f6', // Blue
    },
    startMonth: 6, // June
    endMonth: 8, // August
  },
  autumn: {
    season: 'autumn',
    name: 'Automne',
    emoji: '🍂',
    colors: {
      primary: '#ea580c', // Orange
      secondary: '#dc2626', // Red
      accent: '#ca8a04', // Yellow
    },
    startMonth: 9, // September
    endMonth: 11, // November
  },
  winter: {
    season: 'winter',
    name: 'Hiver',
    emoji: '❄️',
    colors: {
      primary: '#3b82f6', // Blue
      secondary: '#6366f1', // Indigo
      accent: '#8b5cf6', // Violet
    },
    startMonth: 12, // December
    endMonth: 2, // February
  },
}

export function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1 // 1-12
  
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

export function getSeasonalTheme(): SeasonalTheme {
  const season = getCurrentSeason()
  return seasonalThemes[season]
}

export function applySeasonalTheme() {
  const theme = getSeasonalTheme()
  const root = document.documentElement
  
  root.style.setProperty('--seasonal-primary', theme.colors.primary)
  root.style.setProperty('--seasonal-secondary', theme.colors.secondary)
  root.style.setProperty('--seasonal-accent', theme.colors.accent)
  
  return theme
}

/**
 * Special events
 */
export function getSpecialEvent(): string | null {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()
  
  // Christmas
  if (month === 12 && day >= 20 && day <= 26) {
    return '🎄 Joyeux Noël!'
  }
  
  // New Year
  if ((month === 12 && day === 31) || (month === 1 && day <= 2)) {
    return '🎉 Bonne Année!'
  }
  
  // Black Friday (last Friday of November)
  if (month === 11 && day >= 23 && day <= 29 && now.getDay() === 5) {
    return '🛍️ Black Friday!'
  }
  
  return null
}

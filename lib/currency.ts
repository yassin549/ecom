// Currency conversion and formatting utilities

// Exchange rate: 1 USD = 3.1 TND (approximate)
const USD_TO_TND_RATE = 3.1

export function formatPrice(priceInUSD: number): string {
  const priceInTND = priceInUSD * USD_TO_TND_RATE
  return new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceInTND)
}

export function convertUSDtoTND(priceInUSD: number): number {
  return priceInUSD * USD_TO_TND_RATE
}

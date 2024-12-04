export function formatEuroPrice (price) {
  if (!price) {
    return '0,00 €'
  }
  return price.toLocaleString() + ' €'
}


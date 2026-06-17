export function formatEuroPrice (price, showZero = true) {
  if (!price && !showZero) {
    return ''
  }

  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  })

  return formatter.format(price ?? 0)
}

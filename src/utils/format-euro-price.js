export function formatEuroPrice (price) {
  if (!price) {
    return ''
  }

  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  })

  return formatter.format(price)
}


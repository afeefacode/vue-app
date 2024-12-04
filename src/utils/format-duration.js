export function formatDuration (duration) {
  if (!duration) {
    return ''
  }

  const hours = Math.floor(duration / 60)
  const minutes = duration % 60

  if (hours) {
    const hours_str = hours.toLocaleString()
    const minutes_str = String(minutes).padStart(2, '0')
    return `${hours_str} h ${minutes_str} min`
  } else {
    return `${minutes} min`
  }
}

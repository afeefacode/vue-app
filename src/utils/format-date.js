export function formatDate (date, options = {}) {
  if (options === true) {
    options = {
      hours: true
    }
  }

  if (!date) {
    return ''
  }

  const dayName = options.day ? date.toLocaleDateString('de-DE', { weekday: options.weekday || 'long' }) + ', ' : ''

  const month = addZero(date.getMonth() + 1)
  const day = addZero(date.getDate())
  const year = date.getFullYear()
  const hour = addZero(date.getHours())
  const minutes = addZero(date.getMinutes())

  let dateString = `${dayName}${day}.${month}.${year}`
  if (options.hours) {
    dateString += ` um ${hour}:${minutes} Uhr`
  }
  return dateString
}

function addZero (i) {
  if (i < 10) {
    i = '0' + i
  }
  return i
}

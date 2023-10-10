export function formatTime (date) {
  if (!date) {
    return ''
  }

  const hour = addZero(date.getHours())
  const minutes = addZero(date.getMinutes())

  return `${hour}:${minutes}`
}

function addZero (i) {
  if (i < 10) {
    i = '0' + i
  }
  return i
}

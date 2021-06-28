export function formatDate (date, hours = false) {
  if (!date) {
    return ''
  }

  const month = addZero(date.getMonth() + 1)
  const day = addZero(date.getDate())
  const year = date.getFullYear()
  const hour = addZero(date.getHours())
  const minutes = addZero(date.getMinutes())

  let dateString = `${day}.${month}.${year}`
  if (hours) {
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

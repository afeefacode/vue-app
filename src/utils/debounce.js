export function debounce (callback, delay = 300, condition = () => true) {
  let timeout = null
  return function () {
    const args = arguments

    if (timeout) {
      clearTimeout(timeout)
    }

    if (!condition(...args)) {
      callback(...args)
      return
    }

    timeout = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}

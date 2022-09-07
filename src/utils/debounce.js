export function debounce (callback, delay = 300, condition = () => true) {
  if (delay === true) {
    delay = 300
  }

  let timeout = null
  return function () {
    const args = arguments

    if (timeout) {
      clearTimeout(timeout)
    }

    /**
     * fire immediately if condition falsy
     * e.g. textfield content gets canceled using (x)
     */
    if (!condition(...args)) {
      callback(...args)
      return
    }

    timeout = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}

/**
 * adds new listners in front and dispatches the event
 * from the deepest child up the display list as long
 * the components event handler stops bubbling by returning false
 */

class CascadingWindowEventDispatcher {
  windowListeners = {}
  listeners = {}

  addEventListener (event, listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }

    if (!this.windowListeners[event]) {
      window.addEventListener(event, e => {
        for (const listener of this.listeners[event]) {
          const result = listener(e)
          if (result === false) {
            break
          }
        }
      })

      this.windowListeners[event] = true
    }

    this.listeners[event].unshift(listener)
  }

  removeEventListener (event, listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }

    this.listeners[event] = this.listeners[event].filter(l => l !== listener)
  }
}

export const cascadingWindowEventDispatcher = new CascadingWindowEventDispatcher()

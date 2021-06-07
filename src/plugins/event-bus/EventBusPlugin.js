import { eventBus } from './EventBus'

class EventBusPlugin {
  install (Vue) {
    Object.defineProperty(Vue.prototype, '$events', {
      get () {
        return eventBus
      }
    })

    Vue.prototype.$emitOnParent = function (event) {
      let parent = this
      while (parent) {
        if (parent.$listeners[event]) {
          parent.$emit(...arguments)
          break
        }
        parent = parent.$parent
      }
    }
  }
}

export const eventBusPlugin = new EventBusPlugin()

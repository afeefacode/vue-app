class HasOptionsPlugin {
  install (Vue) {
    const plugin = this

    Vue.mixin({
      created () {
        this.$has = plugin.initOptions(this)
      },

      watch: {
        '$attrs.has' () {
          this.$has = plugin.initOptions(this)
        }
      }
    })
  }

  initOptions (vue) {
    const hasOptions = vue.$data.$hasOptions || []

    const options = {}

    hasOptions.forEach(option => {
      if (typeof option === 'object') { // option object with default value
        Object.keys(option).forEach(key => {
          options[key] = option[key]
        })
      } else {
        options[option] = true // has option default true
      }
    })

    const has = (vue.$props && vue.$props.has) ||
      (vue.$attrs && vue.$attrs.has)

    if (has) {
      Object.keys(has).forEach(key => {
        if (Object.prototype.hasOwnProperty.call(options, key)) {
          if (typeof has[key] !== 'boolean') {
            console.warn(`has option "${key}" must be a boolean value but was a ${typeof has[key]}. has.${key} got ignored.`)
            return
          }
          options[key] = has[key]
        }
      })
    }

    return options
  }
}

export const hasOptionsPlugin = new HasOptionsPlugin()

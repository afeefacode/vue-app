import { Component as VueComponent } from 'vue-property-decorator'

const Component = function (options) {
  if (options.props) {
    options.props = propsWithDefaults(options.props)
  }
  return VueComponent(options)
}

Component.registerHooks = VueComponent.registerHooks

export { Component }

function propsWithDefaults (props) {
  if (props && typeof props === 'object' && props.constructor === Object) {
    return props
  }

  const normalizedProps = {}

  for (const prop of props) {
    if (typeof prop === 'object') {
      Object.keys(prop).forEach(subProp => {
        const value = prop[subProp]
        // property: []
        if (Array.isArray(value)) {
          normalizedProps[subProp] = {
            default () { // must be a function according to vue spec
              return value
            }
          }
        // property: { some object }, should be a normal vue props object
        } else if (value && typeof value === 'object' && value.constructor === Object) {
          normalizedProps[subProp] = value
        // property: true, false, null, ...
        } else {
          if (typeof value === 'boolean') {
            normalizedProps[subProp] = {
              type: Boolean,
              default: value
            }
          } else {
            normalizedProps[subProp] = { default: value }
          }
        }
      })
    } else {
      normalizedProps[prop] = null
    }
  }

  return normalizedProps
}

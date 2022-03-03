import { Component as VueComponent } from 'vue-property-decorator'

export function Component (options) {
  options.props = propsWithDefaults(options.props)
  return VueComponent(options)
}

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
        // property: true, null, ...
        } else {
          normalizedProps[subProp] = { default: value }
        }
      })
    } else {
      normalizedProps[prop] = null
    }
  }

  return normalizedProps
}

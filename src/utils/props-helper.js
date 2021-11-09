export function propsWithDefaults (props) {
  const normalizedProps = {}

  for (const prop of props) {
    if (typeof prop === 'object') {
      Object.keys(prop).forEach(subProp => {
        if (typeof prop[subProp] === 'object') {
          normalizedProps[subProp] = prop[subProp]
        } else {
          normalizedProps[subProp] = { default: prop[subProp] }
        }
      })
    } else {
      normalizedProps[prop] = null
    }
  }

  return {
    props: normalizedProps
  }
}

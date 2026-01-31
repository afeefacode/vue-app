/**
 * Recursively merges source into target.
 * Returns a new object without mutating target or source.
 * Arrays and non-plain-objects are overwritten (not merged).
 */
export function deepMerge (target, source) {
  const result = { ...target }
  for (const key of Object.keys(source)) {
    if (
      result[key] && typeof result[key] === 'object' && !Array.isArray(result[key]) &&
      source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(result[key], source[key])
    } else {
      result[key] = source[key]
    }
  }
  return result
}


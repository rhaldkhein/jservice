
export function isString(str) {
  return typeof str === 'string'
}

export function isFunction(fn) {
  return typeof fn === 'function'
}

export function isConstructor(fn) {
  return isFunction(fn) && fn.hasOwnProperty('prototype')
}

// #WARNING Use With Caution.
// Expensive method, do not use in loops.
export function isClass(fn) {
  if (isConstructor(fn)) {
    try {
      fn.arguments
      fn.caller
    } catch {
      return true
    }
  }
  return false
}
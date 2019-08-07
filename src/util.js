
export function isString(str) {
  return typeof str === 'string'
}

export function isFunction(fn) {
  return typeof fn === 'function'
}

export function isConstructor(fn) {
  return isFunction(fn) && fn.hasOwnProperty('prototype')
}
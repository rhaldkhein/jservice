"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isString = isString;
exports.isFunction = isFunction;
exports.isConstructor = isConstructor;
exports.isClass = isClass;

function isString(str) {
  return typeof str === 'string';
}

function isFunction(fn) {
  return typeof fn === 'function';
}

function isConstructor(fn) {
  return isFunction(fn) && fn.hasOwnProperty('prototype');
} // #WARNING Use With Caution.
// Expensive method, do not use in loops.


function isClass(fn) {
  if (isConstructor(fn)) {
    try {
      fn.arguments;
      fn.caller;
    } catch (_unused) {
      return true;
    }
  }

  return false;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isString = isString;
exports.isFunction = isFunction;
exports.isConstructor = isConstructor;

function isString(str) {
  return typeof str === 'string';
}

function isFunction(fn) {
  return typeof fn === 'function';
}

function isConstructor(fn) {
  return isFunction(fn) && fn.hasOwnProperty('prototype');
}
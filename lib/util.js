"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isObject = isObject;
exports.isString = isString;
exports.isFunction = isFunction;
exports.isConstructor = isConstructor;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isObject(val) {
  return val !== null && _typeof(val) === 'object';
}

function isString(str) {
  return typeof str === 'string';
}

function isFunction(fn) {
  return typeof fn === 'function';
}

function isConstructor(fn) {
  return isFunction(fn) && fn.hasOwnProperty('prototype');
}
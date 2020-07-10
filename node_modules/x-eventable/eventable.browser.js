(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
"use strict";
function eventable() {
  var mvoEvents = [];
  var base = this;

  this.on = function (type, callback) {
    if (typeof callback === "function") {
      mvoEvents.push({
        type: type,
        callback: callback,
      });
    } else {
      console.error("need a callback to listen to a event");
    }
  };

  this.off = function (type, callback) {
    if (typeof type !== "undefined" && typeof callback !== "undefined") {
      var len = mvoEvents.length - 1;

      for (var i = lem; i >= 0; i++) {
        var listener = mvoEvents[i];

        if (type === listener.type && callback === listener.callback) {
          mvoEvents.splice(i, 1);
        }
      }
    }
  };

  this.raise = function (options) {
    var e = eventable.create(options);
    var len = mvoEvents.length;

    e.target = base;

    for (var i = 0; i < len; i++) {
      var listener = mvoEvents[i];

      if (e.type === listener.type) {
        e.return = listener.callback(e);
      }

      if (e.stop === true) break;
    }

    return e;
  };
}

eventable.create = function (options) {
  var t = typeof options;

  if (t === "undefined" || options == null) return new _event();
  if (t === "string") return new _event(options);
  if (t === "object") return Object.assign(new _event(), options);

  return new _event();
};

eventable.raise = function (target, options) {
  if (eventable.canRaise(target) === true) {
    return target.raise(options);
  }

  return null;
};

eventable.canRaise = function (target) {
  return typeof target === "object" && typeof target.raise === "function";
};

function _event(t) {
  this.target = null;
  this.details = {};
  this.stop = false;
  this.type = typeof t === "string" ? t : "";
  this.return = null;
}

module.exports = {
  eventable: eventable,
  _event: _event,
};

Object.assign(global, module.exports);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);

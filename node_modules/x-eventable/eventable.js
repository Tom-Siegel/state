(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory())
    : typeof define === "function" && define.amd
    ? define(factory)
    : (global.moment = factory());
})(this, function () {
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

  return {
    eventable: eventable,
    _event: _event,
  };
});

(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }
    g.state = f();
  }
})(function () {
  var define, module, exports;
  return (function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw ((a.code = "MODULE_NOT_FOUND"), a);
          }
          var p = (n[i] = { exports: {} });
          e[i][0].call(
            p.exports,
            function (r) {
              var n = e[i][1][r];
              return o(n || r);
            },
            p,
            p.exports,
            r,
            e,
            n,
            t
          );
        }
        return n[i].exports;
      }
      for (
        var u = "function" == typeof require && require, i = 0;
        i < t.length;
        i++
      )
        o(t[i]);
      return o;
    }
    return r;
  })()(
    {
      1: [
        function (require, module, exports) {
          (function (global, factory) {
            typeof exports === "object" && typeof module !== "undefined"
              ? (module.exports = factory())
              : typeof define === "function" && define.amd
              ? define(factory)
              : Object.assign(global, factory());
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
                if (
                  typeof type !== "undefined" &&
                  typeof callback !== "undefined"
                ) {
                  var len = mvoEvents.length - 1;

                  for (var i = lem; i >= 0; i++) {
                    var listener = mvoEvents[i];

                    if (
                      type === listener.type &&
                      callback === listener.callback
                    ) {
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
              return (
                typeof target === "object" && typeof target.raise === "function"
              );
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
        },
        {},
      ],
      2: [
        function (require, module, exports) {
          const { eventable } = require("x-eventable/eventable.js");

          function _var(obj) {
            eventable.call(this);

            var value = typeof obj === "undefined" ? null : obj;
            var base = this;

            Object.defineProperty(this, "value", {
              get: function () {
                return value;
              },
              set: function (v) {
                var details = {
                  old: value,
                  new: v,
                };

                value = v;

                base.raise({
                  type: "change",
                  details: details,
                });
              },
              enumerable: true,
            });
          }

          function _hook(variable, ref, prop) {
            if (typeof ref === "undefined") ref = {};

            function handler(e) {
              if (typeof ref !== "undefined" && ref != null) {
                switch (typeof prop) {
                  case "string":
                  case "number":
                    ref[prop] = e.details.new;
                    break;
                  case "function":
                    prop({ target: ref, event: e, variable: variable });
                    break;
                  default:
                    ref = e.details.new;
                }
              } else {
                ref = e.details.new;
              }
            }

            variable.on("change", handler);

            Object.defineProperty(this, "reference", {
              get: function () {
                return ref;
              },
            });

            Object.defineProperty(this, "property", {
              get: function () {
                return prop;
              },
            });

            Object.defineProperty(this, "release", {
              value: function () {
                variable.off("change", handler);
              },
            });
          }

          function _provider() {
            var variable = new _var();
            var hooks = [];

            Object.defineProperty(this, "value", {
              get: function () {
                return variable.value;
              },
              set: function (v) {
                variable.value = v;
              },
            });

            Object.defineProperty(this, "addHook", {
              value: function (ref, prop) {
                hooks.push(new _hook(variable, ref, prop));
              },
            });

            Object.defineProperty(this, "hooks", {
              get: function () {
                return hooks;
              },
            });
          }

          function _complex(obj, deep) {
            if (typeof obj === "object") {
              var keys = Object.keys(obj);
              var instance = {};

              Object.defineProperty(instance, "__source", {
                get: function () {
                  return obj;
                },
              });

              keys.forEach((k) => {
                var v = new _var();
                var _k = "_" + k;
                var type = typeof obj[k];

                Object.defineProperty(instance, _k, {
                  get: function () {
                    return v;
                  },
                });

                Object.defineProperty(instance, k, {
                  get: function () {
                    return instance[_k].value;
                  },
                  set: function (v) {
                    instance[_k].value = v;
                  },
                  enumerable: true,
                });

                if (type === "object" && deep === true) {
                  v.value = _complex(obj[k]);
                } else {
                  v.value = obj[k];
                }
              });

              return instance;
            }

            return {};
          }

          module.exports = {
            _var: _var,
            _hook: _hook,
            _provider: _provider,
            _complex: _complex,
          };
        },
        { "x-eventable/eventable.js": 1 },
      ],
    },
    {},
    [2]
  )(2);
});

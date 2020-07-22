const {
  eventable
} = require("x-eventable/eventable.js");

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
        new: v
      };
      value = v;
      base.raise({
        type: "change",
        details: details
      });
    },
    enumerable: true
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
          prop({
            target: ref,
            event: e,
            variable: variable
          });
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
    }
  });
  Object.defineProperty(this, "property", {
    get: function () {
      return prop;
    }
  });
  Object.defineProperty(this, "release", {
    value: function () {
      variable.off("change", handler);
    }
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
    }
  });
  Object.defineProperty(this, "addHook", {
    value: function (ref, prop) {
      hooks.push(new _hook(variable, ref, prop));
    }
  });
  Object.defineProperty(this, "hooks", {
    get: function () {
      return hooks;
    }
  });
}

function _complex(obj, deep) {
  if (typeof obj === "object") {
    var keys = Object.keys(obj);
    var instance = {};
    Object.defineProperty(instance, "__source", {
      get: function () {
        return obj;
      }
    });
    keys.forEach(k => {
      var v = new _var();

      var _k = "_" + k;

      var type = typeof obj[k];
      Object.defineProperty(instance, _k, {
        get: function () {
          return v;
        }
      });
      Object.defineProperty(instance, k, {
        get: function () {
          return instance[_k].value;
        },
        set: function (v) {
          instance[_k].value = v;
        },
        enumerable: true
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
  _complex: _complex
};

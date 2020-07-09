"use strict";

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

  variable.on("change", function (e) {
    if (typeof ref !== "undefined" && ref != null) {
      switch (typeof prop) {
        case "string":
        case "number":
          ref[prop] = e.details.new;
          break;
        default:
          ref = e.details.new;
      }
    } else {
      ref = e.details.new;
    }
  });

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
    value: function () {},
  });
}

module.exports = {
  _var: _var,
  _hook: _hook,
  _provider: _provider,
};

Object.assign(global, module.exports);

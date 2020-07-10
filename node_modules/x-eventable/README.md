# eventable.js

## Install

```
npm install eventable
```

## Usage

### Node.js

```javascript
const { eventable } = require("eventable.js");

let listener = new eventable();

listener.on("work", (e) => {
  console.log("successful");
});

listener.raise("work");
```

### Javascript

```html
<script src="eventable.browser.js" />
```

---

```javascript
let listener = new eventable();

listener.on("work", (e) => {
  console.log("successful");
});

listener.raise("work");
```

## Examples

### Add multiple listeners

```javascript
let listener = new eventable();

listener.on("A", (e) => {
  console.log(e.type);
});

listener.on("B", (e) => {
  console.log(e.type);
});

listener.raise("A"); //logs: A
listener.raise("B"); //logs: B
```

### Remove listener

```javascript
let listener = new eventable();

function callback(e) {
  console.log("Hello :)");
}

listener.on("speak", callback);

listener.raise("speak"); //logs: Hello :)
listener.off("speak", callback);
listener.raise("speak"); //Nothing happens
```

### Stop chain

```javascript
let listener = new eventable();

function callback(e) {
  console.log("Hello :)");

  e.stop = true; //cancels each listener that is positioned after the current
}

listener.on("speak", callback); //logs: Hello :)
listener.on("speak", callback); //nothing happens

listener.raise("speak");
```

### Options

```javascript
let listener = new eventable();

function callback(e) {
  console.log(`Hello ${e.details}`); //logs: Hello World!
  console.log(e.target); //logs: listener (object)
  console.log(e.type); //logs: speak
  console.log(e.stop); //logs: false
  console.log(e.return); //logs: null

  return "nice to meet you";
}

listener.on("speak", callback); //logs: Hello :)

var ev = listener.raise({
  type: "speak",
  details: "World!", //can be any object
});

console.log(ev.return); //logs: nice to meet you
```

### Inheritance

```javascript
function myObject() {
  eventable.call(this);

  this.answer = "foo";
}

myObject.on("ask", (e) => {
  console.log("answer is: " + e.target.answer); //logs: answer is: foo
});
myObject.raise("ask");
```

### Try raise

```javascript
var A = new eventable();
var B = {};

A.on("test", (e) => {
  console.log("success");
});

console.log(eventable.canRaise(A)); //logs: true
console.log(eventable.canRaise(B)); //logs: false

//or if eventable.raise == null
var resultA = eventable.raise(A, "test");
var resultB = eventable.raise(B, "test");

console.log(resultA); //logs: event (object)
console.log(resultB); //logs: null
```

## Definition

### Event-Object

```javascript
function _event() {
  this.target = null; //the eventable
  this.details = {}; //any data you want to share with your listeners
  this.stop = false; //true stops each listener that would be called after the current one
  this.type = ""; //the event type
  this.return = null; //the return of the previous listener
}
```

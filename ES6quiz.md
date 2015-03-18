# ECMA Script 6 test
## made by a n00b.

___________

# Variables declaration

## const

```js
const KEY = 'white_rabbit';
if (true) {
  const KEY = 'white_rabbit';
}
console.log(KEY);
```
What's the output?

> white_rabbit


## let

```js
let x = 42;
if (true) {
  let x = 1337;
}
console.log(x);
```
What's the output?

> 42


```js
let x = 42;
if (true) {
  console.log(x);
  let x = 1337;
}
```
What's the output?

> ERROR!!!!!!





# Function

```js
// Here is a new way to define functions
var double = i => i*2;

// Which is like
var double = function (i) {
  return i * 2;
};
```

How to use the new syntax to define a function which doesn't take any parameter?

> () => this.whatever;

# Templates

```js
var x = `foo ${y}`,
    y = `bar ${x}`;

console(x);
```
What's the output?

> foo undefined


```js
var x = `foo ${y}`,
    y = `bar ${x}`;

console(y);
```
What's the output?

> bar foo undefined



# Map and Set

What's the attribute to get the quantity of object stored in a `Set` object?

- `length`
- `size`
- `weight`
- `area`

> size

What's the difference between Map/Set and MapWeak/SetWeak ?

> Values cannot be primitive types. Values are objects and are "weakly" held



# Declare

```js
let options = {
  protocol: protocol,
  url: url,
  method: method,
  callback: callback
};
```
In ES6, is there a better way to create this object?



# Class

- get
- private
- static
- constructor
- set

Which keywork is not allowed in ES6 Class definition?

> Private

```js
// Create a logger facade
class Logger {
  constructor (type = "Info") {
    this.type = type;
  }

  static create(type) {
    return new this(type);
  }

  get current() {
    return `Logger: ${this.type}`;
  }

  set current(type) {
    this.type = type;
  }

  log (message) {
    // Basic method
  }
}
```
Class example



# Syntax
## Is it legal or not?


```js
var score = [12, 7, 14];
Math.max(...score);
```
> Yes


```js
function stuff(x::Number, y::String) {
  // Do stuff..
}
```
> Nope.


```js
function stuff(x, ...y) {
  // Do stuff..
}
```
> Yes


```js
function stuff(x, y=12) {
  // Do stuff..
}
stuff(2);
```
> Yes

```js
function stuff(x, y=x/3) {
  // Do stuff..
}
stuff(6);
```
> Yes


```js
var {foo, bar} = {
  foo: 'FOO',
  bar: 'BAR'
};
```
> Yes

```js
var [first, , last] = [1,2,3];
```
> Yes


```js
function stuff(a, x=12, y=42) {
  // Do stuff..
}
stuff(1, ,2);
```
> Nope.



# General

- `typeof`
- `continue`
- `for..in`

Which one of this keywords won't be compatible on ES6?

> NONE! ES6 is completely retrocompatible


# Nerd

```js
a = 0x1101010110111;
b = 0o1101010110111;
c = 0b1101010110111;
d = 001101010110111;
e = 0E1101010110111;
```
Which var got the max value?

> A


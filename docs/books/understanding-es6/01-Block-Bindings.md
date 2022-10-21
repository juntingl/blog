# 块级作用域绑定

## var 声明及变量提升（Hoisting） 机制

ES6 之前 `JavaScript` 只有"函数作用域”和“全局作用域”，通过关键字 `var` 声明变量，无论在哪里声明的，都会被当成在当前作用域顶部声明的变量，这就是常说的提升（Hoisting）机制。

```javascript
function getValue(condition) {
  //var value; // 实际执行时（JavaScript 预编译阶段） var 声明提升到函数作用域顶部
  if (condition) {
    // value = "blue"; // 实际执行时，初始化动作还是留在了这里
    var value = "blue";
    return value;
  } else {
    // console.log(value); // undefined ，这里还是可以访问到 value 的，值为 undefined
    return null
  }
}
```

## 块级声明

块级声明（`let`,`const`）用于声明在指定块级的作用域之外无法访问的变量，块级作用域（亦称为词法作用域）。

* 函数内部
* 块中（字符 { 和 } 之间的区域）
* 禁止重复声明

```javascript
function getValue(condition) {
  if (condition) {
    let value = "blue";
    return value;
  } else {
    // 变量 value 在此处不存在
    return null;
  }
  // 变量 value 在此处不存在
}
```

`const` 关键字声明常量，其值一旦被设定后不可更改，每个通过 `const` 声明的常量必须进行初始化，否则会报语法错误。`const` 常量不可变说的是不能更改绑定的值，如果赋值的是一个对象，对象里的属性值还是可以修改的。

```javascript
const obj = { name: 'Junting' };

obj.name = 'Jt'; // OK

// 抛出语法错误
obj = { name: 'Junting' };
```

## 临时死区（Temporal Dead Zone ,TDZ）

与 `var` 不同，`let` 和 `const` 声明的变量不会被提升到作用域顶部，在声明变量前访问这些变量就会报语法错误，即使是相对安全的 `typeof` 操作符也会触发引用错误。`JavaScript`  引擎在扫描代码发现变量声明时，要么将它们提升至作用域顶部（var 声明），要么将声明放到 `TDZ` 中（遇到 `let` 和 `const` 声明）。访问 TDZ 中的变量会触发运行时错误，只有在执行过变量声明语句后，变量才会从 `TDZ` 中移除，然后方可正常访问。

```javascript
console.log(typeof value); // "undefined", 在 let 声明块级作用域外，访问则不会报错

if (true) {
  // console.log(typeof value); // 语法报错
  let value = "blue";
}
```

## 循环中的块级作用域绑定

```javascript
// ES6 之前
for (var i = 0; i < 10; i++) {
  // ...
}
// 在循环外还是可以访问到 i
console.log(i)

// ES6 之后
for (let i = 0; i < 10; i++) {
  // ...
}
// i 不可访问，抛出一个错误
console.log(i)
```

循环中的函数

```javascript
var funcs = [];

for (var i = 0; i < 10; i++) {
  funcs.push(function () {
    console.log(i)
  })
}

funcs.forEach(function (func) {
  func(); // 输出 10 个数字 10，和理想的输出 0 - 9 不一致
})
```

过去的解决办法，通过使用闭包知识来进行

```javascript
var funcs = [];
for (var i = 0; i < 10; i++) {
  funcs.push((function (value) {
    return function () {
      console.log(value)
    }
  }(i)))
}

funcs.forEach(function (func) {
  func(); // 输出  0 - 9
})
```

ES6 就更简单了

```javascript
var funcs = [];
for (let i = 0; i < 10; i++) {
  funcs.push((function () {
      console.log(value)
    })
}

funcs.forEach(function (func) {
  func(); // 输出  0 - 9
})
```

循环中的 let 声明，会每次迭代循环都会创建一个新的变量，并以之前迭代中同名变量的值将其初始化。

> 注意：let 声明在循环内部的行为时标准中专门定义的，它不一定与 `let` 的不提升特性相关，理解这一点尤为重要。事实上，早期的 `let` 实现不包含这一行为，它是后来加入的。

**循环中的 const 声明**

对于普通的 for 循环来说，使用 `const` 在第一次迭代初始化时使用 `const` 不会报错，但是在下一次迭代修改其绑定值时就会抛出错误。

```javascript
for (const i = 0; i < 10; i++) {
  // ...
}
```

在 `for-in` 活 `for-of`  循环中使用 `const` 时的行为就与 `let` 一致了。

```javascript
var funcs = [],
    obj = {
      a: 1,
      b: 2,
      c: 3
    };

for (const key in obj) {
  funcs.push(function() {
    console.log(key);
  })
}

funcs.forEach(function (func) {
  console.log(func()); // a b c
})
```

这段代码中的函数与 "循环中的 let 声明" 一至，唯一的区别就是循环内不能更改 `key` 的值。

## 全局块作用域绑定

`var` 关键字在全局作用域下声明的变量，会作为全局对象 `window` (浏览器下) 的属性，也就意味会覆盖 `window` 自身的一些全局属性。

```javascript
var RegExp = "hello";
console.log(window.RegExp); // "hello"

var test = "Junting";
window.test; // "Junting"
```

而使用 `let` 和 `const` 在全局作用域下 声明变量，会在全局作用域下创建一个新的绑定，但改绑定不会添加到全局对象的属性上。换句话说，用 `let` 和 `const` 声明不能覆盖全局变量，而只能遮蔽它。

```javascript
let RegExp = "test";
console.log(RegExp); // "test"
console.log(window.RegExp === RegExp); // false
```

## 最佳实践

定义声明变量时，默认使用 `const` ，只有确定需要改变变量的值时使用 `let`。

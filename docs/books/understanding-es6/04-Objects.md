# 扩展对象的功能性

## 对象类型统一标准化

针对对象没有统一的标准，在标准中又使用不同的术语描述对象，**ECMAScript 6** 规范清晰定义了每一个类别的对象。

**对象类别：**

* **普通（Ordinary）对象**  具有 **Javascript** 对象所有的默认内部行为。
* **特异（Exotic）对象**  具有某些与默认行为不符的内部行为
* **标准（Standard）对象**  **ECMAScript6**  规范中定义的对象，例如， **Array**、**Data** 等。**标准对象既可以是普通对象，也可以是特异对象。**
* **内建对象**  脚本开始执行时存在于 **Javascript** 执行环境中的对象，所有**标准对象都是内建对象。**

## 对象新增的语法特性

### 对象字面量语法扩展

一个对象的属性与本地变量同名时，不必再写冒号和值，简单地只写属性名即可。

```javascript
function createPerson(name, age, sex) {
  return {
    name,
    age,
    sex
  }
}
```

对象字面量里只有一个属性的名称时，**JavaScript** 引擎会在可访问作用域中查找其同名变量；如果找到，则变量的值被赋给对象字面量里的同名属性。

### 对象方法的简写

在对象字面量里添加一个对象方法，不需要在以`属性名: 匿名函数表达式` 的形式书写对象方法，可以直接省略**冒号**和 **function** 关键字。

```javascript
var person = {
  name: 'Junting',
  getName() {
    return this.name;
  }
}
```

其定义的对象方法具有传统定义对象方法的全部特性。二者唯一的区别是，使用简写方法可以使用 `super` 关键字。

> Topic:
>
> 通过对象方法简写语法创建的方法有一个 `name` 属性，其值为小括号前的名称。
>
> 上述例子中 `person.getName()` 方法的 name 属性的值为 `getName`

### 可计算属性名

对象属性名可以通过动态计算后得出属性名。

```javascript
const suffix = " name";

var person = {
  ['first' + suffix]: "Junting",
  ['last' + suffix]: "Liu",
  [`full${suffix}`]: "Junting Liu"
}

console.log(person['first name']); // "Junting"
console.log(person['last name']); // "Liu"
console.log(person['full name']); // "Junting Liu"
```

## 新增方法

### Object.is() 方法

此方法用来弥补全等运算符的不准确运算。其运算结果在大部分情况中与 `===` 与运算符相同，**唯一区别在于 `+0` 和 `-0` 被识别为不相等并且 `NaN` 与 `NaN` 等价。**

是否选择用 `Object.is()` 方法而不是 `==`或`===` 取决于哪些特殊情况如何影响代码。

```javascript
+0 == -0; // true
+0 === -0; // true
Object.is(+0, -0); // true

NaN == NaN; // false
NaN === NaN; // false
Object.is(NaN, NaN); // true

5 == 5; // true
5 == "5"; // true
5 === 5; // true
5 === "5"; // false

Object.is(5, 5); // true
Object.is(5, "5"); // true
```

### Object.assign() 方法

用于合并对象，将源对象（source）的所有可枚举属性和方法，复制到目标对象（target）。

在 `ES6` 之前，混合（Mixin）是  `JavaScript` 中实现对象组合最流行的一种模式。在一个 **mixin** 方法中，一个对象接收来自另一个对象的属性和方法，许多的 `JavaScript` 库都有类似的 **mixin** 方法：

```javascript
function mixin(receiver, supplier) {
  Object.keys(supplier).forEach(function (key) {
    receiver[key] = supplier[key];
  });
  return receiver;
}
```

此上是通过赋值（`=` ）的形式来进行复制（此行为是一个浅拷贝，属性值为对象时只复制了对象的引用）。

再来看一段代码：

```javascript
function EventTarget() { /*...*/ }
EventTarget.prototype = {
  constructor: EventTarget,
  emit: function () { /*...*/ },
  on: function () { /*...*/ }
}

var myObject = {};
mixin(myObject, EventTarget.prototype);

myObject.emit('........');
```

通过 **mixin** 方法实现 **myObject** 可以分别通过 **emit()** 方法发布事件或通过 **on()** 方法订阅事件。

这种混合模式非常流行，因而在**ECMAScript 6** 添加了 `Object.assign()` 方法来实现相同的功能。  **mixin** 方法使用的是赋值操作符来复制相关属性，**不能复制访问器属性到接收对象中** ，因此在 **ECMAScript 6** 采用的是 **assign** 作为方法名，而不是 `mixin`。

**Object.assign() 方法复制不了访问器属性**

由于 **Object.assign()** 方法执行的是赋值操作，因此**提供者的访问器属性最终会转变为接收对象的一个数据属性**。

```javascript
var receiver = {};
var supplier = {
  get name () {
    return 'Junting'
  }
}

Object.assign(receiver, supplier);

var descriptor = Object.getOwnPropertyDescriptor(receiver, 'name');

descriptor.value // 'Junting'
descriptor.get // undefined
```

## 重复的对象字面量属性

在 **ECMAScript 5** 严格模式下，对象字面量属性出现重复的 **key** 会触发一个语法错误。

在 **ECMAScript 6** 中不管是在非严格模式下还是在严格模式下代码不再检查重复属性，对于每一组的重复属性，都会选取最后一个取值。

```javascript
"use strict";

var person = {
  name: 'Liu',
  name: 'Junting' // 在 es6 下不会报语法错误
}

person.name; // 'Junting'
```

## 自有属性枚举顺序

在 **ECMAScript 6** 严格规定了对象的自由属性被枚举时的放回顺序，之前是没有的。

**自由属性枚举顺序的基本规则：**

1. 所有数字键按升序排序
2. 所有字符串键按照它们被加入对象的顺序排序
3. 所有 **symbol** 键按照它们被加入对象的顺序排序

自有属性枚举有了顺序规则后，会影响到 **Object.getOwnPropertyNames() 方法** 和 **Reflect.ownKeys** 返回属性的方式， **Object.assign() **方法处理属性的顺序也将随之改变。

```javascript
var obj = {
  a: 1,
  0: 1,
  3: 1,
  c: 1,
  1: 1,
  b: 1,
  [Symbol('junting')]: 1
}

obj.d = 1;

console.log(obj); // {0: 1, 1: 1, 3: 1, a: 1, c: 1, b: 1, d: 1, Symbol(junting): 1}

console.log(Object.getOwnPropetyNames(obj).join(' -> ')); // "0 -> 1 -> 3 -> a -> c -> b -> d"
```

对于数字键，尽管在对象字面量中的顺序是随意的，但在枚举时会被重新组合和排序。字符串紧随数值键，并按照在对象中定义的顺序返回，所以随后动态加入的字符串也是最后输出。

> ⚠️ 注意：
>
> 虽然  **ECMAScript 6**  已经明确规定了对象自由属性枚举是严格按照规则进行排序的，但对于 `for -in` 循环，由于不同的浏览器厂商对于循环的实现方式不同，因此仍为指定一个明确的枚举顺序，而 **Object.keys()** 方法和 **JSON.stringify()** 方法都指明与 **for-in** 使用相同的枚举顺序，所以它们的枚举顺序目前也不明晰。



## 增强对象原型

### 改变对象的原型

正常情况下，无论是通过构造函数还是 **Object.create()** 方法创建对象，其原型是在对象被创建时指定的。对象原型在实例化之后保持不变，直到 **ECMAScript 5** 都是 **JavaScript** 编程最重要的设定之一，虽然在 **ECMAScript 5** 中添加了 **Object.getPrototypeOf()** 方法来返回任意指定对象的原型，但仍然缺少对象在实例化后改变原型的标准方法。

 **ECMAScript 6** 中添加了 **Object.setPrototypeOf()** 方法来改变这一现状，通过这个方法可以改变任意指定对象的原型, 它接收两个参数：**被改变原型的对象及替代第一个参数原型的对象**。

```javascript
let person = {
  getGreeting() {
    return 'Hello';
  }
};

let dog = {
  getGreeting() {
    return 'Woff';
  }
};

// 以 person 对象为原型
let friend = Object.create(person);
console.log(friend.getGreeting()); // "Hello"
console.log(Object.getPrototypeOf(friend) === person); // true

// 将原型设置为 dog
Object.setPrototypeOf(friend, dog);
console.log(friend.getGreeting()); // "Woff"
console.log(Object.getPrototypeOf(friend) === dog); // true
```

对象原型的真实值被储存在内部专有属性 **[[Prototype]]** 中，调用 **Object.getPrototypeOf()** 方法返回存储在其中的值，调用 **Object。setPrototypeOf()**方法改变其中的值。这不是操作 **[[Prototype]]** 值的唯一方法。

### 简化原型访问的 Super 引用

**ECMAScript 6** 引入了 **Super** 引用特性，使用它可以更便捷地访问对象原型。

**Super** 引用必须在使用简写方法的对象中使用，如果在其他方法声明中使用会导致语法错误。

```javascript
let person = {
  getGreeting() {
    return 'Hello';
  }
};

let dog = {
  getGreeting() {
    return 'Woff';
  }
};

let friend = {
  getGreeting() {
    // 正常使用
    return super.getGreeting() + ', Hi!';
  }
}

// 错误示例
friend = {
  getGreeting: function () {
    // 语法错误
    return super.getGreeting() + ', Hi!';
  }
}

Object.setPrototypeOf(friend, person);
```

过去想要实现继承的方式就比较繁琐，而且在**多重继承的场景**下会出现一些问题。

```javascript
let person = {
  getGreeting() {
    return 'Hello';
  }
};

let dog = {
  getGreeting() {
    return 'Woff';
  }
};

let friend = {
  getGreeting() {
    return Object.getPrototypeOf(this).getGreeting.call(this) + ', Hi!';
  }
}
// 将原型设置为 person
Object.setPrototypeOf(friend, person);

console.log(friend.getGreeting()); // "Hello, Hi!"
console.log(Object.getPrototypeOf(friend) === person); // true

// 原型设置为 dog
Object.setPrototypeOf(friend, dog);

console.log(friend.getGreeting()); // "Woff, Hi!"
console.log(Object.getPrototypeOf(friend) === dog); // true
```

其上使用 `Object.getPrototypeOf(this)` 方法确保继承的原型（`person`），`.call(this)`  用来确保被继承者的 `this` 值 （`friend`）。从而实现继承父级方法并重写方法。

**弊端：**

多重继承

```javascript
let relative = Object.create(friend);

console.log(person.getGreeting()); // "Hello"
console.log(friend.getGreeting()); // "Hello, Hi!";
console.log(relative.getGreeting()); // Uncaught RangeError: Maximum call stack size exceeded
```

**this** 是 **relative** , **relative** 的原型是 **friend** 对象，当执行  **relative** 的 **getGreeting** 方法时， `Object.getPrototypeOf(this).getGreeting.call(this)` 调用的是 **friend** 的 `getGreeting`方法，而此时的 `this` 值为 **relative** , 这样 **Object.getPrototypeOf(this)** 又会返回 **friend** 对象。所以就会**进入递归调用知道触发栈溢出报错**。

```javascript
let person = {
  getGreeting() {
    return 'Hello';
  }
};

let dog = {
  getGreeting() {
    return 'Woff';
  }
};

let friend = {
  getGreeting() {
    return super.getGreeting() + ', Hi!';
  }
}
// 将原型设置为 person
Object.setPrototypeOf(friend, person);

let relative = Object.create(friend);

console.log(person.getGreeting()); // "Hello"
console.log(friend.getGreeting()); // "Hello, Hi!";
console.log(relative.getGreeting()); // Uncaught RangeError: Maximum call stack size exceeded
```

使用 **Super 引用**，就不会导致这个错误了，因为  **Super 引用**不是动态的变化的，它总是指向正确的对象，上述这个例子, 无论多少方法继承了 **getGreeting** 方法，**super.getGreeting()** 指向的永远是 **person.getGreeting()**。

### 正式的方法定义

在 **ECMAScript 6** 中正式将方法定义为一个函数，之前对于 "方法" 的定义仅仅是一个具有功能而非数据的对象属性。

在对象中定义的方法它会有一个内部的 **[[HomeObject]]** 属性来容纳这个方法从属的对象。

```javascript
let person = {
  // 是方法
  getGreeting() {
    return 'Hello';
  }
}

// 不是方法
function shareGreeting() {
  return 'Hi!'
}
```

**getGreeting()** 方法的 **[[HomeObject]]** 属性值为 **person** 。**shareGreeting()** 函数并不是赋值给一个对象，所以没有  **[[HomeObject]]** 属性。

此属性在使用 **Super** 引用时就变的很有用了。**Super** 的所有引用都是通过  **[[HomeObject]]**  属性来确定后续的运行过程。第一步是在  **[[HomeObject]]** 属性上调用 **Object.getPrototypeOf()** 方法来检查原型的引用；然后搜寻原型找到同名函数；最后，设置 **this** 绑定并且调用相应的方法。

```javascript
let person = {
  getGreeting() {
    return 'Hello';
  }
};

let friend = {
  getGreeting() {
    return super.getGreeting() + ', Hi!';
  }
}
// 将原型设置为 person
Object.setPrototypeOf(friend, person);

console.log(friend.getGreeting()); // 'Hello, Hi!'
```

调用 **friend.getGreeting()** 方法会将  **person.getGreeting()** 的放回值与 `', Hi!'` 拼接成新的字符串并返回。 **friend.getGreeting()** 方法的   **[[HomeObject]]** 属性值 **friend** , **friend** 的原型是 **person** ,所以 **super.getGreeting()** 等价于 **person.getGreeting.call(this)** 。

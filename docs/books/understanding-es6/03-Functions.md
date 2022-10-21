# 函数

## 函数形参的默认值

在 `ECMAScript 5` 的时代，函数形参是没有默认值一说的，都是通过模拟来实现：

```javascript
function makeRequest (url, timeout, callback) {
  // 模拟默认值
  timeout = (typeof timeout !== 'undefined') ? timeout : 2000;
  callback = typeof callback !== 'undefined' ? callback : function () {};
}
```

`ECMAScript 6` 新增了对函数的默认参数值特性

```javascript
function makeRequest (url, timeout = 2000, callback = function() {}) {

}
```

声明函数时，可以为参数任意指定默认值，没有顺序要求，但这里需要注意的是：

* 传递参数只有为 `undefined` 时，才会使用默认值。

```javascript
function makeRequest (url, timeout = 2000, callback) {
  console.log(timeout)
}

// 使用默认值
makeRequest('/user', undefined, function () { console.log(timeout) }) // 2000

// 使用 null, null 是一个合法值
makeRequest('/user', null, function () { console.log(timeout) }) // null
```

### 默认参数对于 arguments 对象的影响

**ECMAScript 5** 非严格模式下，函数命名参数的变化会体现在 **arguments** 对象中，也就是命名参数的变化也会同步更新到 **arguments** 对象中。

```javascript
function mixArgs(a, b) {
  console.log(a === arguments[0]);
  console.log(b === arguments[1]);
  a = '3';
  b = '4';
  console.log(a === arguments[0]);
  console.log(b === arguments[1]);
}

mixArgs(1, 2);

// 输出结果
true
true
true
true
```

在严格模式下，这个同步更新的行为就被取消了，无论参数如何变化，**arguments** 对象不再随之改变，依然是初始调用时的值。

在 **ECMAScript 6** 中，只要使用了默认参数值，则无论是否显示定义严格模式， **arguments** 对象的行为都将与  **ECMAScript 5** 严格模式下保持一致。

### 默认参数表达式

默认参数值，可以传递非原始值，如 表达式、函数、函数调用后取得的值。

```javascript
function getValue() {
  return 5;
}

function add(first, second = getValue()) {
  return first + second;
}

console.log(add(1)); // 6
console.log(add(1, 2)); // 3
```

⚠️ 这里有个需要注意的就是："初次解析函数声明时不会调用 **getValue()** 方法，当调用 **add()** 函数且不传入第二个参数时才会调用。"

先定义的参数，可以作为后面定义参数的默认值，先定义的参数访问不到后定义的参数。这里涉及到**默认参数的临时死区 （TDZ）**的知识点。

### 默认参数的临时死区

函数的默认参数也同样会有**临时死区（TDZ）**。与 `let ` 声明类似，定义参数时会为每个参数创建一个新的标识符绑定，该绑定在初始化之前不可被引用，试图访问会导致程序抛出错误。调用函数时，会通过传入的值或参数的默认值初始化参数。

```javascript
// 抛出 first 变量已经被声明过了
function add(first, second) {
	let first = 1; // Uncaught SyntaxError: Identifier 'first' has already been declared
}
```

函数声明时，该每个参数绑定了一个新的标识符绑定，在初始化之前都不可被引用，`first` 和 `second` 被添加绑定到一个专属函数参数的临时死区。

函数参数实际执行过程：

```javascript
function add(first, second = 1) {
	return first + second;
}

add(1, 1);

// 函数被调用时，给参数进行初始化值
first = 1;
second = 1;
```

初始化 `second` 时 `first` 已经被初始化，所以它可以访问到 `first` 值。

## 处理无命名参数

**Javascript** 的函数语法规定，无论函数已定义的命名参数有多少，都不限制调用时传入的实际参数数量。

`ECMAScript 5` 是通过 `arguments` 对象来进行处理，`arguments` 对象包含了所有参数，在 `ECMASript 6` 支持了 `rest` 参数（不定参数, `rest parameters`），该参数是一个数组。

```javascript
function pick(object, ...keys) {
  let result = Object.create(null);

  for (let key of keys) {
    result[key] = object[key];
  }
  return result;
}

const info = pick({ title: 'ECMAScript 6', author: 'Nicholas C. Zakas', year: 2016 }, "author", "year");

console.log(info);// {author: "Nicholas C. Zakas", year: 2016}
```

> Tips:
>
> 函数的 `length` 熟悉统计的是函数命名参数的数量，不定参数的加入不会影响 `length` 属性的值。

**不定参数的两条使用限制：**

1. 每个函数最多只能声明一个不定参数，而且一定要放在所有参数的末尾。

2. 不定参数不能用于对象字面量 `setter` 之中。

   ```javascript
   let obj = {
     // 语法错误
     set name (....value) {
       // ...
     }
   }
   ```

## 增强的 Function 构造函数

通常使用 `Function` 构造函数是来动态创建新的函数。构造函数接收字符串形式的参数，分别为函数的参数及函数体。

```javascript
const add = new Function('first', 'second', 'return first + second');

console.log(add(1, 2)) // 3
```

在 `ECMAScript 6` 新增支持了**默认参数值**和**不定参数**两个特性，使其具备与声明式创建函数相同的能力。

```javascript
const add = new Function('first', 'second = first', 'return first + second');

console.log(add(1)); // 2

// rest paramters
const add2 = new Function('first', '...args', 'return args.reduce((a, b) => a + b, first)');

add2(1, 2, 3, 4, 5, 6); // 21
```

## 展开运算符

展开运算符与不定参数功能最相似，不过一个是展开一个是集合。

* **不定参数：** 可以让你指定的多个各个独立的参数，通过整合后的数组来访问；
* **展开运算符：** 可以让你指定的一个数组，将它们打散后作为各自独立的参数传入函数。

`Math.max()` 方法只接收任意数量的参数并返回最大值，但要是想从一个数组中挑选出最大的值，就得需要通过手动实现从数组中遍历取值，或者使用 `apply()` 方法:

```javascript
let arr = [1, 2, 3, 4, 5, 6, 7, 8];

const max_number = Math.max.apply(Math, arr);

console.log(max_number); // 8
```

**ECMAScript 6** 支持**展开运算符**后就简洁明了多了。

```javascript
let arr = [1, 2, 3, 4, 5, 6, 7, 8];

const max_number = Math.max(...arr);

console.log(max_number); // 8

const max_number2 = Math.max(...arr, 9);

console.log(max_number2); // 9
```

## name 属性

**ECMAScript 6** 中为所有函数新增 **name** 属性，使函数识别度更高一些，利于调试及追踪难以解读的栈记录。

函数的 `name` 属性的值不一定引用同名变量，它只是协助调试用的额外信息，所以不要使用 **name** 属性值来获取对于函数的引用。

各种函数形式的 **name** 属性：

```javascript
// 声明式函数
function doSometing() {
  // ...
}
console.log(doSomething.name) // doSomething

// 匿名表达式
var doAnotherThing = function () {};
console.log(doAnotherThing.name) // doAnotherThing

// 匿名表达式的特殊情况
// 函数表达式的名字，比函数本身赋值的变量的权重高。
var doSomething = function doSomethingElse() {};
console.log(doSomething.name) // doSomethingElse

// 使用 bind() 创建的新函数（绑定函数）
var doSomething_bind = doSometing.bind();
console.log(doSomething_bind.name); // "bound doSometing"

// Function 构造函数创建的函数
var add = new Function('first', 'second', 'retrun first + second');
console.log(add.name); // "anonymous"
```

> Tips:
>
> bound  为 bind 的过去分词
>
> anonymous 匿名的意思

## 明确函数的多重用途

`ECMAScript 6` 之前的早期规范中，函数有多重功能，如可以使用 `new ` 关键字实例化一个对象或直接调用函数。

```javascript
function Person (name) {
  this.name = name;
}

const person = new Person('Junting');
const antherPerson = Person('Junting');

console.log(person); // "[Object object]" Person { name: 'Junting' }
console.log(antherPerson); // "undefined"
```

构造函数还是只是一个普通的函数没有明确的标识使其函数身份相当混乱，在 `ECMAScript 6` 有了明确的改善，新增了**两个不同的内部方法：[[Call]] 和 [[Construct]]**。

* 当 `new` 关键字调用函数时，执行的是 **[[Construct]]** 函数，它负责创建一个通常被称作实例的新对象，然后执行函数体，将 `this` 绑定到实例上。具有 **[[Construct]]** 方法的函数被统称为**构造函数**。
* 如果不是 `new` 关键字调用函数，则执行 **[[Call]]** 函数，从而直接执行代码中的函数体。

> ⚠️ 注意：
>
> 不是所有函数都有 **[[Construct]]** 方法，所以不是所有函数都可以通过 `new` 关键字来调用，例如，箭头函数就没有这个 **[[Construct]]** 方法。

## 判断函数被调用的方法

### ECMAScript 5 里如何判断？

如何区分一个函数是否通过 `new` 关键字被调用，通常都是使用 `instanceof` ：

```javascript
function Person (name) {
  if (this instanceof Person) {
    this.name = name;
  } else {
    throw new Error('必须通过 new 关键字来调用 Person')
  }
}

const person = new Person('Junting');
const antherPerson = Person('Junting'); // 抛出错误
```

由于 `[[Construct]]` 方法会创建一个 `Person` 新实例，然后将 `this` 绑定到新实例上，然后通过检查 `this` 是否为构造函数的实例方式进行判断。

这种方式虽然正确当时并不完全可靠，通过强行将 `this` 绑定到 `Person` 上可以跳过此检查方式：

```javascript
function Person (name) {
  if (this instanceof Person) {
    this.name = name;
  } else {
    throw new Error('必须通过 new 关键字来调用 Person')
  }
}

const person = new Person('Junting');
const antherPerson = Person.call(person, 'Junting'); // OK
```

此方式相当于将 `Person` 函数里的 `this` 设为 `person` 实例，`instanceof ` 本身是无法区分是通过 `call()` 方法或者是 `apply()`方法，还是 `new` 关键字调用到得到的 `Person` 实例。

### ECMAScript 6 新增元属性 new.target

**元属性是指非对象的属性，其可以提供非对象目标的补充信息。**

当调用函数的 `[[Construct]]` 方法时，`new.target` 会被赋值为 `new` 操作符的目标，通常是新创建的对象实例，也就是函数体内 `this` 的构造函数。如果调用 `[[Call]]` 方法，则 `new.target` 的值为 `undefined`。

有了这个元属性，我们可以检查 `new.target` 是否被定义来安全地检测一个函数是否是通过 `new` 关键字来调用的：

```javascript
function Person (name) {
  if (typeof new.target !== 'undefined') {
    this.name = name;
  } else {
    throw new Error('必须通过 new 关键字来调用 Person')
  }
}

const person = new Person('Junting');
const antherPerson = Person.call(person, 'Junting'); // 抛出错误
```

也可以检查 `new.target` 是否被某个特定的构造函数所调用：

```javascript
function Person (name) {
  // 同等 typeof new.target !== 'undefined' ，
  // new.target 一定是 Person
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须通过 new 关键字来调用 Person')
  }
}

function AnotherPerson(name) {
  Person.call(this, name);
}
const person = new Person('Junting');
const anotherPerson = new AnotherPerson('Junting'); // 抛出错误

```

> ⚠️ 注意
>
> **new.target**  必须在函数内使用，否则会报语法错误。

## 块级函数

`ES3` 或早期版本中，在代码块中声明一个块级函数严格来说是一个语法错误，但是所有浏览器仍然支持这个特性（但每个浏览器对这个特性的支持稍有不同）。

在 `ES5` 为了遏制这种相互不兼容的行为，在**严格模式**中引入了一个语法错误提示：

```javascript
"use strict";

if (true) {
  // 在 ES5 中会抛出语法错误，ES6 不会
  function doSomething() {
    // ...
  }
}
```

在 `ES6` 中，支持了块级函数声明这个特性，

```javascript
"use strict";

if (true) {
  console.log(typeof doSomething); // function

  function doSomething() {
    // ...
  }

  doSomething();
}
console.log(typeof doSomething); // undefined
```

在定义函数的代码块内，块级函数会被提升至顶部，所以在函数声明之前也可以调用函数， 如 `typeof doSomething` 的值为 `function` 。但是一旦 `if` 语句代码块结束执行， `doSomething` 函数将不再存在。

### 块级函数的使用场景

块级函数与 `let` 函数表达式类似，一旦执行过程流出了代码块，函数定义立即移除。二者的区别是："在该代码块中，块级函数会被提升至块级代码顶部，而用 `let` 定义的函数表达式不会被提升。“

```javascript
"use strict";

if (true) {
  console.log(typeof doSomething); // 抛出错误

 let doSomething = function () {
    // ...
  }

  doSomething();
}
console.log(typeof doSomething); // undefined
```

如果需要函数提升至块顶部，就是选择块级函数；不需要，则选择 `let` 函数表达式。

以上都是在严格模式下，在非严格模式下， `ES6` 也支持块级函数特性，但是和在严格模式下稍有不同。

**非严格模式下，声明块级函数不再提升至代码块的顶部，而是提升至外围函数或全局函数作用域的顶部。**

```javascript
if (true) {
  console.log(typeof doSomething); // function

  function doSomething() {
    // ...
  }

  doSomething();
}
console.log(typeof doSomething); // function
```

## 箭头函数

**语法**

```JavaScript
(argu1, argu2, ...argus) = > {返回函数体}

// 没有参数的情况
let getVal = () => value;

// 单一参数， 相当于：let reflect = value => return value;
let reflect = value => value;

// 返回单一表达式
let sum = (a, b) => a + b;

// 不是单一表达式的情况
let sum1 = (a, b) => {
  // 其他一些逻辑
  return a + b; // 显示定义返回值
}

// 返回对象字面量
let getObj = () => ({ name: 'Junting', age: 18 }); // 需要用到小括号，区别这个不是函数体


// 空函数
let doNothing = () => {};
```

箭头函数与传统的 **JavaScript** 函数有些不同：

* **没有 this、super、arguments 和 new.target 元属性**；箭头函数中的**this**、**super**、**arguments  ** 及 **new.target** 这些值由外围最近一层非箭头函数决定。
* **不能通过 new 关键字调用**， 箭头函数没有 **[[Construct]]** 方法，所以不能被用作构造函数
* **没有原型**   不可以通过 **new** 关键字调用箭头函数，所以箭头函数也不存在 **prototype** 属性。
* **不可以改变 this 的绑定**  函数内部的 **this** 值不可被改变，在函数的生命周期内始终保持一致。
* **不支持 arguments 对象**  箭头函数没有 **arguments** 绑定，只能通过命名参数和不定参数这两种方式反问函数的参数。
* **不支持重复命名参数** 无论在严格模式还是非严格模式

这些**差异的产生的原因：**

1. 解决 **this** 绑定容易失去控制，从而诱发意想不到的行为
2. 限制箭头函数的 **this** 值，可以简化代码执行的过程，**JavaScript** 引擎可以更轻松地优化这些操作。
3. 减少错误以及理清模糊不清的地方

### 立即执行函数表达式

**通常创建的形式：**

```javascript
const person = function (name) {
  return {
    getName: function () {
      return name;
    }
  }
}('Junting');

console.log(person.getName()); // "Junting"
```

**箭头函数的方式：**

```javascript
const person = ((name) => {
  return {
    getName: function () {
      return name;
    }
  }
})('Junting');

console.log(person.getName()); // "Junting"
```

> ⚠️ 注意
>
> 小括号只包裹箭头函数定义，没有包含 ("Junting") ，这一点与正常函数有所不同，正常函数定义的立即执行函数表达式既可以用小括号包裹函数体，也可以额外包裹函数调用的部分。

### 箭头函数没有 this 绑定

函数内的 **this** 绑定是 `JavaScript` 最常出现的错误因素，函数内的 **this** 值可以根据函数调用的上下文而改变，很容易就影响到了其他对象。

箭头函数不存在 **this**  的绑定，其 `this` 值通过查找作用域链来决定其值。如果箭头函数被非箭头函数包含，则 `this` 绑定的是最近一层非箭头函数的 `this`; 否则，`this` 的值会被设置为全局对象。

**示例**

```javascript
let pageHandler = {
  id: 1,
  init: function () {
    document.addEventListener("click", function (event) {
      this.doSomething(event.type); // 抛出错误， 当前 this 指向的是 document
    }, false)
  },
  doSomething: function (type) {
    console.log("Handling " + type + "for " + this.id);
  }
}
```

过去解决类似的问题都是通过强绑定 `this` 来解决的，这样会造成额外的创建一个新的函数：

```javascript
let pageHandler = {
  id: 1,
  init: function () {
    document.addEventListener("click", (function (event) {
      this.doSomething(event.type);
    }).bind(this), false) // 指明 this 绑定值
  },
  doSomething: function (type) {
    console.log("Handling " + type + "for " + this.id);
  }
}
```

**箭头函数的方式：**

```Javascript
let pageHandler = {
  id: 1,
  init: function () {
    document.addEventListener("click", event => this.doSomething(event.type), false)
  },
  doSomething: function (type) {
    console.log("Handling " + type + "for " + this.id);
  }
}
```

箭头函数中 `this` 值取决于该函数外部非箭头函数的 **this** 值，且  `call()`、`apply()` 或 `bind()` 方法也不能改变 `this`的值。

### 箭头函数没有 arguments 对象

箭头函数没有自己的 **arguments** 对象,  且无论函数在哪个上下文中执行，箭头函数始终可以访问到外围函数的 **arguments** 对象。这是通过 `arguments` 标识符的作用域链解决方案规定的。

```javascript
function doSomething() {
  return () => arguments[0]
}

console.log(doSomething('Junting')()); // "Junting"
```

### 箭头函数的辨识方法

尽管箭头函数与传统函数的语法不同，但同样可以被识别出来

```javascript
let sum = (a, b) => a + b;

console.log(typeof sum); // "function"

console.log(sum instanceof Function); // true
```

## 尾调用优化

**ES6** 针对尾调用进行了引擎优化。

**尾调用** 指的是函数作为另一个函数的最后一条语句被调用。

```javascript
function doSomething() {
  return doSomethingElse(); // 尾调用
}
```

### ES6 之前尾调用存在的一些弊端

**ES5** 的引擎中，尾调用的实现与其他函数调用的实现类似：

创建一个新的栈帧（stack frame）,将其推入调用栈来表示函数的调用。

这种行为导致，在循环调用中，每一个未完成的栈帧都会被保存在内存中，当调用栈变得过大时会造成程序问题（内存溢出）。

### ES6 中尾调用优化

严格模式下缩减了尾调用栈的大小（非严格模式下不受影响），**满足以下条件，尾调用不会创建新的栈帧，而是清除并重用当前栈帧。**

* 尾调用不访问当前栈帧的变量（函数不是一个闭包）
* 在函数内部，尾调用是最后一条语句。
* 尾调用的结果作为函数值返回。（返回尾调用函数结果之前没有任何其他的操作 ）

```javascript
// 满足尾调用优化
"use strict";

function doSomething() {
  return doSomethingElse(); // 尾调用
}
```

该函数中， 尾调用 `doSomethingElse()` 的结果值作为返回值，立即返回，没有任何其他操作；也不调用局部任何作用域变量。

### 不满足条件的尾调用

1. 没有立即返回尾调用

   ```javascript
   "use strict";

   function doSomething() {
     // 无法优化，无返回
     doSomethingElse();
   }
   ```

2. 返回尾调用时还进行了其他操作

   ```javascript
   "use strict";

   function doSomething() {
     // 无法优化，必须在返回值后添加其他操作
     return 1 + doSomethingElse();
   }
   ```

3. 把尾调用的函数结果存储在一个变量里，最后再返回这个变量

   ```javascript
   "use strict";

   function doSomething() {
     var result = doSomethingElse()
     // 无法优化，调用不在尾部
     return result;
   }
   ```

4. 闭包

   ```javascript
   "use strict";

   function doSomething() {
     var num = 1,
         func = () => num;
     // 无法优化，该函数是一个闭包
     return func();
   }
   ```

### 如何利用尾调用优化

实际上，尾调用优化发生在引擎背后，除非你尝试优化一个函数，否则无须思考此类问题。**递归函数** 是其最主要的应用场景，此时尾调用优化的效果最显著。

**阶乘函数**

```javascript
// 1 * 2 * 3 * ...
function factorial(n) {
  if (n <= 1) {
    return 1;
  } else {
    // 无法优化，必须在返回后执行乘法操作
    return n * factorial(n - 1);
  }
}
```

如果 **n** 是一个非常大的数，则调用栈的尺寸就会不断增长并存在最终导致栈溢出的潜在风险。

**优化**

```javascript
"use strict";

function factorial(n, p = 1) {
  if (n <= 1) {
    return 1 * p;
  } else {
    // 每次先把下次需要被乘的数，先计算出来，作为参数传递
    let result = n * p;
    return factorial(n - 1, result);
  }
}
```

重写后，采用第二个参数 `p` 来保存乘法结果，每次迭代可以取出它用于下次计算，不再需要额外调用。直到乘到最小数 1, 把结果值返回。

> ⚠️ 注意
>
> ECMAScript 6 的尾调用优化标准处于接收审查阶段。

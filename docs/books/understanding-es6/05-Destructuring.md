# 解构：使数据访问更便捷

解构，是一种打破数据结构，将其拆分为更小部分的过程，简化获取信息的过程。

解构语法采用的是熟悉的 "**对象和数组字面量的语法**"

## 对象解构

```javascript
let person = {
  name: 'Junting',
  age: 18,
  sex: 'Sexy Man'
};

let { name, sex } = person;

console.log(name) // Junting
console.log(sex) // Sexy Man
```

**不要忘记初始化程序**

**初始化程序**也就是**等号右侧的值**，是变量容器拥有一个初始值的过程, **等号右侧的值**不能是 **null** 或 **undefined**。

使用 `var`、`let` 或 `const` 解构声明变量必须提供初始化程序，否则抛出语法错误。

```javascript
// 以下都会抛出语法错误
var {name, age }
let { name, age }
const { name, age }
```

不使用解构功能，则 `var` 和 `let` 声明不强制要求提供初始化程序，但 `const` 声明，无论如何都必须提供初始化程序。

### 解构赋值

**变量赋值时也可以使用解构语法：**

```javascript
let person = {
	name: 'Junting',
	age: 18,
  sex: 'Sexy Man'
},
name = 'Twitch',
age = 17;

// 给多个变量赋值, 必须使用小括号包裹
({ name, age } = person);

console.log(name) // Junting
console.log(age) // 18
```

> ⚠️ 注意
>
> 使用解构语法对变量赋值，必须要用一堆小括号包裹解构赋值语句。
> 因为 **JavaScript** 引擎将一对开放的花括号视为一个代码块，而语法规定，代码块语句不允许出现在赋值语句左侧，添加小括号后可以将块语句转化为一个表达式，从而实现整个解构赋值的过程。

解构赋值表达式的值与表达式右侧（ = 右侧）的值相等，如此一来，在任何可以使用值的地方都可以使用解构赋值表达式。

```javascript
let person = {
	name: 'Junting',
	age: 18,
  sex: 'Sexy Man'
},
name = 'Twitch',
age = 17;

function outputInfo(val) {
	console.log('val === person', val === person);
}

// 给函数传递参数中使用解构赋值，传递参数的同时对变量 name、age 重新赋值
outputInfo({name, age} = person);  // true

console.log(name); // Junting
console.log(age); // 18
```

### 默认值

解构赋值中，如果指定的局部变量名称在对象中不存在，那么这个局部变量会被赋值为 **undefiend**

```javascript
let person = {
	name: 'Junting',
	age: 18,
  sex: 'Sexy Man'
};

let { name, age, like,  hobby = 'cartoon'} = person;

console.log(like); // "undefined"
console.log(hobby); // 'carton' // 默认值
```

### 非同名局部变量赋值

解构赋值使用的都是与对象属性同名的局部变量，现在想使用不同名的局部变量来存储对象属性的值。

```javascript
let person = {
	name: 'Junting',
	age: 18,
  sex: 'Sexy Man'
};

let { name: firstName } = person;

console.log(firstName) // 'Junting'

// 使用不同名变量进行解构赋值，设定默认值
let { like: hobby = 'Coding' } = person;

console.log(hobby) // Coding
```

### 嵌套对象解构

```javascript
let person = {
	name: 'Junting',
	age: 18,
  sex: 'Sexy Man',
  info: {
    education: 'Undergraduate',
    graduateFrom: '2015'
  }
};

let { name, info: { education, graduateFrom }} = person;

console.log(name) // Junting
console.log(education) // Undergraduate
console.log(graduateFrom) // 2015

// 嵌套里也支持存储不同名的变量，和设置默认值
({info: { education: school = 'ssss', graduateFrom: year}} = person)

console.log(school) // Undergraduate
console.log(year) // year

console.log(info); // Uncaught ReferenceError: info is not defined
```

**所有冒号前的标识符都代表在对象中的检索位置(不会声明任何绑定)**，其右侧为被赋值的变量名；如果冒号后是花括号，则意味着要赋予的最终值嵌套在对象内部更深的层级中。

> ⚠️ 注意
>
> // 未声明任何的变量
>
> let { info: {} } = person;
>
> 内空花括号在对象解构中语法是合法的，但是这条语句却什么都不会做。
>
> 冒号前的标识符都代表在对象中的检索位置(不会声明任何绑定)

## 数组解构

数组解构与对象解构的语法相比，就比较简单多了，使用的是数组字面量，且解构操作全部在数组内完成，而不是像对象字面量语法一样使用对象的命名属性。

使用 **var**、**let** 或 **const** 声明数组解构的绑定时，必须要提供一个初始化程序。右侧数组解构赋值表达式的值为 **null** 或 **undefined** ，则会导致程序抛出错误。

```javascript
let colors = ['red', 'green', 'blue'];

let [ firstColor, secondColor ] = colors;

console.log(firstColor); // red
console.log(secondColor); // green
```

**数组解构语法中，是通过值在数组中的位置进行选取的**。且可以将其存储在任意变量中,未显示声明的元素都会被直接忽略。

> Notice:
>
> 数组解构过程中，并不会对数组本身产生任何变化。

```javascript
let colors = ['red', 'green', 'blue'];

let [,, thirdColor] = colors;

console.log(thirdColor); // blue
```

不想获取的元素，都可以通过**逗号进行占位** ，不需要进行对每个元素都指定变量名。

### 解构赋值

数组解构赋值和对象解构赋值有点区别，就是**不需要用小括号包裹表达式**。

```javascript
let colors = ['red', 'green', 'blue'], firstColor = 'black', secondColor = 'purple';

[firstColor, secondColor] = colors;

console.log(firstColor); // red
console.log(secondColor); // green
```

**数组解构语法还有一个独特的用处： 交换变量**

```javascript
let a = 1, b = 2;

[a, b] = [b, a];

console.log(a); // 2
console.log(b); // 1
```

### 默认值

```JavaScript
let colors = ["red"];

let [firstColor, secondColor = 'green'] = colors;

console.log(secondColor) // green
```

指定位置的属性不存在也没有给予默认值的，返回都是 **undefined**

### 嵌套数组解构

```javascript
let colors = ['red', ['green', 'blue']];

let [firstColor, [secondColor]] = colors;

console.log(firstColor) // 'red'
console.log(secondColor) // 'green'
```

### 不定元素

```javascript
let colors = ['red', 'green', 'blue'];
let [firstColor, ...restColors] = colors;

console.log(firstColor); // 'red'
console.log(...restColors); // ['green', 'blue']
```

**JavaScript** 在设计时，就遗漏了数组的复制功能。在 **ES5** 中，使用的都是 `concat()` 方法来克隆数组。

```javascript
let colors = ['red', 'green', 'blue'];

let cloneColors = colors.concat(); // 通过不给 concat 方法不传递参数
```

在 **ES6** 中，可以通过不定元素的语法来实现克隆数组。

```javascript
let colors = ['red', 'green', 'blue'];

let [...cloneColors] = colors; // 克隆

console.log(cloneColors); // ['red', 'green', 'blue']
```

**在被解构的数组中，不定元素必须为最后一个条目**，在后面继续添加逗号会导致程序抛出语法错误。

## 混合解构

```javascript
let person = {
  name: 'Junting',
  age: 18,
  like: ['Coding', 'Music', 'Play Game'],
  info: {
    school: 'University of San Francisco'，
    department: 'computers'
  }
}

let { like: [first], info: {school} } = person;

console.log(first); // Coding
console.log(school); // University of San Francisco
```

## 解构参数

在很多场景下，定义一个接收大量可选参数的 **JavaScript** 函数时，通常会创建一个可选对象，将额外的参数定义为这个对象的属性：

```javascript
// options 的属性表示其他参数
function setCookie(name, value, options) {
  options = options || {}; // options 设定默认值

  var secure = options.secure,
      path = options.path,
      domain = options.domain,
      expires = options.expires;

  // 设置 cookie 的代码
}

setCookie('userInfo', { name: 'Junting', age: 18 }, {
  secure: true,
  expires: 60000
})
```

`name` 和 `value` 是必须参数，`options` 为可选参数，在过去的基本像上述代码来处理可选参数，这样的声明函数，无法辨识函数的预期参数，必须要阅读函数体才可以确定所有参数情况。

**ES6** 支持函数默认参数和解构特性后，则在定义此类函数可以更清晰地了解函数预期传入的参数。

```javascript
// options 的属性表示其他参数
function setCookie(name, value, {secure, path, domain, expires}) {
  // 设置 cookie 的代码
}

setCookie('userInfo', { name: 'Junting', age: 18 }, {
  secure: true,
  expires: 60000
})
```

这种形式的大大简化了代码，也能更直观的查看到预期传递的参数。

### 解构参数必须传值

其上还是有一个弊端，不传递第三个可选参数，就会抛出语法错误：

```javascript
setCookie('userInfo', { name: 'Junting', age: 18 }) // 程序报错
```

缺失第三个参数，第三个参数值就为 **undefined** ,而使用**解构赋值表达式**时，等号右边的值不能为 **null** 或 **undefined**，否则程序报错 。

使用解构参数时，**JavaScript** 引擎实际上做了这些事情：

```javascript
function setCookie(name, value, options) {
  let {secure, path, domain, expires} = options;
  // 设置 cookie 的代码
}
```

### 解构参数的默认值

```javascript
const setCookieDefaults = {
  secure: '',
  path: '/',
  domain: 'example.com',
  exprise: new Date(Date.now + (24 * 60 * 60 * 1000))
}

function setCookie(name, value, {secure, path, domain, expires} = setCookieDefaults) {
  // 设置 cookie 的代码
}
```

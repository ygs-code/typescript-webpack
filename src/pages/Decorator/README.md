# TypeScript教程

## 接口

```
interface LabelledValue {
  label: string;
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

`LabelledValue`接口就好比一个名字，用来描述上面例子里的要求。 它代表了有一个 `label`属性且类型为`string`的对象。 需要注意的是，我们在这里并不能像在其它语言里一样，说传给 `printLabel`的对象实现了这个接口。我们只会去关注值的外形。 只要传入的对象满足上面提到的必要条件，那么它就是被允许的。

还有一点值得提的是，类型检查器不会去检查属性的顺序，只要相应的属性存在并且类型也是对的就可以。



### 可选属性

接口里的属性不全都是必需的。 有些是只在某些条件下存在，或者根本不存在。 可选属性在应用“option bags”模式时很常用，即给函数传入的参数对象中只有部分属性赋值了。

下面是应用了“option bags”的例子：

```
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): {color: string; area: number} {
  let newSquare = {color: "white", area: 100};
  if (config.color) {
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let mySquare = createSquare({color: "black"});
```

# 只读属性

一些对象属性只能在对象刚刚创建的时候修改其值。 你可以在属性名前用 `readonly`来指定只读属性:

```
interface Point {
    readonly x: number;
    readonly y: number;
}
```

## `readonly` vs `const`

最简单判断该用`readonly`还是`const`的方法是看要把它做为变量使用还是做为一个属性。 做为变量使用的话用 `const`，若做为属性则使用`readonly`。





# 额外的属性检查

我们在第一个例子里使用了接口，TypeScript让我们传入`{ size: number; label: string; }`到仅期望得到`{ label: string; }`的函数里。 我们已经学过了可选属性，并且知道他们在“option bags”模式里很有用。

然而，天真地将这两者结合的话就会像在JavaScript里那样搬起石头砸自己的脚。 比如，拿 `createSquare`例子来说：

```
nterface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    return {
        color:'red',
        area: 100,
    }
}

// 对象字面量只能指定已知的属性，但“colour”中不存在类型“SquareConfig”。是否要写入 color?
let mySquare = createSquare({ colour: "red", width: 100 });


```

绕开这些检查非常简单。 最简便的方法是使用类型断言：

```
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
```



然而，最佳的方式是能够添加一个字符串索引签名，前提是你能够确定这个对象可能具有某些做为特殊用途使用的额外属性。 如果 `SquareConfig`带有上面定义的类型的`color`和`width`属性，并且*还会*带有任意数量的其它属性，那么我们可以这样定义它：

```
interface SquareConfig {
    color?: string;
    width?: number;
    // 额外类型检查出
    [propName: string]: any;
}
```

我们稍后会讲到索引签名，但在这我们要表示的是`SquareConfig`可以有任意数量的属性，并且只要它们不是`color`和`width`，那么就无所谓它们的类型是什么。

还有最后一种跳过这些检查的方式，这可能会让你感到惊讶，它就是将这个对象赋值给一个另一个变量： 因为 `squareOptions`不会经过额外属性检查，所以编译器不会报错。

```
let squareOptions = { colour: "red", width: 100 };
let mySquare = createSquare(squareOptions);
```

要留意，在像上面一样的简单代码里，你可能不应该去绕开这些检查。 对于包含方法和内部状态的复杂对象字面量来讲，你可能需要使用这些技巧，但是大部额外属性检查错误是真正的bug。 就是说你遇到了额外类型检查出的错误，比如“option bags”，你应该去审查一下你的类型声明。 在这里，如果支持传入 `color`或`colour`属性到`createSquare`，你应该修改`SquareConfig`定义来体现出这一点。



# 函数类型

接口能够描述JavaScript中对象拥有的各种各样的外形。 除了描述带有属性的普通对象外，接口也可以描述函数类型。

为了使用接口表示函数类型，我们需要给接口定义一个调用签名。 它就像是一个只有参数列表和返回值类型的函数定义。参数列表里的每个参数都需要名字和类型。

```
interface SearchFunc {
  (source: string, subString: string): boolean;
}
```

这样定义后，我们可以像使用其它接口一样使用这个函数类型的接口。 下例展示了如何创建一个函数类型的变量，并将一个同类型的函数赋值给这个变量。

```
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
  let result = source.search(subString);
  return result > -1;
}
```

对于函数类型的类型检查来说，函数的参数名不需要与接口里定义的名字相匹配。 比如，我们使用下面的代码重写上面的例子：

```
let mySearch: SearchFunc;
mySearch = function(src: string, sub: string): boolean {
  let result = src.search(sub);
  return result > -1;
}
```



#### 可索引的类型

与使用接口描述函数类型差不多，我们也可以描述那些能够“通过索引得到”的类型，比如`a[10]`或`ageMap["daniel"]`。 可索引类型具有一个 *索引签名*，它描述了对象索引的类型，还有相应的索引返回值类型。 让我们看一个例子：

```
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```

上面例子里，我们定义了`StringArray`接口，它具有索引签名。 这个索引签名表示了当用 `number`去索引`StringArray`时会得到`string`类型的返回值。

TypeScript支持两种索引签名：字符串和数字。 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。 这是因为当使用 `number`来索引时，JavaScript会将它转换成`string`然后再去索引对象。 也就是说用 `100`（一个`number`）去索引等同于使用`"100"`（一个`string`）去索引，因此两者需要保持一致。

```
class Animal {
    name: string;
}
class Dog extends Animal {
    breed: string;
}

// 错误：使用数值型的字符串索引，有时会得到完全不同的Animal!
interface NotOkay {
    [x: number]: Animal;
    [x: string]: Dog;
}
```



# 类类型

## 实现接口

与C#或Java里接口的基本作用一样，TypeScript也能够用它来明确的强制一个类去符合某种契约。

```
interface ClockInterface {
    currentTime: Date;
}

class Clock implements ClockInterface {
    currentTime: Date;
    constructor(h: number, m: number) { }
}
```

你也可以在接口中描述一个方法，在类里实现它，如同下面的`setTime`方法一样：

```
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}

class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) { }
}
```

接口描述了类的公共部分，而不是公共和私有两部分。 它不会帮你检查类是否具有某些私有成员。





## 类静态部分与实例部分的区别

当你操作类和接口的时候，你要知道类是具有两个类型的：静态部分的类型和实例的类型。 你会注意到，当你用构造器签名去定义一个接口并试图定义一个类去实现这个接口时会得到一个错误：

```
interface ClockConstructor {
    new (hour: number, minute: number);
}

class Clock implements ClockConstructor {
    currentTime: Date;
    constructor(h: number, m: number) { }
}
```

这里因为当一个类实现了一个接口时，只对其实例部分进行类型检查。 constructor存在于类的静态部分，所以不在检查的范围内。

因此，我们应该直接操作类的静态部分。 看下面的例子，我们定义了两个接口， `ClockConstructor`为构造函数所用和`ClockInterface`为实例方法所用。 为了方便我们定义一个构造函数 `createClock`，它用传入的类型创建实例。

```





interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}

// 静态方法
interface ClockInterface {
  tick(): void;
}

function createClock(
  ctor: ClockConstructor,
  hour: number,
  minute: number
): ClockInterface {
  return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log('beep beep');
  }
}
class AnalogClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log('tick tock');
  }
}

// let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);
```

因为`createClock`的第一个参数是`ClockConstructor`类型，在`createClock(AnalogClock, 7, 32)`里，会检查`AnalogClock`是否符合构造函数签名。

# 继承接口

和类一样，接口也可以相互继承。 这让我们能够从一个接口里复制成员到另一个接口里，可以更灵活地将接口分割到可重用的模块里。

```
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
```

一个接口可以继承多个接口，创建出多个接口的合成接口。

```
interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Square extends Shape, PenStroke {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```



一个接口可以继承多个接口，创建出多个接口的合成接口。

```
interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Square extends Shape, PenStroke {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```



# 混合类型

先前我们提过，接口能够描述JavaScript里丰富的类型。 因为JavaScript其动态灵活的特点，有时你会希望一个对象可以同时具有上面提到的多种类型。

一个例子就是，一个对象可以同时做为函数和对象使用，并带有额外的属性。

```
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = <Counter>function (start: number) { };
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

在使用JavaScript第三方库的时候，你可能需要像上面那样去完整地定义类型。



# 接口继承类

当接口继承了一个类类型时，它会继承类的成员但不包括其实现。 就好像接口声明了所有类中存在的成员，但并没有提供具体实现一样。 接口同样会继承到类的private和protected成员。 这意味着当你创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（implement）。

当你有一个庞大的继承结构时这很有用，但要指出的是你的代码只在子类拥有特定属性时起作用。 这个子类除了继承至基类外与基类没有任何关系。 例：

```
class Control {
    private state: any;
}

// 接口继承类
interface SelectableControl extends Control {
    select(): void;
}

class Button extends Control implements SelectableControl {
    select() { }
}

class TextBox extends Control {
    select() { }
}

// 错误：“Image”类型缺少“state”属性。
class Image implements SelectableControl {
    select() { }
}

class Location {

}
```

在上面的例子里，`SelectableControl`包含了`Control`的所有成员，包括私有成员`state`。 因为 `state`是私有成员，所以只能够是`Control`的子类们才能实现`SelectableControl`接口。 因为只有 `Control`的子类才能够拥有一个声明于`Control`的私有成员`state`，这对私有成员的兼容性是必需的。

在`Control`类内部，是允许通过`SelectableControl`的实例来访问私有成员`state`的。 实际上， `SelectableControl`接口和拥有`select`方法的`Control`类是一样的。 `Button`和`TextBox`类是`SelectableControl`的子类（因为它们都继承自`Control`并有`select`方法），但`Image`和`Location`类并不是这样的。

















## class类

```
class Greeter {
   // 声明greeting 类型
    greeting: string;
      // 构造函数
    constructor(message: string) {
        this.greeting = message;
    }
    greet() : string {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");
```



继承

```
class Animal {
    move(distanceInMeters: number = 0) {
        console.log(`Animal moved ${distanceInMeters}m.`);
    }
}

class Dog extends Animal {
    bark() {
        console.log('Woof! Woof!');
    }
}

const dog = new Dog();
dog.bark();
dog.move(10);
dog.bark();
```



继承

```
class Animal {
    // 声明 this.name 类型
    name: string;
    // 构造函数
    constructor(theName: string) { 
       this.name = theName; 
    }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

// 继承类
class Snake extends Animal {
    // 
    constructor(name: string) {
       // 调用 父类 构造函数 冒充继承意思
       super(name);
    }
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        // 调用父类函数
        super.move(distanceInMeters);
    }
}

class Horse extends Animal {
    constructor(name: string) { 
       super(name);
    }
    move(distanceInMeters = 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}

let sam = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);
```



# 公共，私有与受保护的修饰符

## 默认为 `public`

在上面的例子里，我们可以自由的访问程序里定义的成员。 如果你对其它语言中的类比较了解，就会注意到我们在之前的代码里并没有使用 `public`来做修饰；例如，C#要求必须明确地使用 `public`指定成员是可见的。 在TypeScript里，成员都默认为 `public`。

你也可以明确的将一个成员标记成 `public`。 我们可以用下面的方式来重写上面的 `Animal`类：

```
class Animal {
    public name: string;
    public constructor(theName: string) { this.name = theName; }
    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```

## 理解 `private`

当成员被标记成 `private`时，它就不能在声明它的类的外部访问。比如：

```

class Animal {
  private name: string;
  
  constructor(theName: string) {
       this.name = theName;
  }
  

  getName(){
    return   this.name
  }

}


 let cat =  new Animal("Cat");  
 cat.name()// 属性“name”为私有属性，只能在类“Animal”中访问。
 // 所以只能通过一个方法去访问
console.log(cat.getName()); // Cat

```

**在TypeScript中，私有成员（private）不能被继承**‌。私有成员只能在定义它们的类内部访问，子类无法直接访问父类的私有成员。这是TypeScript设计的一个核心原则，旨在封装和保护类的内部状态，防止外部或子类的不当访问‌

***private：只有类内部可以访问。不可以继承 实例化对象不可以访问属性***





TypeScript使用的是结构性类型系统。 当我们比较两种不同的类型时，并不在乎它们从何处而来，如果所有成员的类型都是兼容的，我们就认为它们的类型是兼容的。

然而，当我们比较带有 `private`或 `protected`成员的类型的时候，情况就不同了。 如果其中一个类型里包含一个 `private`成员，那么只有当另外一个类型中也存在这样一个 `private`成员， 并且它们都是来自同一处声明时，我们才认为这两个类型是兼容的。 对于 `protected`成员也使用这个规则。

下面来看一个例子，更好地说明了这一点：



```
class Animal {
    private name: string;
    constructor(theName: string) { 
       this.name = theName; 
    }
}

class Rhino extends Animal {
    constructor() {
        super("Rhino"); 
    }
}

class Employee {
    private name: string;
    constructor(theName: string) { 
        this.name = theName;
    }
}

let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");

animal = rhino;
animal = employee; // 错误: Animal 与 Employee 不兼容.
```

这个例子中有 `Animal`和 `Rhino`两个类， `Rhino`是 `Animal`类的子类。 还有一个 `Employee`类，其类型看上去与 `Animal`是相同的。 我们创建了几个这些类的实例，并相互赋值来看看会发生什么。 因为 `Animal`和 `Rhino`共享了来自 `Animal`里的私有成员定义 `private name: string`，因此它们是兼容的。 然而 `Employee`却不是这样。当把 `Employee`赋值给 `Animal`的时候，得到一个错误，说它们的类型不兼容。 尽管 `Employee`里也有一个私有成员 `name`，但它明显不是 `Animal`里面定义的那个。







## 理解 `protected`

`protected`修饰符与 `private`修饰符的行为很相似，但有一点不同， `protected`成员在派生类中仍然可以访问。例如：

```
class Person {
    protected name: string;
    constructor(name: string) { 
       this.name = name;
    }
}

class Employee extends Person {

    private  department: string;

    constructor(name: string, department: string) {
        super(name)
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales");
console.log(howard.getElevatorPitch());
console.log(howard.name); // 错误
```

注意，我们不能在 `Person`类外使用 `name`，但是我们仍然可以通过 `Employee`类的实例方法访问，因为 `Employee`是由 `Person`派生而来的。

构造函数也可以被标记成 `protected`。 这意味着这个类不能在包含它的类外被实例化，但是能被继承。比如，

***protected：类内部和子类可以访问。说明是可以继承，但是 实例化对象不可以访问属性***



```
class Person {
    protected name: string;
    protected constructor(theName: string) {
       this.name = theName; 
    }
}

// Employee 能够继承 Person
class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name);
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales");
let john = new Person("John"); // 错误: 'Person' 的构造函数是被保护的.
```



# readonly修饰符

你可以使用 `readonly`关键字将属性设置为只读的。 只读属性必须在声明时或构造函数里被初始化。



```
class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit"; // 错误! name 是只读的.

```

实例化完不可以修改，只能读取

## 参数属性

在上面的例子中，我们必须在`Octopus`类里定义一个只读成员 `name`和一个参数为 `theName`的构造函数，并且立刻将 `theName`的值赋给 `name`，这种情况经常会遇到。

 *参数属性*可以方便地让我们在一个地方定义并初始化一个成员。 下面的例子是对之前 `Octopus`类的修改版，使用了参数属性：

```
class Octopus {
    readonly numberOfLegs: number = 8;
    constructor(readonly name: string) {
    
    }
}
```

注意看我们是如何舍弃了 `theName`，仅在构造函数里使用 `readonly name: string`参数来创建和初始化 `name`成员。 我们把声明和赋值合并至一处。

参数属性通过给构造函数参数前面添加一个访问限定符来声明。 使用 `private`限定一个参数属性会声明并初始化一个私有成员；对于 `public`和 `protected`来说也是一样。



# 存取器

TypeScript支持通过getters/setters来截取对对象成员的访问。 它能帮助你有效的控制对对象成员的访问。

下面来看如何把一个简单的类改写成使用 `get`和 `set`。 首先，我们从一个没有使用存取器的例子开始。



```
class Employee {
    fullName: string;
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    console.log(employee.fullName);
}
```

我们可以随意的设置 `fullName`，这是非常方便的，但是这也可能会带来麻烦。

下面这个版本里，我们先检查用户密码是否正确，然后再允许其修改员工信息。 我们把对 `fullName`的直接访问改成了可以检查密码的 `set`方法。 我们也加了一个 `get`方法，让上面的例子仍然可以工作。

 **get 和set 方法就是访问 或者设置值的时候会调用该方法 **

```
let passcode = "secret passcode";

class Employee {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (passcode && passcode == "secret passcode") {
            this._fullName = newName;
        }
        else {
            console.log("Error: Unauthorized update of employee!");
        }
    }
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    alert(employee.fullName);
}
```

我们可以修改一下密码，来验证一下存取器是否是工作的。当密码不对时，会提示我们没有权限去修改员工。

对于存取器有下面几点需要注意的：

首先，存取器要求你将编译器设置为输出ECMAScript 5或更高。 不支持降级到ECMAScript 3。 其次，只带有 `get`不带有 `set`的存取器自动被推断为 `readonly`。 这在从代码生成 `.d.ts`文件时是有帮助的，因为利用这个属性的用户会看到不允许够改变它的值。





# 静态属性

到目前为止，我们只讨论了类的实例成员，那些仅当类被实例化的时候才会被初始化的属性。 我们也可以创建类的静态成员，这些属性存在于类本身上面而不是类的实例上。 在这个例子里，我们使用 `static`定义 `origin`，因为它是所有网格都会用到的属性。 每个实例想要访问这个属性的时候，都要在 `origin`前面加上类名。 如同在实例属性上使用 `this.`前缀来访问属性一样，这里我们使用 `Grid.`来访问静态属性。

*** 静态属性是不需要实例化的，可以直接在类中可以访问到的 ***

```
class Grid {
    static origin = {x: 0, y: 0};
    calculateDistanceFromOrigin(point: {x: number; y: number;}) {
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor (public scale: number) { }
}

let grid1 = new Grid(1.0);  // 1x scale
let grid2 = new Grid(5.0);  // 5x scale

console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
console.log(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));
```



# 抽象类

抽象类做为其它派生类的基类使用。 它们一般不会直接被实例化。 不同于接口，抽象类可以包含成员的实现细节。 `abstract`关键字是用于定义抽象类和在抽象类内部定义抽象方法。

```
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log('roaming the earch...');
    }
}
```



抽象类中的抽象方法不包含具体实现并且必须在派生类中实现。 抽象方法的语法与接口方法相似。 两者都是定义方法签名但不包含方法体。 然而，抽象方法必须包含 `abstract`关键字并且可以包含访问修饰符。

```
abstract class Department {

    constructor(public name: string) {
    }

    printName(): void {
        console.log('Department name: ' + this.name);
    }

    // 继承该类的子类 必须要实现这个方法
    abstract printMeeting(): void; // 必须在派生类中实现
}




class AccountingDepartment extends Department {

    constructor() {
        super('Accounting and Auditing'); // 在派生类的构造函数中必须调用 super()
    }
    // 继承该类的子类 必须要实现这个方法
    printMeeting(): void {
        console.log('The Accounting Department meets each Monday at 10am.');
    }

    generateReports(): void {
        console.log('Generating accounting reports...');
    }
}

let department: Department; // 允许创建一个对抽象类型的引用

department = new Department(); // 错误: 不能创建一个抽象类的实例

department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值


department.printName();
department.printMeeting();
department.generateReports(); // 错误: 方法在声明的抽象类中不存在
```



抽象类也可以添加多自定义方法，但是不能对抽象类型的引用

```
abstract class Department {

    constructor(public name: string) {
    }

    printName(): void {
        console.log('Department name: ' + this.name);
    }

    // 继承该类的子类 必须要实现这个方法
    abstract printMeeting(): void; // 必须在派生类中实现
}




class AccountingDepartment extends Department {

    constructor() {
        super('Accounting and Auditing'); // 在派生类的构造函数中必须调用 super()
    }
    // 继承该类的子类 必须要实现这个方法
    printMeeting(): void {
        console.log('The Accounting Department meets each Monday at 10am.');
    }

    generateReports(): void {
        console.log('Generating accounting reports...');
    }
}

let department; // 允许创建一个对抽象类型的引用

 

department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值


department.printName();
department.printMeeting();
department.generateReports(); // 这样就不会报错了
```

## 把类当做接口使用

如上一节里所讲的，类定义会创建两个东西：类的实例类型和一个构造函数。 因为类可以创建出类型，所以你能够在允许使用接口的地方使用类。

```
class Point {
    x: number;
    y: number;
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```



React 类使用

```
 // 声明 state 类型
interface TestState {
  name: string;
}

// 声明 props 类型
interface TestProps {
  age: number;
}


// 
class Test extends Component<TestProps, TestState> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: 'Test',
    };
  }

  render() {
    const { age } = this.props;
    return <div>{this.state.name}</div>;
  }
}
```



# 装饰器

## 方法装饰器

```
// 方法装饰器
function methodDecorator(options: Object) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    console.log('decoratorFunction');

    // 保存原始方法
    const originalMethod = descriptor.value;

    // 修改方法
    descriptor.value = function (...args: any[]) {
      console.log(`Calling method ${propertyKey}`);
      const result = originalMethod.apply(this, args);
      console.log(`Method ${propertyKey} returned ${result}`);
      return result;
    };

    return descriptor;
  };
}

// 函数装饰器
class C {
  @methodDecorator({})
  method(id: string): string {
    console.log('method');
    return id;
  }
}

let c = new C();
c.method('id');

```



## 类装饰器

```
// 1. 类装饰器
const classDecorator = (options: Object) => {
  return (Target: new (...args: any[]) => any): new (...args: any[]) => any => {
    return class extends Target {
      constructor(name: string, age: number) {
        super(name, age);
        console.log('sealed');
      }
      getName() {
        return this.name;
      }
    };
  };
};

@classDecorator({})
class Greeter<T extends { name: string; age: number; getName: () => string }> {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    // super(name, age);
    this.name = name;
    this.age = age;
  }
  getAge() {
    return this.age;
  }
  // getName(): string {
  //   return this.name;
  // }
}

let greeter = new Greeter('John', 30) 

console.log(greeter.getName()); // John  类型“Greeter<{ name: string; age: number; getName: () => string; }>”上不存在属性“getName”。
console.log(greeter.getAge()); // 30

```

你的代码中出现了类型错误，因为 `Greeter` 类没有 `getName` 方法。虽然你在装饰器中添加了 `getName` 方法，但 TypeScript 类型系统并不知道这一点。

你可以通过以下方式解决这个问题：

1. **在装饰器中明确类型**：更新装饰器返回的类的类型，使其包含 `getName` 方法。
2. **使用类型断言**：在实例化 `Greeter` 时，使用类型断言来告诉 TypeScript 这个实例具有 `getName` 方法。



解决

```
// 1. 类装饰器
const classDecorator = (options: Object) => {
  return (Target: new (...args: any[]) => any): new (...args: any[]) => any => {
    return class extends Target {
      name: string;
      age: number;
      constructor(name: string, age: number) {
        super(name, age);
        this.name = name;
        this.age = age;
        console.log('sealed');
      }
      getName() {
        return this.name;
      }
    };
  };
};

@classDecorator({})
class Greeter {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  getAge() {
    return this.age;
  }
}

//在这个示例中，我在实例化 `Greeter` 时使用了类型断言，告诉 TypeScript 这个实例具有 `getName` 方法。这样可以避免类型错误。
let greeter = new Greeter('John', 30) as Greeter & { getName: () => string }; 

console.log(greeter.getName()); // John

```

在这个示例中，我在实例化 `Greeter` 时使用了类型断言，告诉 TypeScript 这个实例具有 `getName` 方法。这样可以避免类型错误。



还可以其他方式

```

interface Greeter {
  getName(): string;
}

 

const classDecorator = (options: Object) => {
  return (Target: new (...args: any[]) => any): new (...args: any[]) => any => {
    return class extends Target  {
      name: string;
      age: number;
      constructor(name: string, age: number) {
        super(name, age);
        this.name = name;
        this.age = age;
        console.log('sealed');
      }
      getName() {
        return this.name;
      }
    };
  };
};

@classDecorator({})
class Greeter implements Greeter {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  getAge() {
    return this.age;
  }
}

let greeter = new Greeter('John', 30);
console.log(greeter.getName()); // John

```

`implements` 是 TypeScript 中的一个关键字，用于表示一个类实现了某个接口。接口定义了类必须实现的属性和方法，而 `implements` 关键字确保类遵循接口的契约。



# d.ts 使用

声明类型  

**在TS中模块既可以以单个文件的形式存在，这与JS相同，通过export和import两个关键字进行导出导入，对应的介绍可以参照[这篇文章](https://hunter1024.blog.csdn.net/article/details/128880531#ESM（ECMAScript Modules）)的ESM部分，也可以使用module关键字定义模块。**

```
export type IAnimal = {
    name: string
    color?: string
}
export type ICat = {
    name: string
    color?: string
}
export type IDog = {
    name: string
    color?: string
}
```

### 使用

```
import type { IAnimal, ICat, IDog } from './test.d';

const animal: IAnimal = {
  name: '阿黄',
};
const dog: IDog = animal;
const cat: ICat = animal;
```





### 也可以全局模块配置tsconfig.json 配置 修改 typeRoots， include 

在项目中增加  "./types" 目录

```
{
  "compilerOptions": {
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "baseUrl": "./",
    "paths": {
      "src/*": ["src/*"],
      "@/*": ["src/*"],
      "@assets/*": ["src/assets/*"],
      "@components/*": ["src/components/*"],
      "@pages/*": ["src/pages/*"],
      "@redux/*": ["src/redux/*"],
      "@utils/*": ["src/utils/*"]
    },
    "typeRoots": ["./node_modules/@types" , "./types"], 
    "types": ["react", "node"],
    "allowSyntheticDefaultImports": true,
    "outDir": "./dist/",
    "rootDir": "./src",
    "sourceMap": true,
    "noImplicitAny": true,
    "module": "commonjs",
    "target": "ES6",
    "jsx": "react-jsx", // 对于 TypeScript 4.x 和 React 17+
    "allowJs": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*", "typings.d.ts" , "types/**/*"],
  "exclude": ["node_modules"]
}

```

types 增加 global.d.ts

```

// global.d.ts
//全局 模块声明
declare module 'global_type' {
    export type IAnimal = {
        name: string
    }
    export type ICat = {
        name: string
    }
}

//全局 模块声明
declare module 'global_type1' {
    export type IDog = {
        name: string
    }
}

 
```



使用 

```
 // 引用模块
 import type { IAnimal, ICat } from "global_type"
 import type { IDog } from 'global_type1'

 

const animal: IAnimal = {
  name: '阿黄',
};
const dog: IDog = animal;
const cat: ICat = animal;

```



# 索引签名类型

循环枚举类, 对象类型，其中所有键都是字符串类型，并且所有值也是字符串类型。

````
type StringMap = { [key: string]: string };

const myMap: StringMap = {
  name: "John",
  age: "30",
  city: "Tokyo"
};

console.log(myMap.name); // John
console.log(myMap.age); // 30
console.log(myMap.city); // Tokyo



type StringMap = { [key: string]: Function };

const myMap: StringMap = {
  getName: ()=>{  return  'John' },
  getAge:()=>{ return  '30' },
  getCity: ()=>{ return  'Tokyo'}
};

console.log(myMap.getName()); // John
console.log(myMap.getAge()); // 30
console.log(myMap.getCity()); // Tokyo

````











# 泛型

# 介绍

软件工程中，我们不仅要创建一致的定义良好的API，同时也要考虑可重用性。 组件不仅能够支持当前的数据类型，同时也能支持未来的数据类型，这在创建大型系统时为你提供了十分灵活的功能。

在像C#和Java这样的语言中，可以使用`泛型`来创建可重用的组件，一个组件可以支持多种类型的数据。 这样用户就可以以自己的数据类型来使用组件。

# 泛型之Hello World

下面来创建第一个使用泛型的例子：identity函数。 这个函数会返回任何传入它的值。 你可以把这个函数当成是 `echo`命令。

不用泛型的话，这个函数可能是下面这样：

```
function identity(arg: number): number {
    return arg;
}
```

或者，我们使用`any`类型来定义函数：

```
function identity(arg: any): any {
    return arg;
}
```

使用`any`类型会导致这个函数可以接收任何类型的`arg`参数，这样就丢失了一些信息：传入的类型与返回的类型应该是相同的。如果我们传入一个数字，我们只知道任何类型的值都有可能被返回。

因此，我们需要一种方法使返回值的类型与传入参数的类型是相同的。 这里，我们使用了 *类型变量*，它是一种特殊的变量，只用于表示类型而不是值。

```
function identity<T>(arg: T): T {
    return arg;
}
```

我们给identity添加了类型变量`T`。 `T`帮助我们捕获用户传入的类型（比如：`number`），之后我们就可以使用这个类型。 之后我们再次使用了 `T`当做返回值类型。现在我们可以知道参数类型与返回值类型是相同的了。 这允许我们跟踪函数里使用的类型的信息。

我们把这个版本的`identity`函数叫做泛型，因为它可以适用于多个类型。 不同于使用 `any`，它不会丢失信息，像第一个例子那像保持准确性，传入数值类型并返回数值类型。

我们定义了泛型函数后，可以用两种方法使用。 第一种是，传入所有的参数，包含类型参数：



```
let output = identity<string>("myString");  // type of output will be 'string'
```

这里我们明确的指定了`T`是`string`类型，并做为一个参数传给函数，使用了`<>`括起来而不是`()`。

第二种方法更普遍。利用了*类型推论* -- 即编译器会根据传入的参数自动地帮助我们确定T的类型：

```
let output = identity("myString");  // type of output will be 'string'
```

注意我们没必要使用尖括号（`<>`）来明确地传入类型；编译器可以查看`myString`的值，然后把`T`设置为它的类型。 类型推论帮助我们保持代码精简和高可读性。如果编译器不能够自动地推断出类型的话，只能像上面那样明确的传入T的类型，在一些复杂的情况下，这是可能出现的。

# 使用泛型变量

使用泛型创建像`identity`这样的泛型函数时，编译器要求你在函数体必须正确的使用这个通用的类型。 换句话说，你必须把这些参数当做是任意或所有类型。

看下之前`identity`例子：

```
function identity<T>(arg: T): T {
    return arg;
}
```

 如果我们想同时打印出`arg`的长度。 我们很可能会这样做：

```
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
```

如果这么做，编译器会报错说我们使用了`arg`的`.length`属性，但是没有地方指明`arg`具有这个属性。 记住，这些类型变量代表的是任意类型，所以使用这个函数的人可能传入的是个数字，而数字是没有 `.length`属性的。

现在假设我们想操作`T`类型的数组而不直接是`T`。由于我们操作的是数组，所以`.length`属性是应该存在的。 我们可以像创建其它数组一样创建这个数组：

```
function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

你可以这样理解`loggingIdentity`的类型：泛型函数`loggingIdentity`，接收类型参数`T`和参数`arg`，它是个元素类型是`T`的数组，并返回元素类型是`T`的数组。 如果我们传入数字数组，将返回一个数字数组，因为此时 `T`的的类型为`number`。 这可以让我们把泛型变量T当做类型的一部分使用，而不是整个类型，增加了灵活性。

我们也可以这样实现上面的例子：

```
function loggingIdentity<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

使用过其它语言的话，你可能对这种语法已经很熟悉了。 在下一节，会介绍如何创建自定义泛型像 `Array<T>`一样。



# 泛型类型

上一节，我们创建了identity通用函数，可以适用于不同的类型。 在这节，我们研究一下函数本身的类型，以及如何创建泛型接口。

泛型函数的类型与非泛型函数的类型没什么不同，只是有一个类型参数在最前面，像函数声明一样：

```
function identity<T>(arg: T): T {
    return arg;
}
//   <T>(arg: T) => T 是类型声明
let myIdentity: <T>(arg: T) => T = identity;
```

我们也可以使用不同的泛型参数名，只要在数量上和使用方式上能对应上就可以。

所以可以随便命名 T U B 都行

```
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: <U>(arg: U) => U = identity;
```

我们还可以使用带有调用签名的对象字面量来定义泛型函数：

```
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: {<T>(arg: T): T} = identity;
```

这引导我们去写第一个泛型接口了。 我们把上面例子里的对象字面量拿出来做为一个接口：

```
interface GenericIdentityFn {
    <T>(arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn = identity;
```



一个相似的例子，我们可能想把泛型参数当作整个接口的一个参数。 这样我们就能清楚的知道使用的具体是哪个泛型类型（比如： `Dictionary<string>而不只是Dictionary`）。 这样接口里的其它成员也能知道这个参数的类型了。

```
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

注意，我们的示例做了少许改动。 不再描述泛型函数，而是把非泛型函数签名作为泛型类型一部分。 当我们使用 `GenericIdentityFn`的时候，还得传入一个类型参数来指定泛型类型（这里是：`number`），锁定了之后代码里使用的类型。 对于描述哪部分类型属于泛型部分来说，理解何时把参数放在调用签名里和何时放在接口上是很有帮助的。

除了泛型接口，我们还可以创建泛型类。 注意，无法创建泛型枚举和泛型命名空间。


















let test: string = '123';

// import type { IAnimal, ICat } from "global_type"
// import type { IDog } from 'global_type1'  

import type { IAnimal, ICat, IDog } from './test.d';

const animal: IAnimal = {
  name: '阿黄',
};
const dog: IDog = animal;
const cat: ICat = animal;

interface SquareConfig {
  color?: string;
  width?: number;

  [propName: string]: any;
}



 

// function identity<T>(arg: T): T {
//     return arg;
// }

 

// let output = identity<string>("myString"); 


 




function identity<B>(arg: B): B {
    return arg;
}

let myIdentity1: <T> (arg: T) => T = identity;


let myIdentity2: <S>(arg: S) => S = identity;


let myIdentity3: {<T>(arg: T): T} = identity;


console.log('myIdentity1=', myIdentity1(123))  
console.log('myIdentity2=', myIdentity2(123))  
console.log('myIdentity3=', myIdentity3(123))  
  



// 继承接口
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;


function createSquare(config: SquareConfig): { color: string; area: number } {
  // ...

  return {
    color: 'red',
    area: 100,
  };
}

let mySquare = createSquare({ colour: 'red', width: 100 });
// let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);

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

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);

// const animal: IAnimal = {
//     name: "阿黄",
// };

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

// // 1. 类装饰器
// const classDecorator = (options: Object) => {
//   return (Target: new (...args: any[]) => any): new (...args: any[]) => any => {
//     return class extends Target {
//       constructor(name: string, age: number) {
//         super(name, age);
//         console.log('sealed');
//       }
//       getName() {
//         return this.name;
//       }
//     };
//   };
// };

// @classDecorator({})
// class Greeter<T extends { name: string; age: number; getName: () => string }> {
//   name: string;
//   age: number;
//   constructor(name: string, age: number) {
//     // super(name, age);
//     this.name = name;
//     this.age = age;
//   }
//   getAge() {
//     return this.age;
//   }
//   // getName(): string {
//   //   return this.name;
//   // }
// }

// let greeter = new Greeter('John', 30)

// console.log(greeter.getName()); // John
// console.log(greeter.getAge()); // 30

// // 1. 类装饰器
// const classDecorator = (options: Object) => {
//   return (Target: new (...args: any[]) => any): new (...args: any[]) => any => {
//     return class extends Target {
//       name: string;
//       age: number;
//       constructor(name: string, age: number) {
//         super(name, age);
//         this.name = name;
//         this.age = age;
//         console.log('sealed');
//       }
//       getName() {
//         return this.name;
//       }
//     };
//   };
// };

// @classDecorator({})
// class Greeter {
//   name: string;
//   age: number;
//   constructor(name: string, age: number) {
//     this.name = name;
//     this.age = age;
//   }
//   getAge() {
//     return this.age;
//   }
// }

// let greeter = new Greeter('John', 30) as Greeter & { getName: () => string };
// console.log(greeter.getName()); // John

interface Greeter {
  // getName(): string;
}

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

// 继承

class Person {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  getName() {
    return this.name;
  }
}

class Teacher extends Person {
  constructor(name: string, age: number) {
    super(name, age);
    this.name = name;
    this.age = age;
  }

  getAge() {
    return this.age;
  }
}

let teacher = new Teacher('John', 30);
console.log(teacher.getName()); // John
console.log(teacher.getAge()); // 30

type Constructor = new (...args: any[]) => {};
interface Person {
  getTime(): void;
}
function LogTime<T extends Constructor>(target: T) {
  return class extends target {
    createdTime: Date;
    constructor(...args: any) {
      super(...args);
      this.createdTime = new Date();
    }

    getTime() {
      console.log(this.createdTime);
    }
  };
}

@LogTime
class Person1 {
  constructor(public name: string, public age: number) {}
}

const p1 = new Person1('Alex', 12);
p1.getTime();

// 扩展一个toString方法
type Consturctor = { new (...args: any[]): any };

function toString<T extends Consturctor>(target: T): T {
  return class extends target {
    constructor(...args: any[]) {
      super(...args);
    }
    public string() {
      return JSON.stringify(this);
    }
    public getName() {
      return this.name;
    }
  };
}

@toString
class Car {
  constructor(public prize: number, public name: string) {}
}

let car = new Car(1000, 'BMW');

// ts不会智能的推导出toString方法
console.log(car.string()); // {"prize":1000,"name":"BMW"}
console.log(car.getName()); // {"prize":1000,"name":"BMW"}

class Animal {
  private name: string;

  constructor(theName: string) {
    this.name = theName;
  }

  getName() {
    return this.name;
  }
}

let cat1 = new Animal('Cat');
//  cat.name()// 属性“name”为私有属性，只能在类“Animal”中访问。
console.log(cat1.getName()); // Cat

abstract class Department {
  constructor(public name: string) {}

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

// department = new Department(); // 错误: 不能创建一个抽象类的实例

department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值

department.printName();
department.printMeeting();
// department.generateReports(); // 错误: 方法在声明的抽象类中不存在

export default test;

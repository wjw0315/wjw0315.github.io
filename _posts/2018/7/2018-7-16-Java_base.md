---
layout:     post                  
title:      Java基础      
subtitle:   Java_base         
date:       2018-7-16             
author:     JiaweiWu                   
header-img: img/post-bg-rwd.jpg  
catalog: true                          
tags:                             
- Java基础 
---
  
# 一：    数据类型

## 1、基本数据类型：

byte：Java中最小的数据类型，在内存中占8位(bit)，即1个字节，取值范围-128~127，默认值0

short：短整型，在内存中占16位，即2个字节，取值范围-32768~32717，默认值0

int：整型，用于存储整数，在内在中占32位，即4个字节，取值范围-2147483648~2147483647，默认值0

long：长整型，在内存中占64位，即8个字节-2^63~2^63-1，默认值0

float：浮点型，在内存中占32位，即4个字节，用于存储带小数点的数字（与double的区别在于float类型有效小数点只有6~7位），默认值0.0

double：双精度浮点型，用于存储带有小数点的数字，在内存中占64位，即8个字节，默认值0.0

char：字符型，用于存储单个字符，占16位，即2个字节，取值范围0~65535，默认值为空

boolean：布尔类型，占1个字节，用于判断真或假（仅有两个值，即true、false），默认值false

> 基本类型都有对应的包装类型，基本类型与其对应的包装类型之间的赋值使用自动装箱与拆箱完成

```
Integer x = 6;     // 装箱
int y = x;         // 拆箱
```
## 2、缓存池

new Integer(12) 与 Integer.valueOf(12) 的区别在于，new Integer(12) 每次都会新建一个对象，而 Integer.valueOf(12) 可能会使用缓存对象，因此多次使用 Integer.valueOf(12) 会取得同一个对象的引用。

```
Integer x = new Integer(12);
Integer y = new Integer(12);
System.out.println(x == y);    // false
Integer z = Integer.valueOf(12);
Integer k = Integer.valueOf(12);
System.out.println(z == k);   // true
```

编译器会在自动装箱过程调用 valueOf() 方法，因此多个 Integer 实例使用自动装箱来创建并且值相同，那么就会引用相同的对象。

```
Integer m = 123;
Integer n = 123;
System.out.println(m == n); // true
```

在 Java 8 中，Integer 缓存池的大小默认为 -128\~127。

Java 基本类型的值放在缓冲池中，包含以下这些：

- boolean values true and false
- all byte values
- short values between -128 and 127
- int values between -128 and 127
- char in the range \u0000 to \u007F

因此在使用这些基本类型对应的包装类型时，就可以直接使用缓冲池中的对象。



# 二、特殊的String

String是被声明为final，因此它是不能被继承的。

**源码解析**

```
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    /** The value is used for character storage. */
    private final char value[];
```

内部使用 char 数组存储数据，该数组被声明为 final，这意味着 value 数组初始化之后就不能再引用其它数组。并且 String 内部没有改变 value 数组的方法，因此可以保证 String 不可变。

## 不可变的好处

**1. 可以缓存 hash 值**

因为 String 的 hash 值经常被使用，例如 String 用做 HashMap 的 key。不可变的特性可以使得 hash 值也不可变，因此只需要进行一次计算。

**2. String Pool 的需要**

如果一个 String 对象已经被创建过了，那么就会从 String Pool 中取得引用。只有 String 是不可变的，才可能使用 String Pool。

**3. 安全性**

String 经常作为参数，String 不可变性可以保证参数不可变。例如在作为网络连接参数的情况下如果 String 是可变的，那么在网络连接过程中，String 被改变，改变 String 对象的那一方以为现在连接的是其它主机，而实际情况却不一定是。

**4. 线程安全**

String 不可变性天生具备线程安全，可以在多个线程中安全地使用。

## String Pool

> 字符串常量池（String Pool）保存着所有字符串字面量（literal strings），这些字面量在编译时期就确定。不仅如此，还可以使用 String 的 intern() 方法在运行过程中将字符串添加到 String Pool 中。

> 当一个字符串调用 intern() 方法时，如果 String Pool 中已经存在一个字符串和该字符串值相等（使用 equals() 方法进行确定），那么就会返回 String Pool 中字符串的引用；否则，就会在 String Pool 中添加一个新的字符串，并返回这个新字符串的引用。

下面示例中，s1 和 s2 采用 new String() 的方式新建了两个不同字符串，而 s3 和 s4 是通过 s1.intern() 方法取得一个字符串引用。intern() 首先把 s1 引用的字符串放到 String Pool 中，然后返回这个字符串引用。因此 s3 和 s4 引用的是同一个字符串。
```
String s1 = new String("aaa");
String s2 = new String("aaa");
System.out.println(s1 == s2);           // false
String s3 = s1.intern();
String s4 = s1.intern();
System.out.println(s3 == s4);           // true
```
如果是采用 "bbb" 这种字面量的形式创建字符串，会自动地将字符串放入 String Pool 中。
```
String s5 = "bbb";
String s6 = "bbb";
System.out.println(s5 == s6);  // true
```

**在 Java 7 之前，String Pool 被放在运行时常量池中，它属于永久代。而在 Java 7，String Pool 被移到堆中。这是因为永久代的空间有限，在大量使用字符串的场景下会导致 OutOfMemoryError 错误。**

## new String("abc")

使用这种方式一共会创建两个字符串对象 **（前提是 String Pool 中还没有 "abc" 字符串对象）** 。

"abc" 属于字符串字面量，因此编译时期会在 String Pool 中创建一个字符串对象，指向这个 "abc" 字符串字面量；
而使用 new 的方式会在堆中创建一个字符串对象。

## String, StringBuffer and StringBuilder

**1. 可变性**

String 不可变
StringBuffer 和 StringBuilder 可变

**2. 线程安全**

String 不可变，因此是线程安全的
StringBuilder 不是线程安全的
StringBuffer 是线程安全的，内部使用 synchronized 进行同步

**对于三者使用的总结：**

- 操作少量的数据 = String
- 单线程操作字符串缓冲区下操作大量数据 = StringBuilder
- 多线程操作字符串缓冲区下操作大量数据 = StringBuffer


# 三、运算

## 参数的传递

记住一点：参数的传递只有 **值传递**，而不是引用传递

以下代码中 Dog dog 的 dog 是一个指针，存储的是对象的地址。在将一个参数传入一个方法时，本质上是将对象的地址以值的方式传递到形参中。因此在方法中使指针引用其它对象，那么这两个指针此时指向的是完全不同的对象，在一方改变其所指向对象的内容时对另一方没有影响。

```
public class Dog {

    String name;

    Dog(String name) {
        this.name = name;
    }

    String getName() {
        return this.name;
    }

    void setName(String name) {
        this.name = name;
    }

    String getObjectAddress() {
        return super.toString();
    }
}
```
```
public class Example {
    public static void main(String[] args) {
        Dog dog = new Dog("A");
        System.out.println(dog.getObjectAddress()); // Dog@4554617c
        func(dog);
        System.out.println(dog.getObjectAddress()); // Dog@4554617c
        System.out.println(dog.getName());          // A
    }

    private static void func(Dog dog) {
        System.out.println(dog.getObjectAddress()); // Dog@4554617c
        dog = new Dog("B");
        System.out.println(dog.getObjectAddress()); // Dog@74a14482
        System.out.println(dog.getName());          // B
    }
}
```

如果在方法中改变对象的字段值会改变原对象该字段值，因为改变的是同一个地址指向的内容。

```
class Example {
    public static void main(String[] args) {
        Dog dog = new Dog("A");
        func(dog);
        System.out.println(dog.getName());          // B
    }

    private static void func(Dog dog) {
        dog.setName("B");
    }
}
```

## float 与 double

Java 不能隐式执行向下转型，因为这会使得精度降低。

1.1 字面量属于 double 类型，不能直接将 1.1 直接赋值给 float 变量，因为这是向下转型。
**(当你不声明的时候，默认小数都用double来表示，所以如果要用float的话，则应该在其后加上f)**

`// float f = 1.1;`

1.1f 字面量才是 float 类型。

`float f = 1.1f;`

低级类型的变量可以直接转换成高级类型的变量，不需要强制转换

`double a=1.1f;`

## 隐式类型转换

因为字面量 1 是 int 类型，它比 short 类型精度要高，因此不能隐式地将 int 类型下转型为 short 类型。
```
short s1 = 1;
// s1 = s1 + 1;(false)
```
但是使用 += 或者 ++ 运算符可以执行隐式类型转换。
```
s1 += 1;
// s1++;
```
上面的语句相当于将 s1 + 1 的计算结果进行了向下转型：
```
s1 = (short) (s1 + 1);
```

## switch

从 Java 7 开始，可以在 switch 条件判断语句中使用 String 对象。
```
String s = "a";
switch (s) {
    case "a":
        System.out.println("aaa");
        break;
    case "b":
        System.out.println("bbb");
        break;
}
```
switch 不支持 long，是因为 switch 的设计初衷是对那些只有少数的几个值进行等值判断，如果值过于复杂，那么还是用 if 比较合适。
```
  Incompatible types. Found: 'long', required: 'char, byte, short, int, Character, Byte, Short, Integer, String, or an enum'
 ```
 
# 四、继承
 
## 访问权限
 
![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/10-12/1.png)

> 设计良好的模块会隐藏所有的实现细节，把它的 API 与它的实现清晰地隔离开来。模块之间只通过它们的 API 进行通信，一个模块不需要知道其他模块的内部工作情况，这个概念被称为信息隐藏或封装。因此访问权限应当尽可能地使每个类或者成员不被外界访问。

> 如果子类的方法重写了父类的方法，那么子类中该方法的访问级别不允许低于父类的访问级别。这是为了确保可以使用父类实例的地方都可以使用子类实例，也就是确保满足里氏替换原则。

> 字段决不能是公有的，因为这么做的话就失去了对这个字段修改行为的控制，客户端可以对其随意修改。

## 抽象类与接口

#### 1. 抽象类

抽象类和抽象方法都使用 abstract 关键字进行声明。抽象类一般会包含抽象方法，抽象方法一定位于抽象类中。

抽象类和普通类最大的区别是，抽象类不能被实例化，需要继承抽象类才能实例化其子类。
```
public abstract class AbstractClassExample {

    protected int x;
    private int y;

    public abstract void func1();

    public void func2() {
        System.out.println("func2");
    }
}
```
```
public class AbstractExtendClassExample extends AbstractClassExample {
    @Override
    public void func1() {
        System.out.println("func1");
    }
}
```
```
// AbstractClassExample ac1 = new AbstractClassExample(); // 抽象类不能实例化
AbstractClassExample ac2 = new AbstractExtendClassExample();
ac2.func1();
```
#### 2. 接口

接口是抽象类的延伸，在 Java 8 之前，它可以看成是一个完全抽象的类，也就是说它不能有任何的方法实现。

从 Java 8 开始，接口也可以拥有默认的方法实现，这是因为不支持默认方法的接口的维护成本太高了。在 Java 8 之前，如果一个接口想要添加新的方法，那么要修改所有实现了该接口的类。

接口的成员（字段 + 方法）默认都是 public 的，并且不允许定义为 private 或者 protected。

接口的字段默认都是 static 和 final 的。
```
public interface InterfaceExample {

    void func1();

    default void func2(){
        System.out.println("func2");
    }

    int x = 123;
    // int y;               // 没有进行初始化是不允许的
    public int z = 0;       //  接口成员默认都是public的，所以此处的public多余
    // private int k = 0;   // Modifier 'private' not allowed here
    // protected int l = 0; // Modifier 'protected' not allowed here
    // private void fun3(); // Modifier 'private' not allowed here
}
```
```
public class InterfaceImplementExample implements InterfaceExample {
    @Override
    public void func1() {
        System.out.println("func1");
    }
}
```
```
// InterfaceExample ie1 = new InterfaceExample(); // 接口是抽象类的延伸，同样的不能进行实例化
InterfaceExample ie2 = new InterfaceImplementExample();
ie2.func1();
System.out.println(InterfaceExample.x);
```
#### 3. 比较

- 从设计层面上看，抽象类提供了一种 IS-A 关系，那么就必须满足里式替换原则，即子类对象必须能够替换掉所有父类对象。而接口更像是一种 LIKE-A 关系，它只是提供一种方法实现契约，并不要求接口和实现接口的类具有 IS-A 关系。
- 从使用上来看，一个类可以实现多个接口，但是不能继承多个抽象类。
- 接口的字段只能是 static 和 final 类型的，而抽象类的字段没有这种限制。
- 接口的成员只能是 public 的，而抽象类的成员可以有多种访问权限。

#### 4. 使用选择

**使用接口：**

- 需要让不相关的类都实现一个方法，例如不相关的类都可以实现 Compareable 接口中的 compareTo() 方法；
- 需要使用多重继承。

**使用抽象类：**

- 需要在几个相关的类中共享代码。
- 需要能控制继承来的成员的访问权限，而不是都为 public。
- 需要继承非静态和非常量字段。

> 在很多情况下，接口优先于抽象类。因为接口没有抽象类严格的类层次结构要求，可以灵活地为一个类添加行为。并且从 Java 8 开始，接口也可以有默认的方法实现，使得修改接口的成本也变的很低。


## Super 

- 访问父类的构造函数：可以使用 super() 函数访问父类的构造函数，从而委托父类完成一些初始化的工作。
- 访问父类的成员：如果子类重写了父类的某个方法，可以通过使用 super 关键字来引用父类的方法实现。
```
public class SuperExample {

    protected int x;
    protected int y;

    public SuperExample(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public void func() {
        System.out.println("SuperExample.func()");
    }
}
```
```
public class SuperExtendExample extends SuperExample {

    private int z;

    public SuperExtendExample(int x, int y, int z) {
        super(x, y);
        this.z = z;
    }

    @Override
    public void func() {
        super.func();
        System.out.println("SuperExtendExample.func()");
    }
}
```
```
SuperExample e = new SuperExtendExample(1, 2, 3);
e.func();
```
```
SuperExample.func()
SuperExtendExample.func()
```

## 重载与重写

#### 1、重载（Overload）

存在于同一个类中，指一个方法与已经存在的方法名称上相同，但是**参数类型、个数、顺序至少有一个不同**。

应该注意的是，返回值可同可不同。

#### 2、重写（Override）

存在于继承体系中，指子类实现了一个与父类在方法声明上完全相同的一个方法。

为了满足里式替换原则，重写有有以下两个限制：

- 子类方法的访问权限必须大于等于父类方法；
- 子类方法的返回类型必须是父类方法返回类型或为其子类型。

使用 `@Override` 注解，可以让编译器帮忙检查是否满足上面的两个限制条件。

# 五、Object的通用方法
```
public native int hashCode()

public boolean equals(Object obj)

protected native Object clone() throws CloneNotSupportedException

public String toString()

public final native Class<?> getClass()

protected void finalize() throws Throwable {}

public final native void notify()

public final native void notifyAll()

public final native void wait(long timeout) throws InterruptedException

public final void wait(long timeout, int nanos) throws InterruptedException

public final void wait() throws InterruptedException
```

## equals()

#### 1. 等价关系

**Ⅰ 自反性**

`x.equals(x); // true`

**Ⅱ 对称性**

`x.equals(y) == y.equals(x); // true`

**Ⅲ 传递性**
```
if (x.equals(y) && y.equals(z))
    x.equals(z); // true;
```
**Ⅳ 一致性**

多次调用 equals() 方法结果不变

`x.equals(y) == x.equals(y); // true`

**Ⅴ 与 null 的比较**

对任何==不是 null 的对象== x 调用 x.equals(null) 结果都为 false

`x.equals(null); // false;`

**[注]：注意是不为NULL的对象，NULL对象调用.equals()会报空指针异常**

#### 2. 等价与相等

对于基本类型，== 判断两个值是否相等，基本类型没有 equals() 方法。
对于引用类型，== 判断两个变量是否引用同一个对象，而 equals() 判断引用的对象是否等价。
```
Integer x = new Integer(1);
Integer y = new Integer(1);
System.out.println(x.equals(y)); // true
System.out.println(x == y);      // false
```
#### 3. 实现

检查是否为同一个对象的引用，如果是直接返回 true；
检查是否是同一个类型，如果不是，直接返回 false；
将 Object 对象进行转型；
判断每个关键域是否相等。
```
public class EqualExample {

    private int x;
    private int y;
    private int z;

    public EqualExample(int x, int y, int z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        EqualExample that = (EqualExample) o;

        if (x != that.x) return false;
        if (y != that.y) return false;
        return z == that.z;
    }
}
```

## hashCode()

hashCode() 返回散列值，而 equals() 是用来判断两个对象是否等价。**等价的两个对象散列值一定相同，但是散列值相同的两个对象不一定等价**。

在覆盖 equals() 方法时应当总是覆盖 hashCode() 方法，保证等价的两个对象散列值也相等。

## clone()

#### 1. cloneable

> clone() 是 Object 的 protected 方法，它不是 public，一个类不显式去重写 clone()，其它类就不能直接去调用该类实例的 clone() 方法。
```
public class CloneExample {
    private int a;
    private int b;
}
```
```
CloneExample e1 = new CloneExample();
// CloneExample e2 = e1.clone(); //  在 'java.lang.Object'中clone()是protected，在没有重写的情况下不能直接调用clone（）方法
```

重写 clone() 得到以下实现：
```
public class CloneExample {
    private int a;
    private int b;

    @Override
    public CloneExample clone() throws CloneNotSupportedException {
        return (CloneExample)super.clone();
    }
}
CloneExample e1 = new CloneExample();
try {
    CloneExample e2 = e1.clone();
} catch (CloneNotSupportedException e) {
    e.printStackTrace();
}
```

`java.lang.CloneNotSupportedException: CloneExample`
以上抛出了 `CloneNotSupportedException`，这是因为 CloneExample 没有实现 `Cloneable` 接口。

应该注意的是，clone() 方法并不是 Cloneable 接口的方法，而是 Object 的一个 protected 方法。Cloneable 接口只是规定，如果一个类没有实现 Cloneable 接口又调用了 clone() 方法，就会抛出 `CloneNotSupportedException`。
```
public class CloneExample implements Cloneable {
    private int a;
    private int b;

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
```
#### 2. 浅拷贝

拷贝对象和原始对象的引用类型引用同一个对象。
```
public class ShallowCloneExample implements Cloneable {

    private int[] arr;

    public ShallowCloneExample() {
        arr = new int[10];
        for (int i = 0; i < arr.length; i++) {
            arr[i] = i;
        }
    }

    public void set(int index, int value) {
        arr[index] = value;
    }

    public int get(int index) {
        return arr[index];
    }

    @Override
    protected ShallowCloneExample clone() throws CloneNotSupportedException {
        return (ShallowCloneExample) super.clone();
    }
}
```

```
ShallowCloneExample e1 = new ShallowCloneExample();
ShallowCloneExample e2 = null;
try {
    e2 = e1.clone();
} catch (CloneNotSupportedException e) {
    e.printStackTrace();
}
e1.set(2, 222);
System.out.println(e2.get(2)); // 222
```

#### 3. 深拷贝

拷贝对象和原始对象的引用类型引用不同对象。
```
public class DeepCloneExample implements Cloneable {

    private int[] arr;

    public DeepCloneExample() {
        arr = new int[10];
        for (int i = 0; i < arr.length; i++) {
            arr[i] = i;
        }
    }

    public void set(int index, int value) {
        arr[index] = value;
    }

    public int get(int index) {
        return arr[index];
    }

    @Override
    protected DeepCloneExample clone() throws CloneNotSupportedException {
        DeepCloneExample result = (DeepCloneExample) super.clone();
        result.arr = new int[arr.length];
        for (int i = 0; i < arr.length; i++) {
            result.arr[i] = arr[i];
        }
        return result;
    }
}
```
```
DeepCloneExample e1 = new DeepCloneExample();
DeepCloneExample e2 = null;
try {
    e2 = e1.clone();
} catch (CloneNotSupportedException e) {
    e.printStackTrace();
}

e1.set(2, 222);
System.out.println(e2.get(2)); // 2
```
#### 4. clone() 的替代方案

使用 clone() 方法来拷贝一个对象即复杂又有风险，它会抛出异常，并且还需要类型转换。Effective Java 书上讲到，最好不要去使用 clone()，可以使用拷贝构造函数或者拷贝工厂来拷贝一个对象。
```
public class CloneConstructorExample {

    private int[] arr;

    public CloneConstructorExample() {
        arr = new int[10];
        for (int i = 0; i < arr.length; i++) {
            arr[i] = i;
        }
    }

    public CloneConstructorExample(CloneConstructorExample original) {
        arr = new int[original.arr.length];
        for (int i = 0; i < original.arr.length; i++) {
            arr[i] = original.arr[i];
        }
    }

    public void set(int index, int value) {
        arr[index] = value;
    }

    public int get(int index) {
        return arr[index];
    }
}
```
```
CloneConstructorExample e1 = new CloneConstructorExample();
CloneConstructorExample e2 = new CloneConstructorExample(e1);
e1.set(2, 222);
System.out.println(e2.get(2)); // 2
```

## 六、关键字



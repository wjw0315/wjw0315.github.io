---
layout:     post                  
title:      Java基础 （未完）     
subtitle:   Java_base         
date:       2018-7-16             
author:     wjw                   
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


---
layout:     post
title:      Java程序的执行顺序
subtitle:   Java程序的执行顺序     
date:       2018-3-30 
author:     wjw
header-img: img/post-bg-rwd.jpg 
catalog: true
stickie: true
tags:
    - Java基础
--- 

**先来一题看程序结果：**

```
public class Test1 {
public static String name;
    public static String name=get();
    public Test1() {
    }
    public static String get() {
        System.out.println("Test start");
        return "test name";
    }
    public static void main(String[] args) {
        System.out.println("main start");
        Text bb = new Text();
    }
}
```

那么答案是什么？
```
main start
test start
```

**那你就out啦**

正确答案是：
```
test start
main start
```

不是从main方法执行的吗？是怎么回事呢？

Java程序运行时，第一件事情就是试图访问main方法，因为main相等于程序的入口，如果没有main方法，程序将无法启动，main方法更是占一个独立的线程，找到main方法后，是不是就会执行mian方法块里的第一句话呢？答案是不一定

分析：

    因为静态部分是依赖于类，而不是依赖于对象存在的，所以静态部分的加载优先于对象存在。
	
当找到main方法后，因为main方法虽然是一个特殊的静态方法，但是还是静态方法，此时JVM会加载main方法所在的类，试图找到类中其他静态部分，即首先会找main方法所在的类，然后会按照顺序执行类中的静态代码，包括静态变量，静态方法和静态代码块，静态方法在不会主动调用，但会加载。静态方法执行完之后，才是动态代码的执行，包括动态属性赋值和代码块

**执行顺序大致分类：**

1.静态属性，静态方法声明，静态块。

2.动态属性，普通方法声明，构造块。

3.构造方法。

- 1.1 静态：

当加载一个类时，JVM会根据属性的数据类型第一时间赋默认值（一举生成的）。然后再进行静态属性初始化，并为静态属性分配内存空间，静态方法的声明，静态块的加载，没有优先级之分，按出现顺序执行，静态部分仅仅加载一次。至此为止，必要的类都已经加载完毕，对象就可以被创建了。

- 1.2 普通：

当new一个对象时，此时会调用构造方法，但是在调用构造方法之前，（此刻1.1已经完成，除非被打断而暂停）执行动态属性定义并设置默认值（一举生成的）。然后动态属性初始化，分配内存，构造块，普通方法声明（只是加载，它不需要初始化，只有调用它时才分配内存，当方法执行完毕后内存立即释放），没有优先级之分，按出现顺序执行。最后进行构造方法中赋值。当再次创建一个对象，不再执行静态部分，仅仅重复执行普通部分。

**现在是否有些理解了呢？**

我们再来分析下刚开始的测试题：

1、首先jvm找到main入口，加载整个类
2、找到整个类所有的静态部分，包括静态变量和静态代码块，静态方法，这里是先找到name，发现它调用了get()方法，就先执行get方法，打印 test start ,返回值给name,执行完成之后，发现没有其他的静态变量或代码块啦，就执行main方法，打印main start

再来道测试题：

```
class A {
    public A() {
        System.out.println("A的构造方法");
    }
	{
		System.out.println("A的构造块");
	}
    public static int j = print();

    public static int print() {
        System.out.println("A print");
        return 521;
    }
	public void b(){
		System.out.println("A的普通函数");
	}
}

public class Test1 extends A {
    public Test1() {
        System.out.println("Test1的构造方法");
    }
	{
		System.out.println("Test1的构造块");
	}
    public static int k = print();

    public static int print() {
        System.out.println("Test print");
        return 522;
    }
	public void c(){
		System.out.println("Test1的普通函数");
	}

    public static void main(String[] args) {
        System.out.println("main start");
        Test1 t1 = new Test1();
		t1.c();
		t1.b();
		//t1.c();
    }
}
```

运行结果：

A print
Test print
main start
A的构造块
A的构造方法
Test1的构造块
Test1的构造方
Test1的普通函
A的普通函数

如果存在继承关系，会先执行父类的静态部分，再执行子类的静态部分，再执行父类的动态部分，再执行子类的动态部分。

创建对象时，依然会首先进行动态属性进行定义并设默认值，然后父类的构造器才会被调用，其他一切都是先父类再子类（因为子类的static初始化可能会依赖于父类成员能否被正确初始化），如果父类还有父类，依次类推，不管你是否打算产生一个该父类的对象，这都是自然发生的。

再来一个测试题：

```
public class Base
{
    private String baseName = "base";
    public Base()
    {
        callName();
    }

    public void callName()
    {
        System. out. println(baseName);
    }

    static class Sub extends Base
    {
        private String baseName = "sub";
        public void callName()
        {
            System. out. println (baseName) ;
        }
    }
    public static void main(String[] args)
    {
        Base b = new Sub();
    }
}
```

你认为的结果是什么？null？sub?还是base?

正确的结果为：**null**

分析：
new sub();之后，首先是父类成员初始化，父类的构造函数调用callName（）的方法，在子类中有对父类方法的重写，所以覆盖了父类的callName（），此时的子类还并没有进行初始化，所以重写的方法打印出来的值为null。

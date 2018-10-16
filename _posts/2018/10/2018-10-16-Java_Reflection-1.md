---
layout:     post                  
title:      深入解析Java反射-基础篇      
subtitle:   Java_Reflection         
date:       2018-10-16             
author:     JiaweWu                   
header-img: img/post-bg-rwd.jpg  
catalog: true                          
tags:                             
- Java基础 
---

# 一、什么是反射

> 反射 (Reflection) 是 Java 的特征之一，它允许运行中的 Java 程序获取自身的信息，并且可以操作类或对象的内部属性。

简而言之，通过反射，我们可以在运行时获得程序或程序集中每一个类型的成员和成员的信息。程序中一般的对象的类型都是在编译期就确定下来的，而 Java 反射机制可以动态地创建对象并调用其属性，这样的对象的类型在编译期是未知的。所以我们可以通过反射机制直接创建对象，即使这个对象的类型在编译期是未知的。

反射的核心是 JVM 在运行时才动态加载类或调用方法/访问属性，它不需要事先（写代码的时候或编译期）知道运行对象是谁。

Java 反射主要提供以下功能：

- 在运行时判断任意一个对象所属的类；
- 在运行时构造任意一个类的对象；
- 在运行时判断任意一个类所具有的成员变量和方法（通过反射甚至可以调用private方法）；
- 在运行时调用任意一个对象的方法

**重点：是==运行时==而不是编译时**

# 二、反射的主要用途

很多人都认为反射在实际的 Java 开发应用中并不广泛，其实不然。当我们在使用 IDE(如 Eclipse，IDEA)时，当我们输入一个对象或类并想调用它的属性或方法时，一按点号，编译器就会自动列出它的属性或方法，这里就会用到反射。

反射最重要的用途就是开发各种通用框架。很多框架（比如 Spring）都是配置化的（比如通过 XML 文件配置 Bean），为了保证框架的通用性，它们可能需要根据配置文件加载不同的对象或类，调用不同的方法，这个时候就必须用到反射，运行时动态加载需要加载的对象。

# 三、反射的基本运用

反射可以用于判断任意对象所属的类，获得 Class 对象，构造任意一个对象以及调用一个对象。

这里我们介绍一下基本反射功能的使用和实现(反射相关的类一般都在 java.lang.relfect 包里)。

#### 1、获取Class对象

方法有三种：

**(1) 使用 Class 类的 forName 静态方法:**

```
 public static Class<?> forName(String className)
``` 
比如在 JDBC 开发中常用此方法加载数据库驱动:
```
 Class.forName(driver);
 ```
 
 (2)直接获取某一个对象的 class，比如:
```
Class<?> klass = int.class;
Class<?> classInt = Integer.TYPE;
```

(3)调用某个对象的 getClass() 方法，比如:
```
StringBuilder str = new StringBuilder("123");
Class<?> klass = str.getClass();
```

#### 2、判断是否为某各类的实例

一般地，我们用 `instanceof` 关键字来判断是否为某个类的实例。同时我们也可以借助反射中 Class 对象的 `isInstance() `方法来判断是否为某个类的实例，它是一个 native 方法：

```
public native boolean isInstance(Object obj);
```

#### 3、创建实例

通过反射来生成对象主要有两种方式。

**1、使用Class对象的newInstance()方法来创建Class对象对应类的实例。**
```
Class<?> c = String.class;
Object str = c.newInstance();
```

**2、先通过Class对象获取指定的Constructor对象，再调用Constructor对象的newInstance()方法来创建实例。这种方法可以用指定的构造器构造类的实例。**

```
//获取String所对应的Class对象
Class<?> c = String.class;
//获取String类带一个String参数的构造器
Constructor constructor = c.getConstructor(String.class);
//根据构造器创建实例
Object obj = constructor.newInstance("23333");
System.out.println(obj);
```

#### 4、获取方法

获取某个Class对象的方法集合，主要有以下几个方法：

1、getDeclaredMethods 方法返回类或接口声明的所有方法，包括公共、保护、默认（包）访问和私有方法，但不包括继承的方法。
```
public Method[] getDeclaredMethods() throws SecurityException
```
2、getMethods 方法返回某个类的所有公用（public）方法，包括其继承类的公用方法。
```
public Method[] getMethods() throws SecurityException
```
3、etMethod 方法返回一个特定的方法，其中第一个参数为方法名称，后面的参数为方法的参数对应Class的对象。
```
public Method getMethod(String name, Class<?>... parameterTypes)
```
 下面我们使用例子来理解上面的三种方式：
 
 ```
 import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
public class test1 {
	public static void test() throws IllegalAccessException, InstantiationException, NoSuchMethodException, InvocationTargetException {
	        Class<?> c = methodClass.class;
	        Object object = c.newInstance();
	        Method[] methods = c.getMethods();
	        Method[] declaredMethods = c.getDeclaredMethods();
	        //获取methodClass类的add方法
	        Method method = c.getMethod("add", int.class, int.class);
	        //getMethods()方法获取的所有方法
	        System.out.println("getMethods获取的方法：");
	        for(Method m:methods)
	            System.out.println(m);
	        //getDeclaredMethods()方法获取的所有方法
	        System.out.println("getDeclaredMethods获取的方法：");
	        for(Method m:declaredMethods)
	            System.out.println(m);
	    }
    }
class methodClass {
    public final int fuck = 3;
    public int add(int a,int b) {
        return a+b;
    }
    public int sub(int a,int b) {
        return a+b;
    }
}
 ```
 
 程序运行结果：
 
 ```
 getMethods获取的方法：
public int com.wjw.common.methodClass.add(int,int)
public int com.wjw.common.methodClass.sub(int,int)
public final void java.lang.Object.wait() throws java.lang.InterruptedException
public final void java.lang.Object.wait(long,int) throws java.lang.InterruptedException
public final native void java.lang.Object.wait(long) throws java.lang.InterruptedException
public boolean java.lang.Object.equals(java.lang.Object)
public java.lang.String java.lang.Object.toString()
public native int java.lang.Object.hashCode()
public final native java.lang.Class java.lang.Object.getClass()
public final native void java.lang.Object.notify()
public final native void java.lang.Object.notifyAll()
getDeclaredMethods获取的方法：
public int com.wjw.common.methodClass.add(int,int)
public int com.wjw.common.methodClass.sub(int,int)
 ```
 
可以看到，通过 getMethods() 获取的方法可以获取到父类的方法,比如 java.lang.Object 下定义的各个方法。

#### 5、获取构造器信息

获取类构造器的用法与上述获取方法的用法类似。主要是通过Class类的getConstructor方法得到Constructor类的一个实例，而Constructor类有一个newInstance方法可以创建一个对象实例:

```
public T newInstance(Object ... initargs)
```
此方法可以根据传入的参数来调用对应的Constructor创建对象实例。

#### 6、获取成员变量（字段）信息

主要是这几个方法：

- getFiled：访问公有的成员变量
- getDeclaredField：所有已声明的成员变量，但不能得到其父类的成员变量

#### 7、调用方法

当我们从类中获取了一个方法后，我们就可以用 invoke() 方法来调用这个方法。invoke 方法的原型为:

```
public Object invoke(Object obj, Object... args)
        throws IllegalAccessException, IllegalArgumentException,
           InvocationTargetException
```

实例：

```
public class test1 {
    public static void main(String[] args) throws IllegalAccessException, InstantiationException, NoSuchMethodException, InvocationTargetException {
        Class<?> klass = methodClass.class;
        //创建methodClass的实例
        Object obj = klass.newInstance();
        //获取methodClass类的add方法
        Method method = klass.getMethod("add",int.class,int.class);
        //调用method对应的方法 => add(1,4)
        Object result = method.invoke(obj,1,4);
        System.out.println(result);
    }
}
class methodClass {
    public final int fuck = 3;
    public int add(int a,int b) {
        return a+b;
    }
    public int sub(int a,int b) {
        return a+b;
    }
}
```

#### 8、利用反射创建数组

数组在Java里是比较特殊的一种类型，它可以赋值给一个Object Reference。下面我们看一看利用反射创建数组的例子：

```
public static void testArray() throws ClassNotFoundException {
        Class<?> cls = Class.forName("java.lang.String");
        Object array = Array.newInstance(cls,25);
        //往数组里添加内容
        Array.set(array,0,"hello");
        Array.set(array,1,"Java");
        Array.set(array,2,"fuck");
        Array.set(array,3,"Scala");
        Array.set(array,4,"Clojure");
        //获取某一项的内容
        System.out.println(Array.get(array,3));
    }
```

其中的Array类为java.lang.reflect.Array类。我们通过Array.newInstance()创建数组对象，它的原型是:

```
public static Object newInstance(Class<?> componentType, int length)
        throws NegativeArraySizeException {
        return newArray(componentType, length);
    }
```

# 四、使用反射注意

1、由于反射会额外消耗一定的系统资源，因此如果不需要动态地创建一个对象，那么就不需要用反射。

2、反射调用方法时可以忽略权限检查，因此可能会破坏封装性而导致安全问题。
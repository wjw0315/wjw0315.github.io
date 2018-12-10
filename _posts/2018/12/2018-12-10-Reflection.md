---
layout:     post                  
title:      Java反射机制      
date:       2018-12-10             
author:     wjw                   
header-img: img/post-bg-rwd.jpg  
catalog: true                          
tags:                             
- Java基础 
---

> 在Java运行时环境中，对于任意一个类，我们能否知道这个类有哪些属性和方法？对于任意一个对象，能否调用它的任意一个方法？答案是肯定的。这种动态获取类的信息以及动态调用对象的方法的功能来自于Java的反射机制（Reflection）。

 # 1、Java反射机制提供的功能
 
主要提供了以下几个功能：

- 1）在运行时判断任意一个对象所属的类；
- 2）在运行时构造任意一个类的对象；
- 3）在运行时判断任意一个类所具有的成员变量和方法；
- 4）在运行时调用任意一个对象的方法。

> 反射让Java具有了动态的特性，这种机制允许程序在运行时透过Reflection API获取任意一个已知名称的类的内部信息，包括成员变量（fields）、方法（methods）、实现的接口（interfaces）、Java语言修饰符（modifiers）以及它的父类（superclass）等等，并可在运行时改变成员变量的内容或调用方法。

# 2、Java Reflection API

  在JDK中，提供了以下类来实现Java反射机制，这些类都位于java.lang.reflect包下：

- Class类：代表一个类（注意：Class类位于java.lang包下）；
- Field类：代表类的成员变量；
- Method类：代表类的方法；
- Constructor类：代表类的构造方法；
- Array类：提供了动态创建数组，以及访问数组的元素的静态方法。

通过API提供的这些类里的方法，我们可以动态获取想要的类的内部信息。


## 一、获取class类

  > Class类的实例表示正在运行的Java程序中的类和接口，每一个类都有对应的Class对象，不管一个类生成了多少个对象，这些对象都对应内存里的同一个Class对象，Class对象是在加载类时由Java虚拟机自动构建的。

有以下几种方式来获取一个类的Class对象：

1）Class类提供的静态方法：forName(String className)，参数className表示所需类的完全限定名。    

```
public class GetClassObject {
    
    public static void main(String[] args) throws Exception {
        
        Class<?> classType = Class.forName("java.lang.String");
        
        System.out.println(classType);//输出：class java.lang.String
    }

}
```

2）使用`.class`语法

```
public class GetClassObject {
    
    public static void main(String[] args) throws Exception {
        
        Class<?> classType = String.class;
        
        System.out.println(classType);//输出：class java.lang.String
    }

}
```

3) Object提供的方法：getClass();

```
public class GetClassObject {
    
    public static void main(String[] args) throws Exception {
        
        Map map = new HashMap();
        Class<?> classType = map.getClass();
        
        System.out.println(classType);//输出：class java.util.HashMap
    }

}
```

## 二、获取Field（成员变量）对象

类的每一个成员变量都对应一个Field对象，Class类提供了以下方法来获取类的成员变量对应的Field对象：

- 1）`Field getDeclaredField(String name)`：根据传入的变量名称返回此Class对象所表示的类或接口中声明的变量对应的Field对象。
- 2）`Field[] getDeclaredFields()`：返回一个Field类型的数组，包含此Class对象所表示的类或接口中声明的所有变量的Field对象。
- 3）`Field getField(String name)`：根据传入的变量名返回一个Field对象，注意与getDeclaredField(String name)不同的是，此方法返回的是public变量对应的Field对象。
- 4）`Field[] getFields()`：返回一个Field类型的数组，注意与Field[] getDeclaredFields()方法不同的是，此方法返回的是所有public变量对应的Field对象。

```
public class GetFieldObject {
    
    public static void main(String[] args) throws Exception {
        
        //首先，获得String类的Class对象
        Class<?> classType = Class.forName("java.lang.String");
        
        //获得String类中声明的所有成员变量的Field对象的数组
        Field[] fields = classType.getDeclaredFields();
        for(Field field : fields){
            System.out.println(field+";");
        }    
        
        System.out.println("---------------------------------------------------------------------");
        
        //获得String类中声明的public成员变量的Field对象的数组
        Field[] publicFields = classType.getFields();
        for(Field field : publicFields){
            System.out.println(field+";");
        }
        
    }

}
```

输出：

```
private final char[] java.lang.String.value;
private int java.lang.String.hash;
private static final long java.lang.String.serialVersionUID;
private static final java.io.ObjectStreamField[] java.lang.String.serialPersistentFields;
public static final java.util.Comparator java.lang.String.CASE_INSENSITIVE_ORDER;
---------------------------------------------------------------------
public static final java.util.Comparator java.lang.String.CASE_INSENSITIVE_ORDER;
```

## 三、获取类的Method对象

> 类中的每一个方法都对应一个Method对象，Class类提供了以下方法来获取类中的方法对应的Method对象：

- 1）`Method getDeclaredMethod(String name, Class<?>... parameterTypes)`：返回一个Method对象，参数name表示方法名，可变参数parameterTypes是一个Class对象的数组，代表方法的参数的Class类型；
- 2）`Method[] getDeclaredMethods()`：返回Method对象的一个数组，这些对象反映此Class对象所表示的类或接口声明的所有方法，包括公共、保护、默认访问和私有方法，但不包括继承的方法；
- 3）`Method getMethod(String name, Class<?>... parameterTypes)`：返回一个Method对象，注意和此Method对象对应的方法是公共(public)方法；
- 4）`Method[] getMethods()`：返回一个Method数组，这些对象反映此Class对象所表示的类或接口中声明的公共(public)方法（也包括父类或父接口中声明的public方法）。

```
public class GetMethodObject {
    
    public static void main(String[] args) throws Exception {
        
        //首先，获得类的Class对象
        Class<?> classType = Class.forName("java.lang.reflect.Proxy");
        
        //获得类中声明的所有方法的Method对象的数组，不包括继承的父类的方法
        Method[] methods = classType.getDeclaredMethods();
        for(Method method : methods){
            System.out.println(method+";");
        }    
        
        System.out.println("----------------------------------------------------------------------");
        
        //获得类中的public方法的Method对象的数组，也包括继承的父类的public方法
        Method[] publicMethods = classType.getMethods();
        for(Method method : publicMethods){
            System.out.println(method+";");
        }
        
    }

}
```
输出：

```
static java.lang.Object java.lang.reflect.Proxy.access$200();
static java.lang.Class java.lang.reflect.Proxy.access$300(java.lang.ClassLoader,java.lang.String,byte[],int,int);
public static boolean java.lang.reflect.Proxy.isProxyClass(java.lang.Class);
private static native java.lang.Class java.lang.reflect.Proxy.defineClass0(java.lang.ClassLoader,java.lang.String,byte[],int,int);
private static void java.lang.reflect.Proxy.checkNewProxyPermission(java.lang.Class,java.lang.Class);
private static void java.lang.reflect.Proxy.checkProxyAccess(java.lang.Class,java.lang.ClassLoader,java.lang.Class[]);
public static java.lang.reflect.InvocationHandler java.lang.reflect.Proxy.getInvocationHandler(java.lang.Object) throws java.lang.IllegalArgumentException;
public static java.lang.Class java.lang.reflect.Proxy.getProxyClass(java.lang.ClassLoader,java.lang.Class[]) throws java.lang.IllegalArgumentException;
private static java.lang.Class java.lang.reflect.Proxy.getProxyClass0(java.lang.ClassLoader,java.lang.Class[]);
public static java.lang.Object java.lang.reflect.Proxy.newProxyInstance(java.lang.ClassLoader,java.lang.Class[],java.lang.reflect.InvocationHandler) throws java.lang.IllegalArgumentException;
----------------------------------------------------------------------
public static boolean java.lang.reflect.Proxy.isProxyClass(java.lang.Class);
public static java.lang.reflect.InvocationHandler java.lang.reflect.Proxy.getInvocationHandler(java.lang.Object) throws java.lang.IllegalArgumentException;
public static java.lang.Class java.lang.reflect.Proxy.getProxyClass(java.lang.ClassLoader,java.lang.Class[]) throws java.lang.IllegalArgumentException;
public static java.lang.Object java.lang.reflect.Proxy.newProxyInstance(java.lang.ClassLoader,java.lang.Class[],java.lang.reflect.InvocationHandler) throws java.lang.IllegalArgumentException;
public final void java.lang.Object.wait() throws java.lang.InterruptedException;
public final void java.lang.Object.wait(long,int) throws java.lang.InterruptedException;
public final native void java.lang.Object.wait(long) throws java.lang.InterruptedException;
public boolean java.lang.Object.equals(java.lang.Object);
public java.lang.String java.lang.Object.toString();
public native int java.lang.Object.hashCode();
public final native java.lang.Class java.lang.Object.getClass();
public final native void java.lang.Object.notify();
public final native void java.lang.Object.notifyAll();

```

## 四、用反射机制调用对象的方法

> Java反射机制可以在运行时动态调用类中的方法，Java Reflection API提供了我们所需的方法来完成动态调用。要想调用类中的方法首先要创建一个对象，我们通过类的Class对象来创建它所代表的类的实例，通过Class对象我们还能获得类中声明的方法的Method对象，Method类提供了Invoke方法来调用此Method对象所表示的方法。

反射机制调用方法代码示例如下：   

```
public class InvokeTester {
    
    public static int add(int a, int b){
        return a + b;
    }
    
    public static String echo(String str){
        return "hello "+str;
    }
    
    
    public static void main(String[] args) throws Exception {
//        InvokeTester invoke = new InvokeTester();
//        System.out.println(invoke.add(1, 2));
//        System.out.println(invoke.echo("tom"));
        
        
        //用反射机制调用，首先获得类的Class对象
        Class<?> classType = InvokeTester.class;
        
        //通过Class对象获得一个InvokeTester类的实例
        Object invoke = classType.newInstance();
        
        //获得add(int a, int b)方法的Method对象，getMethod方法的参数为方法名和方法参数类型的Class对象的数组
        Method addMethod = classType.getMethod("add", int.class, int.class);
        
        //通过Method类的invoke方法，调用invoke对象的add方法
        Object result = addMethod.invoke(invoke, 1, 2);
        
        System.out.println(result);
        
        Method echoMethod = classType.getMethod("echo", String.class);
        
        Object result2 = echoMethod.invoke(invoke, "Tom");
        
        System.out.println(result2);
        
    }
}
```

## 五、用反射机制调用类的私有方法

> 我们知道正常情况下一个类的私有方法只允许这个类本身来调用，但使用反射机制能打破这种访问限制，让其他的类也能调用这个类的私有的方法。这种场景在实际开发中很少用到，Java也不提倡这种用法。

```
public class Private {
    
    //定义一个私有方法
    private String sayHello(String name){
        return "hello, "+name;
    }

}


public class PrivateTest {
    
    public static void main(String[] args) throws Exception {
        //调用Private类的私有方法
        Private p = new Private();
        
        Class<?> classType = p.getClass();
        
        Method method = classType.getDeclaredMethod("sayHello", String.class);
        
        method.setAccessible(true);//取消Java访问检查,如果不设置此项则会报错
        
        String str = (String)method.invoke(p, "Tracy");
        
        System.out.println(str);//输出：hello, Tracy
    }
    
}
```

## 六、用反射机制操作类的私有变量

> 与前面调用类的私有方法类似，通过反射我们还能操作类的私有变量.

```
public class Private2 {
    //定义私有变量
    private String name = "zhangsan";
    
    public String getName(){
        return name;
    }
}


public class PrivateTest2 {
    
    public static void main(String[] args) throws Exception {
        //改变Private2类的私有变量的值
        Private2 p = new Private2();
        
        Class<?> classType = p.getClass();
        
        Field field = classType.getDeclaredField("name");
        
        field.setAccessible(true);//取消默认java访问控制检查，Field类的父类AccessibleObject类提供的方法
        
        field.set(p, "lisi");//Field类的set(Object obj, Object value)方法将指定对象上此Field对象表示的字段设置为指定的新值
        
        System.out.println(p.getName());//输出：lisi
        
    }
    
}
```

> Java反射机制在很多框架的底层实现中有用到，还有一种很重要的设计模式也用到了反射，那就是代理模式中的动态代理，了解了动态代理模式的思想对我们研究框架有很大帮助.


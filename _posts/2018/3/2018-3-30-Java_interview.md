---
layout:     post
title:      Java面试基础
subtitle:   Java面试基础     
date:       2018-3-30 
author:     wjw
header-img: img/post-bg-rwd.jpg 
catalog: true
stickie: true
tags:
    - Java面试基础
--- 

## 1、jdk1.8中，下面有关java 抽象类和接口的区别，说法错误的是？


A 抽象类可以有构造方法，接口中不能有构造方法

B 抽象类中可以包含非抽象的普通方法，接口中的方法必须是抽象的，不能有非抽象的普通方法

C 一个类可以实现多个接口，但只能继承一个抽象类

D 接口中可以有普通成员变量，抽象类中没有普通成员变量

正确答案: B D

- 解析：


**抽象类**
特点:
1.抽象类中可以构造方法
2.抽象类中可以存在普通属性，方法，静态属性和方法。
3.抽象类中可以存在抽象方法。
4.如果一个类中有一个抽象方法，那么当前类一定是抽象类；抽象类中不一定有抽象方法。
5.抽象类中的抽象方法，需要有子类实现，如果子类不实现，则子类也需要定义为抽象的。
**接口**
1.在接口中只有方法的声明，没有方法体。
2.在接口中只有常量，因为定义的变量，在编译的时候都会默认加上
public static final 
3.在接口中的方法，永远都被public来修饰。
4.接口中没有构造方法，也不能实例化接口的对象。
5.接口可以实现多继承
6.接口中定义的方法都需要有实现类来实现，如果实现类不能实现接口中的所有方法则实现类定义为抽象类。
7、在jdk1.8中接口可以有default、static方法。

## 2、下列说法错误的有（ ）


A 在类方法中可用this来调用本类的类方法

B 在类方法中调用本类的类方法时可直接调用

C 在类方法中只能调用本类中的类方法

D 在类方法中绝对不能调用实例方法

`正确答案: A C D `

- 解析：

A:类方法是指类中被static修饰的方法，无this指针。
C：类方法是可以调用其他类的static方法的。
D:可以在类方法中生成实例对象再调用实例方法

## 3、结果是什么？
```
public class Test
{
    static boolean foo(char c)
    {
        System.out.print(c);
        return true;
    }
    public static void main( String[] argv )
    {
        int i = 0;
        for ( foo('A'); foo('B') && (i < 2); foo('C'))
        {
            i++ ;
            foo('D');
        }
    }
}
```
`结果为 ABDCBDCB`

- 解析：

 for(条件1;条件2;条件3) {
    //语句
}
执行顺序是条件1->条件2->语句->条件3->条件2->语句->条件3->条件2........
如果条件2为true，则一直执行。如果条件2位false，则for循环结束

## 4、去除重发字符（编程题）

```
public static void main(String[] args) {
		// TODO Auto-generated method stub
		  String str = "adsfagaeri";
		  System.out.println(" 方法一：普通方法 "); 
		  char[] cy = str.toCharArray(); 
		   String temp = ""; 
		    for (int i = 0; i < cy.length; i++) { 
				  if (temp.indexOf(cy[i]) == -1) { 
				  temp += cy[i]; 
				  } 
				} 

		System.out.println("  去除重复字符后： " + temp);
	}
```

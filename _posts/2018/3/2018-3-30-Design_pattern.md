---
layout:     post
title:      设计模式
subtitle:   设计模式     
date:       2018-3-30 
author:     wjw
header-img: img/post-bg-rwd.jpg 
catalog: true
stickie: true
tags:
    - 设计模式
--- 

## 1、结构型模式中最体现扩展性的模式是（）

A\装饰模式

B\合成模式

C\桥接模式

D\适配器

`正确答案: A  `

- 解析：

 1.适配器模式 Adapter
  适配器模式是将一个类的接口转换成客户希望的另外一个接口。适配器模式使得原本由于接口不兼容而不能一起工作的那些类可以一起工作。
  两个成熟的类需要通信，但是接口不同，由于开闭原则，我们不能去修改这两个类的接口，所以就需要一个适配器来完成衔接过程。
  
2.桥接模式 Bridge
  桥接模式将抽象部分与它的实现部分分离，是它们都可以独立地变化。它很好的支持了开闭原则和组合锯和复用原则。实现系统可能有多角度分类，每一种分类都有可能变化，那么就把这些多角度分离出来让他们独立变化，减少他们之间的耦合。
  
3.组合模式 Composite
  组合模式将对象组合成树形结构以表示部分-整体的层次结构，组合模式使得用户对单个对象和组合对象的使用具有一致性。
  
4.装饰模式 Decorator
装饰模式动态地给一个对象添加一些额外的职责，就增加功能来说，它比生成子类更灵活。也可以这样说，装饰模式把复杂类中的核心职责和装饰功能区分开了，这样既简化了复杂类，有去除了相关类中重复的装饰逻辑。 装饰模式没有通过继承原有类来扩展功能，但却达到了一样的目的，而且比继承更加灵活，所以可以说装饰模式是继承关系的一种替代方案。

5.外观模式 Facade
 外观模式为子系统中的一组接口提供了同意的界面，外观模式定义了一个高层接口，这个接口使得这一子系统更加容易使用。
外观模式中，客户对各个具体的子系统是不了解的，所以对这些子系统进行了封装，对外只提供了用户所明白的单一而简单的接口，用户直接使用这个接口就可以完成操作，而不用去理睬具体的过程，而且子系统的变化不会影响到用户，这样就做到了信息隐蔽。

6.享元模式 Flyweight
 享元模式为运用共享技术有效的支持大量细粒度的对象。因为它可以通过共享大幅度地减少单个实例的数目，避免了大量非常相似类的开销。.
  享元模式是一个类别的多个对象共享这个类别的一个对象，而不是各自再实例化各自的对象。这样就达到了节省内存的目的。
  
7.代理模式 Proxy   
为其他对象提供一种代理，并由代理对象控制对原对象的引用，以间接控制对原对象的访问。

## 2\单例模式

```
//饿汉式
public class SingletorTest {
	private SingletorTest(){}
	private static final SingletorTest singletor=new SingletorTest();
	public static SingletorTest getInstance(){
		return singletor;
		
	}
}
```
```
//双重锁
class Singletor {
	private static volatile Singletor singletor=null;
	private Singletor(){}
	public static Singletor getInstance(){
		if(singletor==null){
			synchronized(Singletor.class){
				if(singletor==null){
					singletor= new Singletor();
				}
			}
		}
		return singletor;	
	}
}
```
```
//懒汉式
class Singletor1{
	private Singletor1(){}
	private static Singletor1 singletor=null;
	public static Singletor1 getInstance(){
		if(singletor==null){
			singletor=new Singletor1();
		}
		return singletor;
		
	}
}
```

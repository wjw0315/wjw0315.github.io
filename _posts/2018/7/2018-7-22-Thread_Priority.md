---
layout:     post                  
title:      线程优先级      
subtitle:   线程优先级问题          
date:       2018-7-22             
author:     Mr.W                   
header-img: img/post-bg-rwd.jpg  
keywords_post:  "并发 多线程"
catalog: true                          
tags:                             
- Java并发
- 多线程
---
  
>每个线程都有一个"优先级"，优先级可以用整数表示，取值范围为0~10，0为最低优先级，10位最高优先级，当决定哪个线程需要调度时，首先查看是否存在优先级高的可调度线程，如果存在，就从中选择进行调度。当决定哪个线程需要调度时，首先查看是否存在优先级高的可调度线程，如果存在，就从中选择进行调度。当该线程的时间片到达之后，系统查看是否存在另一个优先级比较高的可调度线程，如果存在就调度。这样依次进行判断调度线程。

>下面两中方式实现线程优先级排列--1、静态常量表示；2、用数字表示

# 线程优先级实现：

(1)Thread类有三个优先级静态常量：MAX_PRIORITY为10，为线程最高优先级；MIN_PRIORITY取值为1，为线程最低优先级；NORM_PRIORITY取值为5，为线程中间位置的优先级。默认情况下，线程的优先级为NORM_PRIORITY。

(2)Java中的线程在同等情况下，对于两个同时启动的线程，优先级高的线程先获取CPU资源，先被真正运行，优先级低的线程后获取CPU资源，后被执行。特殊情况在于现在计算机都是多核多线程的配置，有可能优先级低的线程比优先级高的线程先运行，优先级高的线程可能比优先级低的线程后运行，线程的执行先后还是由Java虚拟机调度决定的。

```
class firstFamilyThread implements Runnable {
	Thread thread;// 声明一个线程
	public firstFamilyThread() {
	}
 
	public firstFamilyThread(String name) {// 构造方法初始化一个线程
		thread = new Thread(this, name); // 参数1 是要调用的线程thread， 参数2
											// 是要调用的线程thread的名字
	}
 
	@Override
	public void run() {
		System.out.println("第一组：" + thread.getName());// 获得线程的名称
	}
 
	public void startThreadByLevel() {// 该方法创建5个线程，并各赋予不同的优先级
		// 实例化5个类对象，在调用的一参构造器中创建线程
		firstFamilyThread f1 = new firstFamilyThread("5");
		firstFamilyThread f2 = new firstFamilyThread("4");
		firstFamilyThread f3 = new firstFamilyThread("3");
		firstFamilyThread f4 = new firstFamilyThread("2");
		firstFamilyThread f5 = new firstFamilyThread("1");
		// 设置线程优先级-调用全局变量thread，然后设置优先级
		f1.thread.setPriority(Thread.MAX_PRIORITY);//MAX_PRIORITY 10
		f2.thread.setPriority(Thread.MAX_PRIORITY-1);//9
		f3.thread.setPriority(Thread.NORM_PRIORITY);//NORM_PRIORITY 5
		f4.thread.setPriority(Thread.NORM_PRIORITY-1);//4
		f5.thread.setPriority(Thread.MIN_PRIORITY);//MIN_PRIORITY 1
		f1.thread.start();
		f2.thread.start();
		f3.thread.start();
		f4.thread.start();
		f5.thread.start();
		try {
			f5.thread.join();
		} catch (InterruptedException e) {
			System.out.println("等待线程结束出错： "+e.getMessage());
		}
	}
 
}
class secondFamilyThread implements Runnable {
	Thread thread;// 声明一个线程
	public secondFamilyThread() {
	}
 
	public secondFamilyThread(String name) {// 构造方法初始化一个线程
		thread = new Thread(this, name); // 参数1 是要调用的线程thread， 参数2
											// 是要调用的线程thread的名字
	}
 
	@Override
	public void run() {
		System.out.println("第二组员：" + thread.getName());// 获得线程的名称
	}
 
	public void startThreadByLevel() {// 该方法创建5个线程，并各赋予不同的优先级
		// 实例化5个类对象，在调用的一参构造器中创建线程
		secondFamilyThread s1 = new secondFamilyThread("5");
		secondFamilyThread s2 = new secondFamilyThread("4");
		secondFamilyThread s3 = new secondFamilyThread("3");
		secondFamilyThread s4 = new secondFamilyThread("2");
		secondFamilyThread s5 = new secondFamilyThread("1");
		// 设置线程优先级-调用全局变量thread，然后设置优先级
		s1.thread.setPriority(10);//MAX_PRIORITY 10
		s2.thread.setPriority(9);//9
		s3.thread.setPriority(5);//NORM_PRIORITY 5
		s4.thread.setPriority(4);//4
		s5.thread.setPriority(1);//MIN_PRIORITY 1
		s1.thread.start();
		s2.thread.start();
		s3.thread.start();
		s4.thread.start();
		s5.thread.start();
		try {
			s5.thread.join();
		} catch (InterruptedException e) {
			System.out.println("等待线程结束出错： "+e.getMessage());
		}
	}
 
}
public class TextPriorityLevel extends Thread {// 操作运用优先级实现
	public static void main(String[] args) {
		System.out.println("实现Runnable接口，根据静态等级常量实现线程优先级");
		new firstFamilyThread().startThreadByLevel();
		System.out.println("实现Runnable接口，根据数字从高到低实现线程优先级");
		new secondFamilyThread().startThreadByLevel();
	}
}
```

结果可能会出现一些偏差，但是大致都是遵循了线程的优先级
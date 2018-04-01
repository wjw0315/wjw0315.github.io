---
layout:     post
title:      java多线程面试题型
subtitle:   java_Thread_ing
date:       2018-2-3
author:     wjw
header-img: img/post-bg-ios9-web.jpg
catalog: true
tags:
    - java进阶
    - 面试集
---



>在典型的Java面试中， 面试官会从线程的基本概念问起, 如：为什么你需要使用线程， 如何创建线程，用什么方式创建线程比较好（比如：继承thread类还是调用Runnable接口），然后逐渐问到并发问题像在Java并发编程的过程中遇到了什么挑战，Java内存模型，JDK1.5引入了哪些更高阶的并发工具，并发编程常用的设计模式，经典多线程问题如生产者消费者，哲学家就餐，读写器或者简单的有界缓冲区问题。仅仅知道线程的基本概念是远远不够的， 你必须知道如何处理死锁，竞态条件，内存冲突和线程安全等并发问题。掌握了这些技巧，你就可以轻松应对多线程和并发面试了。

- 1) 什么是线程？

线程是操作系统能够进行运算调度的最小单位，它被包含在进程之中，是进程中的实际运作单位。

- 2) 线程和进程有什么区别？

线程是进程的子集，一个进程可以有很多线程，每条线程并行执行不同的任务。不同的进程使用不同的内存空间，而所有的线程共享一片相同的内存空间。别把它和栈内存搞混，每个线程都拥有单独的栈内存用来存储本地数据。（通俗的讲：进程是执行中的应用程序，有自己的内存空间；线程是进程执行的基本单元，也可以称为执行路径。）

- 3) 如何在Java中实现线程？

在语言层面有两种方式。java.lang.Thread 类的实例就是一个线程但是它需要调用java.lang.Runnable接口来执行，由于线程类本身就是调用的Runnable接口所以你可以继承java.lang.Thread 类或者直接调用Runnable接口来重写run()方法实现线程。
1） 继承Thread类
2） 实现Runnable，Callable接口
3） 创建线程池


- 4) 用Runnable还是Thread？

java不能实现多继承，但可以调用多个接口

- 6) Thread 类中的start() 和 run() 方法有什么区别？

这个问题经常被问到， start()方法被用来启动新创建的线程，而且start()内部调用了run()方法，这和直接调用run()方法的效果不一样。当你调用run()方法的时候，只会是在原来的线程中调用，没有新的线程启动，start()方法才会启动新线程。

- 7) Java中Runnable和Callable有什么不同？

Runnable和Callable都代表那些要在不同的线程中执行的任务。Runnable从JDK1.0开始就有了，Callable是在JDK1.5增加的。它们的主要区别是Callable的 call() 方法可以`返回值`和`抛出异常`，而Runnable的run()方法没有这些功能。Callable可以返回装载有计算结果的Future对象。

- 8) Java中CyclicBarrier 和 CountDownLatch有什么不同？

CyclicBarrier 和 CountDownLatch 都可以用来让一组线程等待其它线程。与 CyclicBarrier 不同的是，CountdownLatch 不能重新使用。

- 9) Java内存模型是什么？
Java线程之间的通信采用的是共享内存模型，这里提到的共享内存模型指的就是Java内存模型(简称JMM)，java内存模型的理解请看这篇文章[理解JMM](http://wjwcloud.cn/article/39)

- 10) Java中的volatile 变量是什么？

volatile是一个特殊的修饰符，只有成员变量才能使用它。在Java并发程序缺少同步类的情况下，多线程对成员变量的操作对其它线程是透明的。volatile变量可以保证下一个读取操作会在前一个写操作之后发生，就是上一题的volatile变量规则。

- 11) 什么是线程安全？Vector是一个线程安全类吗？ 

如果你的代码所在的进程中有多个线程在同时运行，而这些线程可能会同时运行这段代码。如果每次运行结果和单线程运行的结果是一样的，而且其他的变量的值也和预期的是一样的，就是线程安全的。我们可以将集合类分成两组，线程安全和非线程安全的。Vector 是用同步方法来实现线程安全的, 而和它相似的ArrayList不是线程安全的。

- 12) Java中什么是竞态条件？ 举个例子说明。

竞态条件会导致程序在并发情况下出现一些bugs。多线程对一些资源的竞争的时候就会产生竞态条件，如果首先要执行的程序竞争失败排到后面执行了，那么整个程序就会出现一些不确定的bugs。这种bugs很难发现而且会重复出现，因为线程间的随机竞争。一个例子就是无序处理。
---
layout:     post
title:      Java多线程
subtitle:   Java多线程     
date:       2018-3-30 
author:     wjw
header-img: img/post-bg-rwd.jpg 
catalog: true
stickie: true
tags:
    - java进阶
--- 

**进程**：正在执行中的程序，其实是应用程序在内存中运行的那片空间。

**线程**：进程中的一个执行单元，负责进程中程序的执行。一个进程中至少有一个线程，也可以有多个线程，此时称为多线程程序。


CPU处理程序是通过快速切换完成的，与我们来说是随机的；多线程的使用可以合理的使用CPU资源，如果线程过多会导致降低性能。

## Thread 的相关方法

    Thread.currentThread().getName(): 获得当前线程的名称(主线程:main；自定义线程:Thread-N)。
    isAlive:判断线程是否未终止
    getPriority:获得线程的优先级数值
    setPriority:设置线程的优先级数值
    setName:设置线程的名字

## 创建线程的两种方式

### 一、继承Thread类

    继承Thread类
    重写Thread的run方法。
    创建子类对象，即线程对象
    调用start方法，开启线程并让线程执行，同时告诉jvm去调用run方法。
```
class Demo extends Thread{
    private String name;

    public Demo(String name) {
        super();
        this.name = name;
    }

    public void run() {
        for (int i = 1; i <= 10; i++) {
            System.out.println("====="+ Thread.currentThread().getName() +"=====" + this.name + i);
        }
    }
}

public class ThreadDemo {
    public static void main(String[] args) {
        // 创建了两个线程对象
        Demo d1 = new Demo("张三");
        Demo d2 = new Demo("李四");
        d2.start();//将d2线程开启
        d1.run();// 由主线程负责
    }
}
```

**问题**

    线程对象调用run方法和调用start方法的区别？
    调用run方法不开启线程,仅是对象调用方法.
    调用start开启线程,并让jvm调用run方法在开启的线程中执行.

**多线程内存**

    多线程执行时,在栈内存中,每一个线程都有一片属于自己的栈内存空间,进行方法的压栈和弹栈.
    当执行线程的任务结束了,线程自动在栈内存中释放.
    当所有的执行线程都结束了,进程才结束

### 二、实现 Runnable 接口

    定义类实现Runnable接口: 避免继承Thread类的单继承局限性
    覆盖接口中的run方法。将线程任务代码定义到run方法中
    创建Thread类的对象，并将Runnable接口的子类对象作为参数传递给Thread类的构造函数。因为线程被封装到Runnable接口的run方法中，而这个run方法所属于Runnable接口的子类对象，所以将这个子类对象作为参数传递给THread的构造函数。这样，线程对象创建时就可以明确要运行的线程任务。
    调用Thread类的start方法开启线程
```
class Demo implements Runnable{
    private String name;

    public Demo(String name) {
        super();
        this.name = name;
    }
   // 覆盖了接口Runnable中的run方法 
    public void run() {
        for (int i = 1; i <= 10; i++) {
            System.out.println("====="+ Thread.currentThread().getName() +"=====" + this.name + i);
        }
    }
}

public class ThreadDemo {
    public static void main(String[] args) {
       // 创建Runnable子类的对象，注意它并不是线程对象
        Demo d1 = new Demo("张三");
        Demo d2 = new Demo("李四");
        Thread t1 = new Thread(d1); 
        Thread t2 = new Thread(d2); 
        t1.start();
        t2.start();
        System.out.println(Thread.currentThread().getName());
    }
}
```

**优势**

    实现Runnable接口避免了单继承的局限性，所以较为常用。
    实现Runnable接口的方式，更加符合面向对象。线程分为两部分，一部分线程对象，一部分线程任务。
        继承Thread类，线程对象和任务耦合在一起，一旦创建Thread子类对象，即使线程对象，又是线程任务。
        实现Runnable接口，将线程任务单独分离出来封装成对象，类型就是Runnable接口，实现了解耦。

## 线程状态
![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/2/3/java_Thread/1.png)
### 多线程的安全问题

由于线程的随机性，会出现多线程的安全问题。

**原因**

    线程任务操作共享的数据
    线程任务操作数据的运算有多个

**解决**

1、synchronized 同步代码块

```
synchronized(对象){
    // 需要被同步的代码
}
```

**原理**

线程1读到synchronized，会找后面括号中的对象(可任意，一般写this)并拿到该对象，之后往下执行。当线程2读到synchronized的时候，也会找后面括号中的对象，发现被线程1拿走了，所以线程2进不来了。直到线程1执行完synchronized代码块并释放对象之后，线程2才能继续执行。(对象相当于锁)-->火车上的卫生间

**注意:**必须保证多个线程在同步中使用的同一个锁，即synchronized后面括号中为同一个对象

**同步弊端：**降低了程序性能。

### 2、 同步函数

同步函数使用的锁是固定的this。当线程任务只需要一个同步时完全可以使用同步函数。
同步代码块使用的锁是任意对象。当线程中需要多个同步时 ，必须通过锁来区分(较为常用)
```
public synchronized void method(){
    // 需要被同步的代码
}
```
**注意:**static同步函数public static synchronized void method(){}，使用的锁不是this，而是字节码文件对象(类名.class)。因为万物皆对象，字节码文件也被视为对象存在。因此相应的synchronized代码块后的对象也要用类名.class:synchronized(类名.class){}.

**分析**

    既然是多线程的问题，必然发生在线程任务内
    分析线程任务内是否有共享数据
    是否有对数据进行多次运算

### 懒汉式线程安全问题

 饿汉式:线程安全，调用率高，但是不能延时加载，类初始化时，立即加载这个对象

```
public class Demo01 {
    private static Demo01 instance = new Demo01();
    private Demo01() { }
    public static Demo01 getInstance() {
        return instance;
    }
}
```

懒汉式:可以延时加载，存在线程问题，可以加锁，并且为了兼顾效率，再加一次判断，减少判断锁的次数


```
public class Single {
    private static Single instance;
    private Single() { }
    public static  Single getInstance() {
        if(instance == null){
            synchronized(Single.class){
                if (instance == null) {
                instance = new Single();
             }
            }
        }
        return instance;
    }
}
```

## 死锁

当线程任务中出现了多个同步(多个锁)时，如果同步中嵌套了其他同步，容易引发死锁。如下:
```
//Thread_0
synchronized(obj1){
    //Thread-0 obj1-->
    synchronized(obj2){
    }
}

//Thread_1
synchronized(obj2){
    //Thread-1 obj2-->
    synchronized(obj1){
    }
}
```

**一个死锁程序**
```
public class DeadLock {
    public static void main(String[] args) {
        Test t1 = new Test(true);
        Test t2 = new Test(false);
        Thread t11 = new Thread(t1);
        Thread t22 = new Thread(t2);
        t11.start();
        t22.start();
    }
}

class Test implements Runnable {
    private boolean flag = false;

    Test(boolean flag) {
        this.flag = flag;
    }

    public void run() {
        if (flag) {
            while (true) {
                synchronized (MyLock.LOCKA) {
                    System.out.println(Thread.currentThread().getName() + "...if...lock a");
                    synchronized (MyLock.LOCKB) {
                        System.out.println(Thread.currentThread().getName() + "...if...lock b");
                    }
                }
            }

        } else {
            while (true) {
                synchronized (MyLock.LOCKB) {
                    System.out.println(Thread.currentThread().getName() + "...if...lock b");
                    synchronized (MyLock.LOCKA) {
                        System.out.println(Thread.currentThread().getName() + "...if...lock a");
                    }
                }
            }

        }
    }
}

class MyLock {
    public static final Object LOCKA = new Object();
    public static final Object LOCKB = new Object();
}
```

## 多线程通讯

### 生产者消费者问题

这是多线程中最为常见的案例(重要)
生产者和消费者同时执行，需要多线程；但是任务却不相同，处理的资源是相同的:线程间的通信

**生产消费实例:**
```
public class ProduceConsumer {
    public static void main(String[] args) {
        Resource r = new Resource();
        Produce produce = new Produce(r);
        Consumer consumer = new Consumer(r);
        Thread t1 = new Thread(produce);
        Thread t11 = new Thread(produce);
        Thread t2 = new Thread(consumer);
        Thread t22 = new Thread(consumer);
        // 开启多个生产多个消费
        t1.start();
        t11.start();
        t2.start();
        t22.start();
    }
}

// 资源
class Resource {
    private String name;
    private int num = 1;
    private boolean flag = false;

    // 生产
    public synchronized void set(String name) {
        while (flag) {
            try {
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        this.name = name + num;
        num++;
        System.out.println(Thread.currentThread().getName() + "---生产者---" + this.name);
        flag = true;
        notifyAll();
    }

    // 消费
    public synchronized void get() {
        while (!flag) {
            try {
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        System.out.println(Thread.currentThread().getName() + "---消费者---" + this.name);
        flag = false;
        notifyAll();
    }
}

// 生产者
class Produce implements Runnable {
    private Resource r;

    public Produce(Resource r) {
        this.r = r;
    }

    public void run() {
        for (int i = 50; i < 200; i++) {
            r.set("面包"); // 开始生产
        }
    }
}

// 消费者
class Consumer implements Runnable {
    private Resource r;

    public Consumer(Resource r) {
        this.r = r;
    }

    public void run() {
        for (int i = 0; i < 200; i++) {
            r.get(); // 开始消费
        }
    }
}
```

**注意:**

    当多个生产消费的时候，为防止被唤醒的线程没有判断标记，要用while判断标记，而不是if。
    用while时会出现死锁，因为本方唤醒了本方,希望唤醒对方，所以使用notifyAll方法。

### 等待唤醒机制

    wait(): 会让线程处于等待状态，将线程临时存进了线程池中
    notify(): 会唤醒线程池中的任意一个等待线程。
    notifyAll(): 会唤醒线程池中所有的等待线程。

**注意:**

    这些方法必须使用在同步中，因为必须要标识wait、notify等方法所使用的锁。同一个锁上的notify，只能唤醒该锁上的wait方法。
    这些方法必须标识所属的锁，而锁可以是任意对象，任意对象可以调用的方法必须是Object的方法，所以这些方法定义在Object类中

## Lock

在 JDK 1.5 之后，Lock 实现提供了比使用 synchronized 方法和语句可获得的更广泛的锁定操作。
```
Lock l = ...; 
     l.lock();
     try {
         // access the resource protected by this lock
     } finally {
         l.unlock(); // 因为必须要释放锁，所以放到finally中
     }
```
因为必须要释放锁，所以lock.lock()放到finally 块中。

之前用synchronized同步，锁可以是任意对象，并且锁对象和锁的方法是在一块的(Object 对象中的object()、notify()、notifyAll()方法)，而在Lock中把所有的监视器方法封装到Condition 对象中，实现了锁对象和监视器方法(锁方法)的分离，更加的面向对象。
```
Lock lock = new ReentrantLock(); // 获得锁对象
Condition con = lock.newCondition(); // 获得lock上的监视器方法对象
lock.lock();    // 得到锁
con.await();    //  让线程处于等待状态
con.signal();   // 唤醒任意一个等待的线程
con.singnalAll(); // 唤醒所有等待的线程
lock.unlock();  // 释放锁
```

**一个实例**
```
class BoundedBuffer {
   final Lock lock = new ReentrantLock();
   final Condition notFull  = lock.newCondition(); 
   final Condition notEmpty = lock.newCondition(); 

   final Object[] items = new Object[100];
   int putptr, takeptr, count;

   public void put(Object x) throws InterruptedException {
     lock.lock();
     try {
       while (count == items.length) 
         notFull.await();
       items[putptr] = x; 
       if (++putptr == items.length) putptr = 0;
       ++count;
       notEmpty.signal();
     } finally {
       lock.unlock();
     }
   }

   public Object take() throws InterruptedException {
     lock.lock();
     try {
       while (count == 0) 
         notEmpty.await();
       Object x = items[takeptr]; 
       if (++takeptr == items.length) takeptr = 0;
       --count;
       notFull.signal();
       return x;
     } finally {
       lock.unlock();
     }
   } 
 }
```

## 多线程的细节问题

### 1. sleep 和 wait 方法的异同点

    - 相同点
        都可以让线程处于冻结状态
    - 不同点
        sleep 必须指定时间；wait 可以指定时间，也可以不指定时间
        sleep 时间到，线程处于临时阻塞或者运行；wait 如果没指定时间，必须通过notify 或者 notifyAll唤醒。
        sleep 不一定非要定义在同步中；wait 必须定义在同步中。
        都定义在同步中
            线程执行到 sleep，不会释放所
            线程执行到 wait，会释放锁

### 2. 线程如何停止

所谓线程结束，就是让线程任务代码完成，run方法结束。

    stop 方法(过时):具有固定的不安全性，用Thread.stop来终止线程，将释放它已经锁定的所有监视器。
    定义循环，控制住循环就行了
    如果目标线程等待很长时间(处于冻结状态)，应用interrupt方法中断该线程(将线程的冻结状态清除，让线程重新获得cpu的执行资格)，并且收到一个InterruptException，在catch块中捕获，在异常处理中改变标记，让循环结束。

### Interrupt 实例
```
package thread;

class Task implements Runnable {
    boolean flag = true;
    public synchronized void run() {
        while (flag) {
            try {
                wait();
            } catch (InterruptedException e) {
                System.out.println(Thread.currentThread().getName() + "-->" + e.toString());
                changeFlag();
            }
            System.out.println(Thread.currentThread().getName());
        }
    }
    public void changeFlag() {
        flag = false;
    }
}
public class InterruptDemo {
    public static void main(String[] args) {
        Task d = new Task();
        Thread t1 = new Thread(d,"线程1");
        Thread t2 = new Thread(d,"线程2");
        t1.start();
        t2.start();
        int x = 0;
        while (true) {
            if (++x == 50) {
                // d.changeFlag();
                t1.interrupt();
                t2.interrupt();
                break;
            }
            System.out.println(Thread.currentThread().getName());
        }
        System.out.println("over...");
    }
}
```
## 3. 守护线程

守护线程，可以理解为后台线程，一般创建的为前台线程，前后台运行线程的时候都是一样的，获取cpu的执行权限。但是结束的时候有些不同，前台线程和后台线程只要run方法结束，线程结束，但是在所有前台线程结束的时候，后台线程无论处于什么状态都会结束，从而进程结束。进程结束依赖的都是前台线程。

方法: setDaemon(boolean on)

    该方法必须在线程启动前调用:t.setDaemon(true); t.start; // t 线程设置为了守护线程
    on如果为true，该线程标记为守护线程

## 4. 线程的优先级

Thread.currentThread.toString: 返回该线程的字符串表示形式，包括『线程名称』、『优先级』、『线程组』

优先级:

    用数字标识的0-10；其中默认的初始化优先级是5；
    最明显的三个优先级 : 1，5，10。
    Thread.MAX_PRIORITY 线程可以具有的最高优先级。
    Thread.MIN_PRIORITY 线程可以具有的最低优先级。
    Thread.NORM_PRIORITY 分配给线程的默认优先级。
    得到线程的优先级:getPriority()
    更改线程的优先级:setPriority()

## 5. 线程组

ThreadGroup: 可以通过Thread构造函数明确新线程对象所属的线程组

线程组的好处: 可以对多个同组线程，进行统一的操作。默认都属于main线程。

## 6. join() 和 yield() 方法

**join() 方法**

用于临时加入一个运算的线程。让该线程执行完，程序才会执行。
```
Demo d  = new Demo();
Thread t1 = new Thread(d);
Thread t2 = new Thread(d);
t1.start();
try{
    // 主线程执行到这里，知道t1要加入执行，主线程释放了执行权(仅仅是释放，至于执行权给谁，有cpu随机决定)
    // 主线程的执行资格处于冻结状态，直至t1线程执行完恢复
    t1.join;
    }catch(InterruptException e){}
t2.start();
```

**yield() 方法**

暂停当前正在执行的线程对象，并执行其他线程。
```
class Demo implements Runnable{
    public void run(){
        for(int i = 0; i < 30; i++){
            // 线程临时停止，将执行权释放，让其他线程有机会获得执行权
            Thread.yield();
        }
    }
}
```

线程中匿名内部类使用
```
Runnable r = new Runnable(){
    public void run (){
        code....
    }    
};
new Thread(r).start();

new Thread(){
    public void run (){
        code....
}      
}.start();
```

哪一个执行？
```
new Thread(new Runnable(){
        public void run(){
            System.out.println("runnable run");
        }
    }){
        public void run(){
            System.out.println("subthread run"); // 执行
        }
    }.start();
```

### 线程池

自JDK5之后，Java推出了一个并发包：java.util.concurrent，在Java开发中，我们接触到了好多池的技术，String类的对象池、Integer的共享池、连接数据库的连接池、Struts1.3的对象池等等，池的最终目的都是节约资源，以更小的开销做更多的事情，从而提高性能。

我们的web项目都是部署在服务器上，浏览器端的每一个request就是一个线程，那么服务器需要并发的处理多个请求，就需要线程池技术，下面来看一下Java并发包下如何创建线程池。

    创建一个可重用固定线程集合的线程池，以共享的无界队列方式来运行这些线程。
```
ExecutorService threadPool = Executors.newFixedThreadPool(3);// 创建可以容纳3个线程的线程池

    创建一个可根据需要创建新线程的线程池，但是在以前构造的线程可用时将重用它们。

ExecutorService threadPool = Executors.newCachedThreadPool();// 线程池的大小会根据执行的任务数动态分配

    创建一个使用单个 worker 线程的 Executor，以无界队列方式来运行该线程。

ExecutorService threadPool = Executors.newSingleThreadExecutor();
// 创建单个线程的线程池，如果当前线程在执行任务时突然中断，则会创建一个新的线程替代它继续执行任务

    创建一个可安排在给定延迟后运行命令或者定期地执行的线程池。

ScheduledExecutorService threadPool = Executors.newScheduledThreadPool(3); // 效果类似于Timer定时器

每种线程池都有不同的使用场景，下面看一下这四种线程池使用起来有什么不同。
```
### FixedThreadPool
```
import java.util.concurrent.ExecutorService;  
import java.util.concurrent.Executors;  
publicclass ThreadPoolTest {  
public static void main(String[] args) {  
    ExecutorService threadPool = Executors.newFixedThreadPool(3);  
    for(int i = 1; i < 5; i++) {  
        final int taskID = i;  
        threadPool.execute(new Runnable() {  
            public void run() {  
                for(int i = 1; i < 5; i++) {  
                    try {  
                        Thread.sleep(20);// 为了测试出效果，让每次任务执行都需要一定时间
                    } catch (InterruptedException e) {  
                        e.printStackTrace();  
                    }  
                        System.out.println("第" + taskID + "次任务的第" + i + "次执行");  
                    }  
                }  
            });  
        }  
        threadPool.shutdown();// 任务执行完毕，关闭线程池
    }  
}
```
输出结果：
```
第1次任务的第1次执行  
第2次任务的第1次执行  
第3次任务的第1次执行  
第2次任务的第2次执行  
第3次任务的第2次执行  
第1次任务的第2次执行  
第3次任务的第3次执行  
第1次任务的第3次执行  
第2次任务的第3次执行  
第3次任务的第4次执行  
第2次任务的第4次执行  
第1次任务的第4次执行  
第4次任务的第1次执行  
第4次任务的第2次执行  
第4次任务的第3次执行  
第4次任务的第4次执行  
```
上段代码中，创建了一个固定大小的线程池，容量为3，然后循环执行了4个任务，由输出结果可以看到，前3个任务首先执行完，然后空闲下来的线程去执行第4个任务，在FixedThreadPool中，有一个固定大小的池，如果当前需要执行的任务超过了池大小，那么多余的任务等待状态，直到有空闲下来的线程执行任务，而当执行的任务小于池大小，空闲的线程也不会去销毁。

### CachedThreadPool

上段代码其它地方不变，将newFixedThreadPool(3)方法换成newCachedThreadPool()方法。

输出结果：
```
第3次任务的第1次执行  
第4次任务的第1次执行  
第1次任务的第1次执行  
第2次任务的第1次执行  
第4次任务的第2次执行  
第3次任务的第2次执行  
第2次任务的第2次执行  
第1次任务的第2次执行  
第2次任务的第3次执行  
第3次任务的第3次执行  
第1次任务的第3次执行  
第4次任务的第3次执行  
第2次任务的第4次执行  
第4次任务的第4次执行  
第3次任务的第4次执行  
第1次任务的第4次执行  
```
可见，4个任务是交替执行的，CachedThreadPool会创建一个缓存区，将初始化的线程缓存起来，如果线程有可用的，就使用之前创建好的线程，如果没有可用的，就新创建线程，终止并且从缓存中移除已有60秒未被使用的线程。

### SingleThreadExecutor

上段代码其它地方不变，将newFixedThreadPool方法换成newSingleThreadExecutor方法。

输出结果：
```
第1次任务的第1次执行  
第1次任务的第2次执行  
第1次任务的第3次执行  
第1次任务的第4次执行  
第2次任务的第1次执行  
第2次任务的第2次执行  
第2次任务的第3次执行  
第2次任务的第4次执行  
第3次任务的第1次执行  
第3次任务的第2次执行  
第3次任务的第3次执行  
第3次任务的第4次执行  
第4次任务的第1次执行  
第4次任务的第2次执行  
第4次任务的第3次执行  
第4次任务的第4次执行  
```
4个任务是顺序执行的，SingleThreadExecutor得到的是一个单个的线程，这个线程会保证你的任务执行完成，如果当前线程意外终止，会创建一个新线程继续执行任务，这和我们直接创建线程不同，也和newFixedThreadPool(1)不同。

### 4.ScheduledThreadPool
```
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class ThreadPoolTest {
    public static void main(String[] args) {
        ScheduledExecutorService schedulePool = Executors.newScheduledThreadPool(1);
        // 5秒后执行任务
        schedulePool.schedule(new Runnable() {
            public void run() {
                System.out.println("爆炸");
            }
        }, 5, TimeUnit.SECONDS);
        // 5秒后执行任务，以后每2秒执行一次
        schedulePool.scheduleAtFixedRate(new Runnable() {
            @Override
            public void run() {
                System.out.println("爆炸");
            }
        }, 5, 2, TimeUnit.SECONDS);
    }
}
```
`ScheduledThreadPool`可以定时的或延时的执行任务。

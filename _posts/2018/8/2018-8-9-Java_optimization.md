---
layout:     post                  
title:      Java优化编程的37条法则（转）   
date:       2018-8-9             
author:     Mr.W                   
header-img: img/post-bg-rwd.jpg  
category: Java   
catalog: true  
tags:                             
-  Java优化篇
---

1.JVM管理两种类型的内存:堆内存(heap),栈内存(stack),堆内在主要用来存储程序在运行时创建或实例化的对象与变量.而栈内存则是用来存储程序代码中声明为静态(static)(或非静态)的方法.

2 .JVM中对象的生命周期,创建阶段,应用阶段,不可视阶段,不可到达阶段,可收集阶段,终结阶段,释放阶段

3.避免在循环体中创建对象,即使该对象占用内存空间不大.

```
for(int i=0;i<10000;++i){   
　　Object obj = new Object();   
　　System.out.println("obj="+obj);   
　　}  
```

改成

```
Object obj = null;   
　for(int i=0;i<10000;++i){   
　obj = new Object();   
　System.out.println("obj="+obj);   
　}  
```

4.软引用的主要特点是具有较强的引用功能.只有当内存不够的时候,才回收这类内存,因此在内存足够的时候,它们通常不被回收.它可以用于实现一些常用资源的缓存,实现Cache的功能

```
 A a = new A();   
SoftReference sr = new SoftReference(a);   
a = null;   
if(sr !=null){   
a = sr.get();   
}else{   
a = new A();   
sr = new SoftReference(a);   
}  
```

5.弱引用对象与Soft引用对象最大不同就在于:GC在进行回收时,需要通过算法检查是否回收Soft引用对象,而对于Weak引用对象,GC总是进行回收.

```
A a = new A();   
　WeakReference wr = new WeakReference(a);   
　a = null;   
　if(sr !=null){   
　a = wr.get();   
　}else{   
　a = new A();   
　wr = new WeakReference(a);   
　}  
```

6.共享静态变量存储空间

7.有时候我们为了提高系统性能,避免重复耗时的操作,希望能够重用一些创建完成的对象,利用对象池实现.类似JDBC连接池.

8.瞬间值,序列化对象大变量时,如果此大变量又没有用途,则使用transient声明,不序列化此变量.同时网络传输中也不传输.

9.不要提前创建对象

```
void f(){   
　　int i;   
　　A a = new A();   
　　if(....){   
　　a.showMessage();   
　　}   
　　}  
```

改成

```
 void f(){   
int i;   
A a = null;   
if(....){   
//用到时才实例化   
a = new A();   
a.showMessage();   
}   
} 
```

10 .(1)最基本的建议就是尽早释放无用对象的引用 

　  　A a = new A(); 

　　a = null; //当使用对象a之后主动将其设置为空 

　　(2)尽量少用finalize函数. 

　　(3) 如果需要使用经常用到的图片展,可以使用软引用. 

　　(4) 注意集合数据类型,包括数组,树等数据,这些数据结构对GC来说,回收更为复杂, 

　　(5) 尽量避免在类的默认构造器中创建,初始化大量的对象,防止在调用其自类的构造器时造成不必要的内存资源浪费. 

　　(6) 尽量避免强制系统做垃圾内存回收. 

　　(7) 尽量避免显式申请数组空间. 

　　(8) 尽量在合适的场景下使用对象池技术以提高系统性能,缩减系统内存开销.
　　
　　

11.当做数组拷贝操作时,采用System.arraycopy()方法完成拷贝操作要比采用循环的办法完成数组拷贝操作效率高


12. 尽量避免在循环体中调用方法,因为方法调用是比较昂贵的.

13. 尽量避免在循环体中使用try-catch 块,最好在循环体外使用try--catch块以提高系统性能.


14. 在多重循环中,如果有可能,尽量将最长的循环放在最内层,最短的循环放在最外层,以减少循环层间的变换次数.

15. 在需要线程安全的情况下,使用List list = Collections.synchronizedList(new ArrayList());


16. 如果预知长度,就设置ArrayList的长度.


17. ArrayList 与 LinkedList 选择,熟悉底层的实现原理,选择适当的容器.


18. 字符串累加采用StringBuffer.


19. 系统I/O优化,采用缓冲和压缩技术.优化性能.


21 尽量避免在构造中对静态变量做赋值操作

22. 不要在类的构造器中创建类的实例


23. 组合优化继承

24. 最好通过Class.forname() 动态的装载类

25. JSP优化,采用out 对象中的print方法代替println()方法

26 .采用ServletOutputStream 对象代替JSPWriter对象

27. 采用适当的值初始化out 对象缓冲区的大小

28. 尽量采用forward()方法重定向新的JSP

29. 利用线程池技术处理客户请求

30.Servlet优化 

(1) 通过init()方法来缓存一些静态数据以提高应用性能. 

　　(2) 用print() 方法取代println()方法. 

　　(3) 用ServletOutputStream 取代 PrintWriter. 

　　(4) 尽量缩小同步代码数量 
　　
　　
31. 改善Servlet应用性能的方法 

　　(1)不要使用SingleThreadModel 

　　(2)使用线程池ThreadPool
　　

32. EJB优化 

　　实体EJB: 

　　(1)实体EJB中常用数据缓存与释放 

　　(2)采用延迟加载的方式装载关联数据 

　　(3)尽可能地应用CMP类型实体EJB 

　　(4)直接采用JDBC技术处理大型数据


33. 优化JDBC连接 

　　(1)设置合适的预取行值 

　　(2)采用连接池技术 

　　(3)全合理应用事务 

　　(4)选择合适的事务隔离层与及时关闭连接对象


34. PreparedStatemetn只编译解析一次,而Statement每次都编译解析.

35. 尽可能地做批处理更新

36. 通过采用合适的getXXX方法提高系统性能

37. 采用设计模式.


文章出处：http://jbeduhai.iteye.com/blog/1412415
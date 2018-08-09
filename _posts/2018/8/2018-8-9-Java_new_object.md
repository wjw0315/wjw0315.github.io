---
layout:     post                  
title:      new 一个对象放在循环内部和外部的区别  
date:       2018-8-9             
author:     Mr.W                   
header-img: img/post-bg-rwd.jpg  
category: Java   
catalog: true  
tags:                             
-  Java基础
---


> 这是木瓜脑袋今天犯下的一个错

  ![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/8-9/3.png)
  
  这张图片中的是正确的处理方式。开始的时候是把对象new在了循环的外部，导致在批量更新的时候出现更新的数据都是重复的更新一条。这就在于new对象创建在循环内部和外部是不一样的。
  
  
  当我`Terminal terminal=new Terminal（）；`在外部的时候就存在于一个内存空间中，我们逻辑上看上去是对的，看似已经add进去所有数据，但是Debug的时候你就会发现其实你只是重复的add循环中set进去的最后一组实体数据。所以错误就出现在这里了。
  
  
 **结论：**
 
1、在循环体外，始终都是这一个对象，循环放入的都是最后的值。

2、在循环体内，创建的是不同的对象，每次放入的对应这不同值的对象。


**下面再讲讲这一段程序中的优化问题：**

1、开始的时候`Terminal terminal=new Terminal（）；`这个对象是直接创建在循环中，那么此处就出现一个GC回收的问题。

如果是直接创建在循环中，假设循环了50次，那么就是相当于50个引用对应50个对象。在这一段时间内都是会占用内存的，直到内存不足而被GC自动的回收。

2、之后改成了创建引用在循环外部`Terminal terminal=null;`再到循环的内部创建对象`termianl = new Terminal();` 这样就1个引用调用了创建的50个对象，这时候当后面的一个对象初始化（init）之后，前一个对象就会是**无引用的状态**很快就会被GC回收。


**PS：**可以看看这篇[Java优化编程的37条法则]()

---
layout:     post                  
title:      对List操作出现的异常和问题【未完】      
date:       2018-8-21             
author:     Mr.W                   
header-img: img/post-bg-rwd.jpg  
category: Java   
catalog: true  
tags:                             
- Java基础
---

# 1、java.lang.UnsupportedOperationException 

当我们把一串String数组转换成List，再去使用list的add和remove方法的时候就会出现这个错误，

```
 String[] array = {"1","2","3","4","5"};
        List<String> list = Arrays.asList(array);
        list.add("6");
```

Arrays的内部类ArrayList继承AbstractList，而AbstractList对throw UnsupportedOperationException不作任何操作，没有重写add和remove的方法，所以就报异常。因此我们需要定义一个java.util.ArrayList去存储之前的list，在java.util.ArrayList中重写了方法可以使用。

```
 String[] array = {"1","2","3","4","5"};
        List<String> list = Arrays.asList(array);
        List arrayList=new ArrayList(list);
        arrayList.add("6");
```

对于Arrays.asList需要注意：

（1）该方法不适用于基本数据类型（byte,short,int,long,float,double,boolean）

（2）该方法将数组与列表链接起来，当更新其中之一时，另一个自动更新

（3）不支持add和remove方法
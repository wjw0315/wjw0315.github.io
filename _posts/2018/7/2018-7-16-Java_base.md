---
layout:     post                  
title:      Java基础      
subtitle:   Java_base         
date:       2018-7-16             
author:     wjw                   
header-img: img/post-bg-rwd.jpg  
keywords_post:  "Java基础知识"
catalog: true                          
tags:                             
   - Java基础 
--- 

# 一：    数据类型

## 1、基本数据类型：

byte：Java中最小的数据类型，在内存中占8位(bit)，即1个字节，取值范围-128~127，默认值0

short：短整型，在内存中占16位，即2个字节，取值范围-32768~32717，默认值0

int：整型，用于存储整数，在内在中占32位，即4个字节，取值范围-2147483648~2147483647，默认值0

long：长整型，在内存中占64位，即8个字节-2^63~2^63-1，默认值0

float：浮点型，在内存中占32位，即4个字节，用于存储带小数点的数字（与double的区别在于float类型有效小数点只有6~7位），默认值0.0

double：双精度浮点型，用于存储带有小数点的数字，在内存中占64位，即8个字节，默认值0.0

char：字符型，用于存储单个字符，占16位，即2个字节，取值范围0~65535，默认值为空

boolean：布尔类型，占1个字节，用于判断真或假（仅有两个值，即true、false），默认值false

> 基本类型都有对应的包装类型，基本类型与其对应的包装类型之间的赋值使用自动装箱与拆箱完成

```
Integer x = 6;     // 装箱
int y = x;         // 拆箱
```
## 2、缓存池

new Integer(12) 与 Integer.valueOf(12) 的区别在于，new Integer(12) 每次都会新建一个对象，而 Integer.valueOf(12) 可能会使用缓存对象，因此多次使用 Integer.valueOf(12) 会取得同一个对象的引用。

```
Integer x = new Integer(12);
Integer y = new Integer(12);
System.out.println(x == y);    // false
Integer z = Integer.valueOf(12);
Integer k = Integer.valueOf(12);
System.out.println(z == k);   // true
```

编译器会在自动装箱过程调用 valueOf() 方法，因此多个 Integer 实例使用自动装箱来创建并且值相同，那么就会引用相同的对象。

```
Integer m = 123;
Integer n = 123;
System.out.println(m == n); // true
```

在 Java 8 中，Integer 缓存池的大小默认为 -128\~127。

Java 基本类型的值放在缓冲池中，包含以下这些：

- boolean values true and false
- all byte values
- short values between -128 and 127
- int values between -128 and 127
- char in the range \u0000 to \u007F

因此在使用这些基本类型对应的包装类型时，就可以直接使用缓冲池中的对象。






**[注]：**本篇文章内容来有摘录自`郑永川`的文章

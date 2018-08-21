---
layout:     post                  
title:      BeanUtils.copyProperties        
date:       2018-8-21             
author:     Mr.W                   
header-img: img/post-bg-rwd.jpg  
category: Java   
catalog: true  
tags:                             
- Java基础 
- Java API
---



`org.springframework.beans.BeanUtils`与`org.apache.commons.beanutils.BeanUtils`都提供了`copyProperties`方法，作用是将一个Bean对象中的数据封装到另一个属性结构相似的Bean对象中

1）两者的copyProperties方法参数位置不同

　`　org.springframework.beans.BeanUtils:　　copyProperties(sourceDemo, targetDemo)`

　`　org.apache.commons.beanutils.BeanUtils:　　copyProperties(targetDemo, sourceDemo)`

2）要求两个Bean的属性名相同，且有对应的setXxx方法和getXxx方法。其实底层原理是使用sourceDemo的getXxx方法和targetDemo的setXxx方法

3）sourceDemo有的属性而targetDemo没有的属性，不会封装到targetDemo对象中；

　  targetDemo有的属性而sourceDemo没有的属性，会封装到targetDemo中，数据为默认值（注意基本类型默认值与引用类型默认值不同）
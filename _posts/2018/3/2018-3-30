---
layout:     post
title:      递归应用
subtitle:   递归应用     
date:       2018-3-30 
author:     wjw
header-img: img/post-bg-rwd.jpg 
catalog: true
tags:
    - 数据结构与算法
--- 

## 递归的使用

- 自己调用自己本身


## 三角数的应用

三角数1,3,6,10,15...n

1、使用循环求解

```
int total=0;
int n;
while(n>0){
    total=total+n;
    n--;
}
```

1、使用递归

```
public void test(int n){
    if(n==1){
        return 1;
        }else{
        return test(n-1)+n;
    }
}  
```

## 斐波那契数列的应用

数列的第一项0，第二项为1，第n项为第n-1项加上第n-2项的和。

```
public class feiboshulie {
    public static int feibo(int n){
		if(n==1){
			return 0;
		}
		if(n==2){
			return 1;
		}else {
			return feibo(n-1)+feibo(n-2);
		}
	}
}

```

## 递归的高级应用（汉诺塔）

topN移动的盘子数，from起始的塔座，inter中间的塔座，to目标塔座

```
public class HanNuoTa {
    public static void test(int topN,char from,char inter,char to) {
		if (topN==1) {
			System.out.println("盘子从"+from+"塔座到"+to+"塔座");
		}else {
			test(topN, from, to, inter);
			System.out.println("盘子从"+from+"塔座到"+to+"塔座");
			test(topN, inter, from, to);
		}
	}
}

```

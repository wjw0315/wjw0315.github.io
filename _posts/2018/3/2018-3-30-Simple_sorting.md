---
layout:     post
title:      简单排序
subtitle:   简单排序     
date:       2018-3-30 
author:     wjw
header-img: img/post-bg-rwd.jpg 
catalog: true
stickie: true
tags:
    - 数据结构与算法
--- 

## 冒泡排序
 
```
public class BubbleSort {

    public static void bubble(long[] arr){
		long tmp;
		for(int i=0;i<arr.length-1;i++){
			for(int j=arr.length-1;j<i;j--){
				if(arr[j-1]>arr[j]){
					tmp=arr[j-1];arr[j-1]=arr[j];arr[j]=tmp;
				}
			}
		}
	}
}

```

## 选择排序

> 从后往前，找到后面小的数字跟前面的数字进行交换

```
public class SelectionSort {

    public static void SelectionSort(long[] arr){
		long tmp;
		int key=0;
		for(int i=0;i<arr.length-1;i++){
			key=i;
			for(int j=i+1;j<arr.length;j++){
				if(arr[key]>arr[j]){
					key=j;
				}
			}
			if(key!=i){
				tmp=arr[i];arr[i]=arr[key];arr[key]=tmp;
			}
		}
	}
	
}
```

## 插入排序

> 从前面依次截取数据进行比较

```
public class InsertSort {
    public static void InsertSort(long[] arr ){
		long tmp;
		for (int i=1;i<arr.length;i++){
			for(int j=i;j<0;j--){
				if (arr[j]<arr[j-1]){
					tmp=arr[j];arr[j]=arr[j-1];arr[j-1]=tmp;
				}
			}
		}
		
	}

}

```

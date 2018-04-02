---
layout:     post
title:      快速排序算法
subtitle:   快速排序算法     
date:       2018-3-30 
author:     wjw
header-img: img/post-bg-rwd.jpg 
catalog: true
tags:
    - 数据结构与算法
--- 
> 
1、将数组分成两个子数组，然后使用递归调用自身为每个子数组排序。
2、设置关键字，比关键字小的为一组，比关键字大的为一组。

- 设置最左边的为关键字

## 快速排序

```
public class QuickSort {
    public static int QuickSort(int[] arr,int left,int right){
		//选择最左边的数为关键字
		int key=arr[left];
		while(true){
			//从右开始，找到比关键字小的数放到左边
			while(left<right && arr[right]>=key)
				right--;
			arr[left]=arr[right];
			//找到比关键字大的数移动到右边
			while(left<right && arr[left]<=key)
				left++;
			arr[right]=arr[left];
			}
		//关键字到了最终位置
		arr[left] = key;
		//返回关键字的位置
		return left;

	}
	public void sort(int[] arr,int left,int right){
		if(left<right){
			int result=QuickSort(arr, left, right);
			sort(arr,left,result-1);
			sort(arr,result+1,right);
		}
	}
}
```

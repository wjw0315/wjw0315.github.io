---
layout:     post
title:      时间复杂度和空间复杂度
subtitle:   时间复杂度和空间复杂度     
date:       2018-3-30 
author:     wjw
header-img: img/post-bg-rwd.jpg 
catalog: true
tags:
    - 数据结构与算法
--- 
> 常用算法的时间复杂度和空间复杂度

排序算法 | 最差时间分析 | 平均时间复杂度 | 稳定度 | 空间复杂度
------- | ----------- | ------------ | ----- | --------
冒泡排序 | o(n^2) | o(n^2) | 稳定 | o(1) 
选择排序 | o(n^2) | o(n^2) | 不稳定 | o(1) 
插入排序 | o(n^2) | o(n^2) | 稳定 | o(1) 
快速排序 | o(n^2) | o(n*log2^n)  |不稳定 | (log2^n)~o(n) 
二叉树排序 | o(n^2) | o(n*log2^n) | 不一定 | o(n)
堆排序 | o(n*log2^n) | o(n*log2^n) | 不稳定 | o(1)
希尔排序 | o | o | 不稳定 | o(1)

o($$n^2$$)
o(n*log$$2^n$$)

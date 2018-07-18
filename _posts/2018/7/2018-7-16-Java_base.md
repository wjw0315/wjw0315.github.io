---
layout:     post                  
title:      Java����      
subtitle:   Java_base         
date:       2018-7-16             
author:     wjw                   
header-img: img/post-bg-rwd.jpg  
catalog: true                          
tags:                             
- Java���� 
---
  
# һ��    ��������

## 1�������������ͣ�

byte��Java����С���������ͣ����ڴ���ռ8λ(bit)����1���ֽڣ�ȡֵ��Χ-128~127��Ĭ��ֵ0

short�������ͣ����ڴ���ռ16λ����2���ֽڣ�ȡֵ��Χ-32768~32717��Ĭ��ֵ0

int�����ͣ����ڴ洢��������������ռ32λ����4���ֽڣ�ȡֵ��Χ-2147483648~2147483647��Ĭ��ֵ0

long�������ͣ����ڴ���ռ64λ����8���ֽ�-2^63~2^63-1��Ĭ��ֵ0

float�������ͣ����ڴ���ռ32λ����4���ֽڣ����ڴ洢��С��������֣���double����������float������ЧС����ֻ��6~7λ����Ĭ��ֵ0.0

double��˫���ȸ����ͣ����ڴ洢����С��������֣����ڴ���ռ64λ����8���ֽڣ�Ĭ��ֵ0.0

char���ַ��ͣ����ڴ洢�����ַ���ռ16λ����2���ֽڣ�ȡֵ��Χ0~65535��Ĭ��ֵΪ��

boolean���������ͣ�ռ1���ֽڣ������ж����٣���������ֵ����true��false����Ĭ��ֵfalse

> �������Ͷ��ж�Ӧ�İ�װ���ͣ��������������Ӧ�İ�װ����֮��ĸ�ֵʹ���Զ�װ����������

```
Integer x = 6;     // װ��
int y = x;         // ����
```
## 2�������

new Integer(12) �� Integer.valueOf(12) ���������ڣ�new Integer(12) ÿ�ζ����½�һ�����󣬶� Integer.valueOf(12) ���ܻ�ʹ�û��������˶��ʹ�� Integer.valueOf(12) ��ȡ��ͬһ����������á�

```
Integer x = new Integer(12);
Integer y = new Integer(12);
System.out.println(x == y);    // false
Integer z = Integer.valueOf(12);
Integer k = Integer.valueOf(12);
System.out.println(z == k);   // true
```

�����������Զ�װ����̵��� valueOf() ��������˶�� Integer ʵ��ʹ���Զ�װ������������ֵ��ͬ����ô�ͻ�������ͬ�Ķ���

```
Integer m = 123;
Integer n = 123;
System.out.println(m == n); // true
```

�� Java 8 �У�Integer ����صĴ�СĬ��Ϊ -128\~127��

Java �������͵�ֵ���ڻ�����У�����������Щ��

- boolean values true and false
- all byte values
- short values between -128 and 127
- int values between -128 and 127
- char in the range \u0000 to \u007F

�����ʹ����Щ�������Ͷ�Ӧ�İ�װ����ʱ���Ϳ���ֱ��ʹ�û�����еĶ���






**[ע]��**���´󲿷���������`֣����`������

---
layout:     post
title:      Oracle SQL优化之共享SQL语句（转）
subtitle:   oracle_shared sql
date:       2017-12-04
author:     Fe
header-img: img/post-bg-coffee.jpeg
catalog: true
tags:
    - Oracle
---
>Oracle SQL语句性能优化笔记  
>共享SQL语句  
>高性能Ocacle优化

## 共享SQL语句
### 概述
为了不重复解析相同的SQL语句，在第一次解析之后，Oracle将SQL语句存放在内存中。这块位于系统全局区域SGA(systemglobal area)的共享池(shared buffer pool中的内存可以被所有的数据库用户共享。因此，当你执行一个SQL语句(有时被称为一个游标)时，如果它和之前执行过的语句完全相同，Oracle就能很快获得已经被解析的语句以及最好的执行方案。Oracle的这个功能大大地提高了SQL的执行性能并节省了内存的使用。

可惜的是ORACLE只对简单的表提供高速缓冲(cache buffering) ,这个功能并不适用于多表连接查询.

数据库管理员必须在init.ora中为这个区域设置合适的参数,当这个内存区域越大,就可以保留更多的语句,当然被共享的可能性也就越大了.  

>个人认为SQL共享其实就是Oracle的SQL缓存机制

### 如何进行SQL语句共享

sql 语句传入shared pool后, 会被先转换成*ASCII码*, 然后经过一系列运算,其中包括HASH运算,得出HASH值,然后得出一串数字,并包含1个内存链chain号码.

Server Process 就会拿着chain号码和HASH号码,到Library cache上找到对应的内存链chain, 然后遍历上面的chunk(比较Hash值), 如果有1个chunk的Hash与之相同,则证明这条sql曾经被硬解析过, 就直接可以拿出对应执行计划, 这就是软解析.

我们也可以说这条sql与之前硬解析过的sql共享了.

如果找不到hash值相同的chunk,  则认为这条sql未被硬解析过, 需要重新进行硬解析.

所以可以看出,那个HASH值十分重要, 而hash值是由ASCII码运算出来的, 所以共享sql之间的*ASCII码*要相同.

而ASCII是由SQL语句的字符决定的.  所以两条共享sql语句的每个字符要相同. 而且**大小写**都要相同

### SQL共享的条件
#### A.	字符级的比较

当前被执行的语句和共享池中的语句必须完全相同.例如:  
`SELECT * FROM EMP;`  
这条SQL语句和下列的每一条都不相同  
```
SELECT * from EMP;  
Select * From Emp;    
SELECT * FROM EMP;
```
---
SQL语句共享中缓存的key是sql语句转换后的*ASCII码*  

#### B.	两个语句所指的对象必须完全相同
例如:

|用户|对象名|如何访问|
|:-:|:-:|:-:|
| Jack | sal_limit | private synonym |
||Work_city|public synonym |
||Plant_detail | public synonym |
|Jill| sal_limit | private synonym |
||Work_city|public synonym |
||Plant_detail | public synonym |  

考虑一下下列语句能否在这两个用户之间共享

|SQL|能否共享|原因|
|:-:|:-:|:-:|
|select max(sal_cap) from sal_limit;|不能|每个用户都有一个 private synonym - sal_limit , 它们是不同的对象|
|select count(*0 from work_city where sdesc like 'NEW%';|能|两个用户访问相同的对象 public synonym - work_city|
|select a.sdesc,b.location from work_city a , plant_detail b where a.city_id = b.city_id|不能|用户 jack 通过 private synonym 访问 plant_detail 而 jill 是表的所有者,对象不同.|

#### C.	两个 SQL 语句中必须使用相同的名字的绑定变量(bind variables)
例如：

第一组的两个SQL语句是相同的(可以共享),而第二组中的两个语句是不同的(即使在运行时,赋于不同的绑定变量相同的值)

```
a.
select pin , name from people where pin = :blk1.pin;
select pin , name from people where pin = :blk1.pin;
```  
```
b.
select pin , name from people where pin = :blk1.ot_ind;
select pin , name from people where pin = :blk1.ov_ind;
```

---
layout:     post
title:      Oracle SQL实现对行列的合并
subtitle:   oracle_sql_merger of ranks
date:       2017-12-08
author:     Fe
header-img: img/post-bg-sql.jpg
catalog: true
tags:
    - Oracle
    - SQL
---
>操作字段,||,wm_concat()函数,REPLACE()函数

## 对表格字段进行合并

### 前言

在很多时候,我们会需要对查询出来的数据进行连接字符串的 **+** 操作.
一般来说,这一点在业务代码中实现会更方便一些.
这里,我要说的是如何使用SQL语句进行字段的合并拼接.

### 试验的数据样式

首先,我们需要一串数据库的数据:一张 **student** 表:

|id|class|student_name|student_id|student_from|
|:-:|:-:|:-:|:-:|:-:|
|1|1|张一|1|河南|
|2|1|张四|2|福建|
|3|2|王五|1|北京|
|4|1|赵三|3|新疆|
|5|2|孙二|2|南京|
|6|2|李六|3|河北|


### 进行数据的拼接

好了,现在我们的数据库有了一张学生表,表里有班级,学生姓名,学号,和生源地.
现在我们需要获得这张表的数据:  
`select * from student;`

|id|class|student_name|student_id|student_from|
|:-:|:-:|:-:|:-:|:-:|
|1|1|张一|1|河南|
|2|1|张四|2|福建|
|3|2|王五|1|北京|
|4|1|赵三|3|新疆|
|5|2|孙二|2|南京|
|6|2|李六|3|河北|

#### 进行列的拼接

可是如我我们需要讲除了班级的学生信息全部显示在一行并以 **//** 隔开要怎么做呢?  
我们只要这样:

`select s.class,(s.student_name||'//'||s.student_id||'//'||s.student_from) about from student s;`

就能获得:

|class|about|
|:-:|:-:|
|1	|张一//1//河南|
|1  |张四//2//福建|
|2	|王五//1//北京|
|1	|赵三//3//新疆|
|2	|孙二//2//南京|
|2	|李六//3//河北|

那么我们是怎么做到的呢,正是 `||'//'||` ,我们用这个符号把列数据进行合并.

 其中的关键则是: `||`  ，JAVA语言中其名称为逻辑“或”，在SQL中则用来连接两个字符串连接符。  

sql: `s.student_name||'//'||s.student_id||'//'||s.student_from`

那么,这句话翻译成java则是:

java: `s.student_name+"//"+s.student_id+"//"+s.student_from`

#### 进行行的拼接  wm_concat()函数

好了,我们现在把每一列的数据整合在一起了,大功告成,可喜可贺.
这是,项目经理过来了,表示这样不行(改需求),我要把一整个班的所有学生数据在一行都显示出来.

大概是这样:

|class|about|
|:-:|:-:|
|1|	张一//1//河南,赵三//3//新疆,张四//2//福建|
|2|	王五//1//北京,李六//3//河北,孙二//2//南京|

我们已经把每一列的数据整合到一起了.现在,我们要对行进行处理了.  
这时,我们要用到一个sql函数:**wm_concat**  
这是一个聚合函数，其作用是将一列数据转换成一行

`select s.class,wm_concat(s.student_name||'//'||s.student_id||'//'||s.student_from) about from student s`

这时我们会发现报错了:

```
ORA-00937: 不是单组分组函数
00937. 00000 -  "not a single-group group function"
*Cause:    
*Action:
行 1 列 8 出错
```

这是因为我们只把后面一个列进行整合了,而没有对第一列的数据 **class** 进行操作,这时我们只需要最语句最后加上一句: `group by s.class` 就会自动按照班级进行自增排序.

sql语句:

`
select s.class,wm_concat(s.student_name||'//'||s.student_id||'//'||s.student_from) about from student s group by s.class;`

#### 扩展,REPLACE()函数

我们很好的又完成了任务,这时又改需求了.
项目经理说,不能用逗号连接啊,我们要用~来连接每一行.  
这时我们需要用到 `REPLACE() ` 这个函数,也就是正则  
使用`REPLACE() `将其中的逗号**,** 替换为 **~** 就可以了

sql语句:  

`select s.class,replace(wm_concat(s.student_name||'//'||s.student_id||'//'||s.student_from),',','~') about from student s group by s.class;`

结果:  

|class|about|
|:-:|:-:|
|1|	张一//1//河南~赵三//3//新疆~张四//2//福建|
|2|	王五//1//北京~李六//3//河北~孙二//2//南京|

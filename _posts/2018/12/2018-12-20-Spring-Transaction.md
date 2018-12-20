---
layout:     post                  
title:      Spring事务    
date:       2018-12-20             
author:     JiaweiWu        
header-img: img/post-bg-rwd.jpg  
category: Spring   
catalog: true  
tags:                             
- Spring 
---

# 事务的属性

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/12/Spring/Spring事务管理_1.png)


- `value`，在有多个事务管理器存在的情况下，用于标识使用哪个事务管理器
- `isolation`，事务的隔离级别，默认是Isolation.DEFAULT，这个 DEFAULT是和具体使用的数据库相关的。关于隔离级别，需要学习MySQL的事务。
- `readOnly`, 是否只读，如果配置了true，但是方法里使用了update，insert语句，会报错。对于只读的事务，配置为true有助于提高性能。
- `rollbackFor`, `noRollbackFor` Spring的声明式事务的默认行为是如果方法抛出RuntimeException或者Error,则事务会回滚，对于其他的checked类型的异常，不会回滚。如果想改变这种默认行为，可以通过这几个属性来配置。
- `propagation`, 后面会具体讲。




类型 | 说明
---|---
PROPAGATION_REQUIRED | 如果当前没有事务，就新建一个事务，如果已经存在一个事务中，加入到这个事务中。这是 最常见的选择。
PROPAGATION_SUPPORTS |	支持当前事务，如果当前没有事务，就以非事务方式执行
PROPAGATION_MANDATOR |	使用当前的事务，如果当前没有事务，就抛出异常
PROPAGATION_REQUIRES_NEW |	新建事务，如果当前存在事务，把当前事务挂起
PROPAGATION_NOT_SUPPORTED |	以非事务方式执行操作，如果当前存在事务，就把当前事务挂起
PROPAGATION_NEVER |	以非事务方式执行，如果当前存在事务，则抛出异常
PROPAGATION_NESTED |	如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，则执行与 PROPAGATION_REQUIRED 类似的操作


下面重点介绍下`PROPAGATION_REQUIRED`，`PROPAGATION_REQUIRES_NEW`，`PROPAGATION_NESTED`三种隔离级别。

# 例一、

> ==test1实体中数据：
name:12 ; id:1==

> ==tset2实体中数据：
name:13 ; id:1==

```
public class MysqlTest01 {
    @Autowired
	private TestDao testDao;
    private MysqlTest02 mysqlTest02;
    
    @Transactional
    public void test() {
        testDao.update(test1);
        try {
            mysqlTest02.test();
        } catch (Exception e) {
            System.out.println("第二个事务异常");
        }
     }
    }
```

```
class MysqlTest02 {
    @Autowired
	private TestDao testDao;
	
    @Transactional(propagation = Propagation.REQUIRED)
    public void test() {
        testDao.update(test2);
        throw new RuntimeException();
    }
    }
```


执行完之后，test表的数据没有任何变化。 由于MysqlTest02中的事务传播类型是`Propagation.REQUIRED`，逻辑上有两个事务，但底层是共用一个物理事务的,逻辑上的第二个事务抛出`RuntimeExcetion`导致事务回滚，对于这种传播类型，内层事务的回滚会导致外层事务回滚。所以数据库中的数据没有任何变化。

# 例二、

```
public class MysqlTest01 {
    @Autowired
	private TestDao testDao;
    private MysqlTest02 mysqlTest02;
    
    @Transactional
    public void test() {
        testDao.update(test1);
        try {
            mysqlTest02.test();
        } catch (Exception e) {
            System.out.println("第二个事务异常");
        }
     }
    }
```

```
class MysqlTest02 {
    @Autowired
	private TestDao testDao;
	
    @Transactional(propagation = Propagation.REQUIRED_NEW)
    public void test() {
        testDao.update(test2);
        throw new RuntimeException();
    }
    }
```

同样的代码，唯一的区别就是第二个事务的传播属性改成了REQUIRES_NEW，执行结果是啥？不好意思，**第二个事务执行不了**。

对于`Propagation.REQUIRED_NEW`，逻辑上有两个事务，底层物理上也有两个事务，由于第一个事务和第二个事务更新的是同一条记录，对于Mysql默认的隔离级别`REPEATABLE-READ`来说，第一个事务会对该记录加排他锁，所以**第二个事务就一直卡住了**。

那么

==我们把test2实体中的数据改变一下：name:13 ; id:2==

执行之后，会发现**只有第二个事务出现了回滚**，第一个事务运行完成更新到数据库中。

# 例三：

==test1实体中的数据：name:12 ; id:1==

==test2实体中的数据：name:13 ; id:1==

==test3实体中的数据：name:14 ; id:1==

`PROPAGATION_NESTED `对于这种传播类型，物理上只有一个事务，不过可以有多个savePoint用来回滚。当然是用这种传播类型，**需要数据库支持savePoint，使用jdbc的也是要3.0版本以上。**

```
public class MysqlTest01 {
    @Autowired
	private TestDao testDao;
    private MysqlTest02 mysqlTest02;
     private MysqlTest03 mysqlTest03;
    
    @Transactional
    public void test() {
        testDao.update(test1);
        try {
            mysqlTest02.test();
        } catch (Exception e) {
            System.out.println("第二个事务异常");
        }
        mysqlTest03.test();
     }
    }
```

```
class MysqlTest02 {
    @Autowired
	private TestDao testDao;
	
    @Transactional(propagation = Propagation.NESTED)
    public void test() {
        testDao.update(test2);
        throw new RuntimeException();
    }
    }
```

```
class MysqlTest03 {
    @Autowired
	private TestDao testDao;
	
    @Transactional(propagation = Propagation.NESTED)
    public void test() {
        testDao.update(test3);
    }
    }
```

执行，可以看到**第一个事务和第三个事务提交成功**了，**第二个事务回滚了**。物理上它们是在一个事务里的，只不过用到了**保存点**的技术。

# 例四：

==test1实体中的数据：name:12 ; id:1==

==test2实体中的数据：name:13 ; id:2==

同类中的不同事务之间相互调用。

```
public class MysqlTest01 {
    @Autowired
	private TestDao testDao;
    
    @Transactional
    public void test01() {
        testDao.update(test1);
        test02();
     }
     @Transactional
    public void test02() {
        testDao.update(test2);
     }
    }
```

在Spring的AOP中，test01调用test02, test02是不会被AOP截获的。因此实际上只存在第一个事务。当test02抛出异常，第一个事务调用了test02()方法，因此会导致第一个事务回滚。

Spring AOP的实现本质是通过动态代理的方式去执行真正的方法，然后在代理类里面做一些额外的事情。当通过别的类调用MysqlTest01中的test01方法时，因为使用了Spring的DI，注入的其实是一个MysqlTest01的一个代理类，而通过内部方法调用test02时，则不是。

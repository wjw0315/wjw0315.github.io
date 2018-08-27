---
layout:     post                  
title:      策略模式与避免臃肿的if-else  
date:       2018-8-27             
author:     wjw                   
header-img: img/post-bg-rwd.jpg  
catalog: true   
stickie: false                       
tags:                             
- 设计模式 
---

## 类图

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/8-27/1.png)

## 实现

> 假设我们设计一辆车，它可以动态的改变鸣笛的声音。

QuackBehavior接口

```java
public interface QuackBehavior {
    void quack();
}
```

创建两个类实现接口，并给方法不同的实现，这里就是假设输出两种不同的汽车声音。

```java
public class Quack implements QuackBehavior {
    @Override
    public void quack() {
        System.out.println("quack!");
    }
}

```

```java
public class Squeak implements QuackBehavior{
    @Override
    public void quack() {
        System.out.println("squeak!");
    }
}
```

创建context的类

```java
public class Car {
    private QuackBehavior quackBehavior;

    public void performQuack() {
        if (quackBehavior != null) {
            quackBehavior.quack();
        }
    }

    public void setQuackBehavior(QuackBehavior quackBehavior) {
        this.quackBehavior = quackBehavior;
    }
}
```

最后客户端使用：

```java
public class Client {
    public static void main(String[] args) {
        Car car = new Car();
        car.setQuackBehavior(new Squeak());
        car.performQuack();
        car.setQuackBehavior(new Quack());
        car.performQuack();
    }
}
```

会输出如下的结果：

```
squeak!
quack!
```

**下面我们介绍一个实际开发中的使用：**

## 避免臃肿的if else语句

业务场景：

> 我们有“天、周、月”这三种粒度类型，根据客户端给的粒度取计算两个时间相差的“天、周、月”。例如：当粒度是“周”，那么客户端就会传入两个以周为度量的时间，计算两个时间相差几周。

优化的原因：

为了避免重读的使用if else ，并且降低系统的耦合，方便今后的扩展。我们将采用策略模式进行优化处理。

1、创建粒度的枚举类GranularityEnum：

```java

public enum GranularityEnum {

    DAY(0, "天"),

    WEEK(1, "周"),

    MONTH(2,"月");


    private int value;

    private String description;

    private GranularityEnum(int value, String description) {

        this.value = value;

        this.description = description;

    }

    public int value() {

        return value;

    }

    public String description() {

        return description;

    }

    public static GranularityEnum valueOf(int value) {

        for(GranularityEnum type : GranularityEnum.values()) {

            if(type.value() == value) {

                return type;

            }

        }

        return null;

    }
}

```

2、创建Strategy接口：

```java
public interface Strategy {

    public int TimeDiffer(Date startTime , Date endTime );

}

```

3、创建“天、周、月”这三个类并对Strategy接口的实现：

这三个类中的TimeC的类是对时间差值计算的工具类

```java
public class DayStrategy implements Strategy {
    @Override
    public int TimeDiffer(Date startTime, Date endTime) {
        TimeC timeC=new TimeC(startTime,endTime);
        return  timeC.TimeDay();
    }
}
```

```
public class WeekStrategy implements Strategy {
    @Override
    public int TimeDiffer(Date startTime, Date endTime) {
        TimeC timeC=new TimeC(startTime,endTime);
        return  timeC.TimeWeek();
    }
}
```

```java
public class MonthStrategy implements Strategy {
    @Override
    public int TimeDiffer(Date startTime, Date endTime) {
        TimeC timeC=new TimeC(startTime,endTime);
        return  timeC.TimeMonth();
    }
}
```

4、创建一个工厂StrategyFactory类：

```java
public class StrategyFactory {

    private static StrategyFactory factory = new StrategyFactory();
    
    
    public static StrategyFactory getInstance(){

        return factory;

    }

    private StrategyFactory(){

    }
    
    private static Map strategyMap = new HashMap<>();

    static{
        strategyMap.put(GranularityEnum.DAY.value(), new DayStrategy());
        
        strategyMap.put(GranularityEnum.WEEK.value(), new WeekStrategy());
        
        strategyMap.put(GranularityEnum.MONTH.value(), new MonthStrategy());


    }
    public Strategy creator(Integer type){

        return (Strategy) strategyMap.get(type);

    }

}

```

5、创建context类：

```java
public class Context {

    private Strategy strategy;

    public Strategy getStrategy() {
        return strategy;
    }

    public void setStrategy(Strategy strategy) {
        this.strategy = strategy;
    }

    public int TimeDiffer(Date startTime , Date endTime , Integer type){

        strategy = StrategyFactory.getInstance().creator(type);

        return strategy.TimeDiffer(startTime, endTime);

    }

}
```

我们可以从`strategy = StrategyFactory.getInstance().creator(type);`获取需要创建的是哪个对象，在StrategyFactory类的Map中我们已经存入了相应的三个需要判断创建的对象，最后return中调用TimeDiffer方法得到你需要的数据。


6、客户端中使用：
```java
        Integer key =Integer.parseInt(scheduling.getGranularity());
		Context context = new Context();
		int s = context.TimeDiffer(startTime,endTime, key);
```



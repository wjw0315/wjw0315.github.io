---
layout:     post                  
title:      list的浅拷贝与深拷贝     
date:       2018-10-8            
author:     Jiawei Wu
header-img: img/post-bg-rwd.jpg  
category: Java   
catalog: true  
tags:                             
- Java容器 
---


# 一、ArrayList的Clone方法

- 1、返回一个Object对象，所以在使用此方法的时候要强制转换。

- 2、ArrayList的本质是维护了一个Object的数组，所以克隆也是通过数组的复制实现的，属于浅复制。

```
public Object clone() {
            try {
                @SuppressWarnings("unchecked")
                    ArrayList<E> v = (ArrayList<E>) super.clone();
                v.elementData = Arrays.copyOf(elementData, size);
                v.modCount = 0;
                return v;
            } catch (CloneNotSupportedException e) {
                // this shouldn't happen, since we are Cloneable
                throw new InternalError();
            }
        }
```

# 二、ArraList的clone的浅复制

**当你需要使用remove方法移除掉集合中的对象，而非要修改集合中的对象的时候，可以选择使用。**

```
//添加两个元素
Student stJack=new Student("Jack", 13);
Student stTom=new Student("Tom", 15);
list.add(stJack);
list.add(stTom);
//克隆
ArrayList<Student> listCopy=(ArrayList<Student>) list.clone();
//移除且不修改
listCopy.remove(1);
System.out.println(list);
System.out.println(listCopy);
```
输出结果：

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/10-8/1.png)

解读：

remove之前：

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/10-8/2.png)

remove之后：

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/10-8/3.png)

**所以移除且不修改集合中的元素，只是在List内部的数组中移除了指向元素的地址，可以放心的使用clone。**

#三、ArrayList的深复制

**如果你想要修改克隆后的集合，只使用浅复制会导致克隆前的也会被修改。那么就需要使用深复制。通过实现对象类的clone方法。**

```
public class testClone {
    public static void main(String[] args) {
            ArrayList<Student> list=new ArrayList<Student>();
            //添加两个元素
            Student stJack=new Student("Jack", 13);
            Student stTom=new Student("Tom", 15);
            list.add(stJack);
            list.add(stTom);
            //深克隆
            ArrayList<Student> listCopy=new ArrayList<Student>();
            for (Student student : list) {
                listCopy.add(student.clone());
            }
            //修改克隆数据
            listCopy.get(0).setAge(20);
            System.out.println(list);
            System.out.println(listCopy);
    }
}
```
```
class Student{
    private String name;
    private int age;
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public int getAge() {
        return age;
    }
    public void setAge(int age) {
        this.age = age;
    }
    public Student(String name, int age) {
        super();
        this.name = name;
        this.age = age;
    }
    @Override
    public String toString() {
        return "Student [name=" + name + ", age=" + age + "]";
    }
    @Override
    protected Student clone(){
        Student stuent = new Student(this.name,this.age); 
        return stuent; 
    }
       
}
```
---
layout:     post                  
title:      反射机制--Map与JavaBean的相互转换      
date:       2018-12-10             
author:     wjw                   
header-img: img/post-bg-rwd.jpg  
catalog: true                          
tags:                             
- Java基础 
---

> 下面实例中使用一个Student的实体

JavaBean转成Map

```
//JavaBean转换为Map
	public static Map<String,Object> bean2map(Object bean) throws Exception{
		Map<String,Object> map = new HashMap<>();
		//获取指定类（Person）的BeanInfo 对象
		BeanInfo beanInfo = Introspector.getBeanInfo(Student.class, Object.class);
		//获取所有的属性描述器
		PropertyDescriptor[] pds = beanInfo.getPropertyDescriptors();
		for(PropertyDescriptor pd:pds){
			String key = pd.getName();
			Method getter = pd.getReadMethod();
			Object value = getter.invoke(bean);
			map.put(key, value);
		}
		return map;
	}
```

Map转成JavaBean

```

	//Map转换为JavaBean
	public static <T> T map2bean(Map<String,Object> map,Class<T> cl) throws Exception{
		//创建JavaBean对象
		T obj = cl.newInstance();
		//获取指定类的BeanInfo对象
		BeanInfo beanInfo = Introspector.getBeanInfo(cl, Object.class);
		//获取所有的属性描述器
		PropertyDescriptor[] pds = beanInfo.getPropertyDescriptors();
		for(PropertyDescriptor pd:pds){
			Object value = map.get(pd.getName());
			Method setter = pd.getWriteMethod();
			if(value != ""){
			    setter.invoke(obj, value);
			}
		}
		return  obj;
	}
```
测试：

```
Student S= new Student("aa",17);
Map<String,Object> map1 = new HashMap<>();
map1 = bean2map(S);
System.out.println(map1);


Map<String,Object> map = new HashMap<>();
map.put("name", "bb");
map.put("age", 18);
Student S1 = map2bean(map,Student.class);
System.out.println(S1);
```

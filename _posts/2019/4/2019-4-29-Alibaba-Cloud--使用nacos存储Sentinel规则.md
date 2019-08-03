---
layout:     post                  
title:      Alibaba-Cloud--使用nacos存储Sentinel规则 
date:       2019-4-29             
author:     JiaweiWu        
header-img: img/post-bg-rwd.jpg  
category: SpringCloud   
catalog: true  
tags:                             
- SpringCloud
- Alibaba
---

Sentinel Dashboard中设置的限流规则在应用重启之后就会丢失。那么，接下来我们就来说说Sentinel的规则持久化如何实现。

Sentinel自身就支持了多种不同的数据源来持久化规则配置，目前包括以下几种方式：

- 文件配置
- Nacos配置
- ZooKeeper配置
- Apollo配置

<a name="5Rizz"></a>
# 使用nacos存储Sentinel规则

<a name="eBm6k"></a>
## 配置

- 使用上篇文章[**Alibaba-Cloud--Sentinel(限流)**](https://www.yuque.com/wjwcloud/note/gmpm60) 中的客户端工程**cloud-sentinel**。
- 增加依赖

```
<dependency>
        <groupId>com.alibaba.csp</groupId>
        <artifactId>sentinel-datasource-nacos</artifactId>
       <version>1.4.0</version> 
</dependency>
```

- 配置文件修改

```
spring.application.name=cloud-sentinel
server.port=8002

spring.cloud.sentinel.transport.dashboard=localhost:8080

spring.cloud.sentinel.datasource.ds.nacos.server-addr=localhost:8848
spring.cloud.sentinel.datasource.ds.nacos.dataId=${spring.application.name}-sentinel
spring.cloud.sentinel.datasource.ds.nacos.groupId=DEFAULT_GROUP
```

  - `spring.cloud.sentinel.transport.dashboard`：sentinel控制台的访问地址<br />
  - `spring.cloud.sentinel.datasource.ds.nacos.server-addr`：nacos的访问地址<br />
  - `spring.cloud.sentinel.datasource.ds.nacos.groupId`：nacos中存储规则的groupId<br />
  - `spring.cloud.sentinel.datasource.ds.nacos.dataId`：nacos中存储规则的dataId

- 在nacos中添加配置：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1557215394219-059121c5-a3d3-4e51-a3f1-b000eba9ed9e.png#align=left&display=inline&height=663&name=image.png&originHeight=762&originWidth=1384&size=38889&status=done&width=1203.4782858201377)
```
[
    {
        "resource":"/test",
        "limitApp":"default",
        "grade":1,
        "count":3,
        "strategy":0,
        "controlBehavior":0,
        "clusterMode":false
    
    }
]
```


  - resource：资源名，即限流规则的作用对象<br />
  - limitApp：流控针对的调用来源，若为 default 则不区分调用来源<br />
  - grade：限流阈值类型（QPS 或并发线程数）； `0`代表根据并发数量来限流， `1`代表根据QPS来进行流量控制<br />
  - count：限流阈值<br />
  - strategy：调用关系限流策略<br />
  - controlBehavior：流量控制效果（直接拒绝、Warm Up、匀速排队）<br />
  - clusterMode：是否为集群模式



- 启动客户端工程，进入sentinel控制台能够直接看到nacos中的配置

![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1557215875097-8203fa61-21af-4154-8009-f52eefe5ba10.png#align=left&display=inline&height=243&name=image.png&originHeight=279&originWidth=1713&size=18309&status=done&width=1489.565248273046)

【注】此时修改sentinel控制台的规则，重启之后设置的数据会丢失，这里设置的规则只是存在内存中，我们需要进入nacos中进行修改规则。



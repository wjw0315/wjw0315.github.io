---
layout:     post                  
title:      Alibaba-Cloud--Sentinel(限流) 
date:       2019-4-29             
author:     JiaweiWu        
header-img: img/post-bg-rwd.jpg  
category: SpringCloud   
catalog: true  
tags:                             
- SpringCloud
- Alibaba
---

> 分布式系统的流量防卫兵

Netflix宣布对Hystrix停止更新后，Spring Cloud官方推荐的resilience4j之外，目前Spring Cloud Alibaba下整合的Sentinel也是用户可选型的目标。

<a name="22bET"></a>
# 使用Sentinel实现接口限流

- sentinel-dashboard：与hystrix-dashboard类似，但是它更为强大一些。除了与hystrix-dashboard一样提供实时监控之外，还提供了流控规则、熔断规则的在线维护等功能。<br />
- 客户端整合：每个微服务客户端都需要整合sentinel的客户端封装与配置，才能将监控信息上报给dashboard展示以及实时的更改限流或熔断规则等。

<a name="APw95"></a>
### 部署Sentinel Dashboard

- 环境

spring cloud alibaba：0.2.1<br />sentinel： 1.4.0

  - 下载地址：https://github.com/alibaba/Sentinel/releases/download/1.4.0/sentinel-dashboard-1.4.0.jar
  - 如果需要其他的版本可以进地址选择：https://github.com/alibaba/Sentinel/releases



> 从 Sentinel 1.5.0 开始，控制台提供通用的鉴权接口 [AuthService](https://github.com/alibaba/Sentinel/blob/master/sentinel-dashboard/src/main/java/com/alibaba/csp/sentinel/dashboard/auth/AuthService.java)，用户可根据需求自行实现。
> 从 Sentinel 1.6.0 起，Sentinel 控制台引入基本的登录功能，默认用户名和密码都是 sentinel。
<br />用户可以通过如下参数进行配置：<br />

- `-Dsentinel.dashboard.auth.username=sentinel` 用于指定控制台的登录用户名为 `sentinel`；
- `-Dsentinel.dashboard.auth.password=123456` 用于指定控制台的登录密码为 `123456`；如果省略这两个参数，默认用户和密码均为 `sentinel`；
- `-Dserver.servlet.session.timeout=7200` 用于指定 Spring Boot 服务端 session 的过期时间，如 `7200` 表示 7200 秒；`60m` 表示 60 分钟，默认为 30 分钟；


<br />同样也可以直接在 Spring properties 文件中进行配置。<br />

- 直接启动Java的方式进行启动：

```
java -jar sentinel-dashboard-1.40.jar
//默认端口是8080，可以启动配置其他端口 -Dserver.port=8081
```

- 直接访问：localhost:8080会进入到如下的界面：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1557199932329-b937eb03-d630-4d4e-8f48-7278bdbb362b.png#align=left&display=inline&height=742&name=image.png&originHeight=853&originWidth=1850&size=25668&status=done&width=1608.695685525473)

<a name="BPd5x"></a>
## 整合Sentinel

- 创建SpringCloud项目，我直接复制demo中服务消费者（nacos-consumer）的例子直接修改.
- 相关依赖

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.0.6.RELEASE</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>com.wjwcloud</groupId>
	<artifactId>cloud-sentinel</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>cloud-sentinel</name>
	<description>sentinel</description>

	<properties>
		<java.version>1.8</java.version>
	</properties>

	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>org.springframework.cloud</groupId>
				<artifactId>spring-cloud-alibaba-dependencies</artifactId>
				<version>0.2.1.RELEASE</version>
				<type>pom</type>
				<scope>import</scope>
			</dependency>
		</dependencies>
	</dependencyManagement>

	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
		</dependency>
		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<version>1.18.2</version>
			<optional>true</optional>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>

</project>
```

- 修改配置文件

```
spring.application.name=cloud-sentinel
server.port=8002
# 通过参数指向sentinel控制台的地址
spring.cloud.sentinel.transport.dashboard=localhost:8080
```

- 编写测试请求接口

```
   @RequestMapping("test")
    @ResponseBody
    public String test(){
        return "sentinel";
    }
```

- 我们直接请求接口localhost:8002/test，会在Sentinel的控制台看到数据

![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1557201975561-821d4454-5cbb-4357-b123-3e7a22d46edc.png#align=left&display=inline&height=695&name=image.png&originHeight=799&originWidth=1866&size=59267&status=done&width=1622.6087292921798)

<a name="ckSXr"></a>
### 配置限流规则


![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1557209273114-ebda2bb0-9062-495c-9a99-1a6e2deafd77.png#align=left&display=inline&height=466&name=image.png&originHeight=536&originWidth=1781&size=40636&status=done&width=1548.69568428155)

给/test接口设置限流

- 阈值类型选择：QPS<br />
- 单机阈值：3<br />

![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1557209339734-3681f141-8b61-4dc7-bf9e-c896705914d6.png#align=left&display=inline&height=448&name=image.png&originHeight=515&originWidth=906&size=24071&status=done&width=787.8261032897722)

可以在流控规则中看到新添加的规则：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1557209509080-4c745e43-5379-411a-8d84-2b4d2192cec9.png#align=left&display=inline&height=472&name=image.png&originHeight=543&originWidth=1670&size=27175&status=done&width=1452.1739431500216)

快速的调用接口三次之后出现如下：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1557209485762-9470d170-56e3-4a2e-85fa-61677543273e.png#align=left&display=inline&height=125&name=image.png&originHeight=144&originWidth=925&size=1981&status=done&width=804.3478427627365)


<a name="ufAKm"></a>
# 示例代码：
GitHub：[https://github.com/wjw0315/cloud-alibaba-demo](https://github.com/wjw0315/cloud-alibaba-demo)

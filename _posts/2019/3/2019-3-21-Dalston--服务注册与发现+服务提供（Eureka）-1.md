---
layout:     post                  
title:      Dalston--服务注册与发现+服务提供（Eureka）-1  
date:       2019-3-21             
author:     JiaweiWu        
header-img: img/post-bg-rwd.jpg  
category: SpringCloud   
catalog: true  
tags:                             
- SpringCloud
- Dalston
---

SpringCloud简介：

> Spring Cloud是一个基于Spring Boot实现的云应用开发工具，它为基于JVM的云应用开发中涉及的配置管理、服务发现、断路器、智能路由、微代理、控制总线、全局锁、决策竞选、分布式会话和集群状态管理等操作提供了一种简单的开发方式。

Eureka:

> Spring Cloud Eureka是Spring Cloud Netflix项目下的服务治理模块。而Spring Cloud Netflix项目是Spring Cloud的子项目之一，主要内容是对Netflix公司一系列开源产品的包装，它为Spring Boot应用提供了自配置的Netflix OSS整合。通过一些简单的注解，开发者就可以快速的在应用中配置一下常用模块并构建庞大的分布式系统。它主要提供的模块包括：服务发现（Eureka），断路器（Hystrix），智能路由（Zuul），客户端负载均衡（Ribbon）等。

以下实例（基于SpringBoot）：

# 创建“服务注册中心”

创建工程eureka-registry-server

`pom.xml`中加入相关的依赖

```
    <dependencies>
    <!--Eurter注册中心-->
		<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-eureka-server</artifactId>
		</dependency>
	</dependencies>
	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>org.springframework.cloud</groupId>
				<artifactId>spring-cloud-dependencies</artifactId>
				<version>Dalston.SR1</version>
				<type>pom</type>
				<scope>import</scope>
			</dependency>
		</dependencies>
	</dependencyManagement>
```
只需要在SpringBoot中使用注解@EnableEurekaServer就能开启服务注册中心。

## 配置
在默认设置下，该服务注册中心也会将自己作为客户端来尝试注册它自己，所以我们需要禁用它的客户端注册行为，只需要在`application.properties`配置文件中增加如下信息：

```
spring.application.name=eureka-registry-server
server.port=1001

eureka.instance.hostname=localhost
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
```

启动访问工程`http://localhost:1001`


# 创建服务提供方

加入相应的pom

```
	<dependencies>
		<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-eureka</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
	</dependencies>

	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>org.springframework.cloud</groupId>
				<artifactId>spring-cloud-dependencies</artifactId>
				<version>Dalston.SR1</version>
				<type>pom</type>
				<scope>import</scope>
			</dependency>
		</dependencies>
	</dependencyManagement>
```


在SpringBoot的启动上增加注解`@EnableEurekaClient`

## 配置

application.properties

```
server.port=2001

spring.application.name=eureka-client


eureka.client.serviceUrl.defaultZone=http://localhost:1001/eureka/

```

通过`spring.application.name`属性，我们可以指定微服务的名称后续在调用的时候只需要使用该名称就可以进行服务的访问。`eureka.client.serviceUrl.defaultZone`属性对应服务注册中心的配置内容，指定服务注册中心的位置。为了在本机上测试区分服务提供方和服务注册中心，使用`server.port`属性设置不同的端口。

启动工程并访问`localhost:1001`就能看到我们注册的客服端。

或者可以在客服端中添加请求接口，注入DiscoveryClient对象后使用其`getServices()`来获取相关的服务清单。

# 源码地址
 **GitHub:**[https://github.com/wjw0315/SpringCloud-Dalston-Demo](https://github.com/wjw0315/SpringCloud-Dalston-Demo)
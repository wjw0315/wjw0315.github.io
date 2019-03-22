---
layout:     post                  
title:      Dalston--分布式配置中心 (Config)-6  
date:       2019-3-21             
author:     JiaweiWu        
header-img: img/post-bg-rwd.jpg  
category: SpringCloud   
catalog: true  
tags:                             
- SpringCloud
- Dalston
---

> 在分布式系统中，spring cloud config 提供一个服务端和客户端去提供可扩展的配置服务。我们可用用配置服务中心区集中的管理所有的服务的各种环境配置文件。配置服务中心采用git的方式存储配置文件，因此我们很容易部署修改，有助于对环境配置进行版本管理。

<a name="6e7d8f18"></a>
### 一、创建config-server-git
* 创建一个SpringBoot的项目：config-server-git
* 添加依赖pom.xml

```
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-config-server</artifactId>
  <version>1.4.0.RELEASE</version>
</dependency>
```
* 在程序的入口Application类加上**@EnableConfigServer**注解开启配置服务器。

```

@EnableConfigServer
@SpringBootApplication
public class ConfigServerGitApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConfigServerGitApplication.class, args);
	}

}
```
* 在application.yml配置文件中添加如下的配置

```
spring:
  application:
    name: config-server
  cloud:
    config:
      server:
        git:
          uri: https://gitee.com/wjw0215/cloud-config-demo/
          search-paths: repo
#          username:
#          password:
server:
  port: 1201
```
* spring.cloud.config.server.git.uri：配置git仓库地址
* spring.cloud.config.server.git.searchPaths：配置仓库路径
* spring.cloud.config.label：配置仓库的分支，默认是master
* spring.cloud.config.server.git.username：访问git仓库的用户名
* spring.cloud.config.server.git.password：访问git仓库的用户密码

在远程仓库[https://gitee.com/wjw0215/cloud-config-demo/](https://gitee.com/wjw0215/cloud-config-demo/)中**master**分支下的repo文件夹中有不同的配置文件<br />
![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1553157447115-c265c5a1-1909-46ec-a748-4ca750c68e65.png#align=left&display=inline&height=235&name=image.png&originHeight=353&originWidth=850&size=39087&status=done&width=567)<br />启动程序：访问[http://localhost:1201/user-test/dev/](http://localhost:1201/user-test/dev/) 

```
{
  "name": "user-test",
  "profiles": [
  	"dev"
  ],
  "label": null,
  "version": "be6bf8681271f45b911d8447f3e0dee244735272",
  "state": null,
  "propertySources": [
    {
    "name": "https://gitee.com/wjw0215/cloud-config-demo/repo/user-test-dev.yml",
    "source": {
    		"info.user": "wwwww"
    	}
    }
  ]
}
```
http请求地址和资源文件映射如下:
* /{application}/{profile}[/{label}]
* /{application}-{profile}.yml
* /{label}/{application}-{profile}.yml
* /{application}-{profile}.properties
* /{label}/{application}-{profile}.properties

上面的url会映射`{application}-{profile}.properties`对应的配置文件，其中`{label}`对应Git上不同的分支，默认为master。我们可以尝试构造不同的url来访问不同的配置内容。
<a name="d3070485"></a>
### 二、创建config-client
* 新建一个SpringBoot的项目为config-clinet
* 引入相关依赖pom.xml

```
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
	<groupId>org.springframework.cloud</groupId>
	<artifactId>spring-cloud-starter-config</artifactId>
	<version>1.4.0.RELEASE</version>
</dependency>
```
* 新建配置文件**bootstrap.yml**

```
spring:
  application:
    name: user-test
  cloud:
    config:
      uri: http://localhost:1201/
      profile: dev
      label: master
server:
  port: 2001
```
* spring.cloud.config.label 指明远程仓库的分支
* spring.cloud.config.profile
  * dev开发环境配置文件
  * test测试环境
  * pro正式环境
* spring.cloud.config.uri= http://localhost:1201/ 指明配置服务中心的网址。


程序的主入口：

```
@SpringBootApplication
@RestController
public class ConfigClinetApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConfigClinetApplication.class, args);
	}

    @Value("${info.user}")
    String info;

    @RequestMapping(value = "/test")
    public String hi(){
        return info;
    }
}

```
打开网址访问：[http://localhost:8881/test/ ]()，会有如下的结果：

```
wwwww
```

### 源码地址
 **GitHub:**[https://github.com/wjw0315/SpringCloud-Dalston-Demo](https://github.com/wjw0315/SpringCloud-Dalston-Demo)
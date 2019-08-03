---
layout:     post                  
title:      Nacos Config(配置中心) 
date:       2019-4-29             
author:     JiaweiWu        
header-img: img/post-bg-rwd.jpg  
category: SpringCloud   
catalog: true  
tags:                             
- SpringCloud
- Alibaba
---

> Nacos 提供用于存储配置和其他元数据的 key/value 存储，为分布式系统中的外部化配置提供服务器端和客户端支持。使用 Spring Cloud Alibaba Nacos Config，您可以在 Nacos Server 集中管理你 Spring Cloud 应用的外部属性配置。

<a name="c182e73c"></a>
# 快速开始

- 启动nacos
- 在nacos注册中心添加配置如下

```java
Data ID:    nacos-config.properties

Group  :    DEFAULT_GROUP

配置格式:    Properties

配置内容：   user.name=nacos-config-properties
            user.age=90
```
![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1553940897243-f2170b16-7619-4ace-97a2-8ba7e761cedc.png#align=left&display=inline&height=525&name=image.png&originHeight=788&originWidth=1780&size=86178&status=done&width=1187)

<a name="3799f6b1"></a>
## 客户端工程使用方式

- 创建新SpringBoot工程： `nacos-config` 
- pom.xml中依赖配置如下

```java
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.0.6.RELEASE</version>
    <relativePath/>
</parent>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>Finchley.SR1</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
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
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>
    <dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
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
```

- 用 bootstrap.properties 配置文件来配置Nacos Server 地址


**[注]：**必须使用bootstrap.properties或者bootstrap.yml 配置文件，因为其优先级高于application的配置文件。    <br />同时，`spring.application.name`值必须与上一阶段Nacos中创建的配置Data Id匹配（除了.properties或者.yaml后缀）

```java
spring.application.name=nacos-config
server.port=8001

spring.cloud.nacos.config.server-addr=127.0.0.1:8848
```


- 创建一个 `TestController.java` 类，实现一个HTTP请求：
```java

@Slf4j
@RestController
@RefreshScope
public class TestController {

   	@Autowired
    private ConfigurableApplicationContext applicationContext;
  
    @Value("${user.name:}")
    private String name;

    @GetMapping("/test")
    public String hello() {
       System.err.println("user name :"+name);
         return  "Hello:"+ applicationContext.getEnvironment().getProperty("user.name");
    }
  }
```
注解`@RefreshScope`，主要用来让这个类下的配置内容支持动态刷新，也就是当我们的应用启动之后，修改了Nacos中的配置内容之后，这里也会马上生效。<br />你可以通过配置 `spring.cloud.nacos.config.refresh.enabled=false` 来关闭动态刷新

- 访问：[http://127.0.0.1:8001/test](http://127.0.0.1:8001/test)

结果如下，可以获取到配置。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1553952661372-943bdad9-f0d0-4f37-9b45-15d5101cdd5d.png#align=left&display=inline&height=107&name=image.png&originHeight=161&originWidth=553&size=7053&status=done&width=369)
<a name="60aeaafa"></a>
## yaml 的文件扩展名配置方式

- 在应用的 bootstrap.properties 配置文件中显示的声明 DateId文件扩展名。如下所示:

```java
spring.application.name=nacos-config
server.port=8001

spring.cloud.nacos.config.server-addr=127.0.0.1:8848
spring.cloud.nacos.config.file-extension=yaml
```

- 在 Nacos 的控制台新增一个DateId为yaml为扩展名的配置


![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1553953026225-63a5773c-453c-42f6-881c-8ad2dded38db.png#align=left&display=inline&height=354&name=image.png&originHeight=531&originWidth=1351&size=43268&status=done&width=901)

- 重启程序测试依旧可以得到结果。
<a name="e3b1ba6f"></a>
## 多环境管理
<a name="77dde033"></a>
### profile粒度的配置
我们在应用启动时，可以通过`spring.profiles.active`来指定具体的环境名称，此时客户端就会把要获取配置的`Data ID`组织为：`${spring.application.name}-${spring.profiles.active}.properties`。

- 例如我们添加一个dev的开发环境的配置
- 我们客户端工程中的 `bootstrap.properties` 配置如下：

```java
spring.application.name=nacos-config
server.port=8001
spring.profiles.active=dev

spring.cloud.nacos.config.server-addr=127.0.0.1:8848
spring.cloud.nacos.config.file-extension=yaml
```

- 我们就要再nacos控制台添加如下即可：


![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1553953707613-06272033-2c89-4d1f-acfe-0728b2d7e2b0.png#align=left&display=inline&height=479&name=image.png&originHeight=718&originWidth=1099&size=52242&status=done&width=733)

> 此例中我们通过 spring.profiles.active= 的方式写死在配置文件中，而在真正的项目实施过程中这个变量的值是需要不同环境而有不同的值。这个时候通常的做法是通过修改tomcat启动脚本，直接修改JAVA_OPTS的-Dspring.profiles.active= 参数指定其配置来达到环境间灵活的切换。
> 

```java
JAVA_OPTS=" -Xms1024m -Xmx1024m  -XX:PermSize=512m -XX:MaxPermSize=512m -Dspring.profiles.active=dev"
```

<a name="54df56d6"></a>
### 自定义 Group 的配置
在没有明确指定 `${spring.cloud.nacos.config.group}` 配置的情况下， 默认使用的是 DEFAULT_GROUP 。如果需要自定义自己的 Group，可以通过以下配置来实现：

```java
spring.cloud.nacos.config.group=DEVELOP_GROUP
```

<a name="0abac8f5"></a>
### 自定义 namespace 的配置
在没有明确指定 `${spring.cloud.nacos.config.namespace}` 配置的情况下， 默认使用的是 Nacos 上 Public 这个namespace。如果需要使用自定义的命名空间，可以通过以下配置来实现：

```java
spring.cloud.nacos.config.namespace=279db73c-8a9d-478b-a075-9ace4100d505
```

![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1553954378418-8c96543d-200d-44ab-a3cc-3f3f17db4f20.png#align=left&display=inline&height=325&name=image.png&originHeight=487&originWidth=1663&size=42018&status=done&width=1109)

**更多的功能请参考官方实例：**<br />[官方文档](https://nacos.io/zh-cn/docs/what-is-nacos.html)
<a name="e0c24127"></a>
# 实例源码
**GitHub:**[https://github.com/wjw0315/cloud-alibaba-demo](https://github.com/wjw0315/cloud-alibaba-demo)

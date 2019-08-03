---
layout:     post                  
title:      Dalston--Hystricx断路器（Ribbon、Fegin）-7  
date:       2019-3-22             
author:     JiaweiWu        
header-img: img/post-bg-rwd.jpg  
category: SpringCloud   
catalog: true  
tags:                             
- SpringCloud
- Dalston
---

> 在微服务架构中，我们将业务拆分成一个个的服务，服务与服务之间可以相互调用（RPC）。为了保证其高可用，单个服务又必须集群部署。由于各种原因，服务并不能保证服务的100%可用，如果单个服务出现问题，调用这个服务就会出现网络延迟，此时若有大量的网络涌入，会形成任务累计，导致服务瘫痪，甚至导致服务“雪崩”。

<a name="3bb3d3ad"></a>
### 前期准备

- 两个工程 `eureka-registry-server` 、`eureka-clinet`

<a name="92b2b77d"></a>
### 一、Ribbon中使用断路器

- 直接改造 `eureka-consumer-ribbon` 工程为 `eureka-consumer-ribbon-hystricx` 
- pom.xml中引入相关依赖

```java
<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-hystrix</artifactId>
			<version>1.3.5.RELEASE</version>
</dependency>
```

- 在程序的入口类加@EnableHystrix

```java
@EnableDiscoveryClient
@EnableHystrix
@SpringBootApplication
public class EurekaConsumerRibbonApplicationHystrix {

	/**
	 * 初始化RestTemplate,使用REST请求
	 * @return
	 */
	@Bean
	@LoadBalanced
	public RestTemplate restTemplate(){
		return new RestTemplate();
	}


	public static void main(String[] args) {
		SpringApplication.run(EurekaConsumerRibbonApplicationHystrix.class, args);
	}

}
```

- 修改 `DcService` 类，在方法上增加 `@HystrixCommand`  并指定 `fallbackMethod` 方法

```java
@Service
public class DcService {
    @Autowired
    RestTemplate restTemplate;

    @HystrixCommand(fallbackMethod = "fallback")
    public String dc(){
        return restTemplate.getForObject("http://eureka-client/client", String.class);
    }

    public String fallback() {
        return "fallback...";
    }

}
```

- 启动三个工程，访问 [http://localhost:2101/consumer](http://localhost:2101/consumer) 会得到接口所提供的数据
- 此时关闭 `eureka-clinet` 工程后再此调用 [http://localhost:2101/consumer](http://localhost:2101/consumer) ，会得到如下的结果

```
fallback...
```

- 此时说明断路器成功
<a name="9b0315f1"></a>
###  二、Feign中使用断路器

工程[eureka-consumer-feign-hystrix](https://github.com/wjw0315/SpringCloud-Dalston-Demo/tree/master/eureka-consumer-feign-hystric)<br />

- feign是自带断路器的
- 在配置文件中添加配置开启断路器

```
# 开启feign.hystrix
feign.hystrix.enabled=true
```

- 在 `DcService` 接口的注解上加上fallback的指定类

```java
@FeignClient(value = "eureka-client",fallback = DcServiceImpl.class)
public interface DcService {

        @GetMapping("/client")
        String consumerDc();
}
```

- `DcServiceImpl.java` 

```java
@Component
public class DcServiceImpl implements DcService {

    @Override
    public String consumerDc() {
        return "feign断路器";
    }
}
```

- 启动三个工程，同样的访问 [http://localhost:2101/consumer](http://localhost:2101/consumer) ，会得到接口提供的结果
- 如果关闭  `eureka-clinet` ，会出现如下的结果

```
feign断路器
```

<br />就说明断路器启动成功。

<a name="c5dda9a6"></a>
### 三、Ribbon-hystrix 仪表盘（Hystrix Dashboard）
<br />

- 直接使用上面的 **`eureka-consumer-ribbon-hystrix`** 进行改造使用
- pom.xml 中引入相关依赖

```java
<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-hystrix-dashboard</artifactId>
			<version>1.3.5.RELEASE</version>
</dependency>
```

- 在主程序入口中加入@EnableHystrixDashboard注解，开启hystrixDashboard

```java
@EnableDiscoveryClient
@EnableHystrix
@EnableHystrixDashboard
@SpringBootApplication
public class EurekaConsumerRibbonApplicationHystrix {
	/**
	 * 初始化RestTemplate,使用REST请求
	 * @return
	 */
	@Bean
	@LoadBalanced
	public RestTemplate restTemplate(){
		return new RestTemplate();
	}

	public static void main(String[] args) {
		SpringApplication.run(EurekaConsumerRibbonApplicationHystrix.class, args);
	}

}
```

- 浏览器中访问：[http://localhost:2101/hystrix](http://localhost:2101/hystrix)
- 填写红框位置的数据，输入监控流http://localhost:2101/hystrix.stream ，Title随便填写，点击 `monitor stream` ，进入下一个界面。


![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1553492981452-6446d9fe-823c-4701-acaa-d50a9d75fbb5.png#align=left&display=inline&height=615&name=image.png&originHeight=923&originWidth=1906&size=303721&status=done&width=1271)

- 请求 [http://localhost:2101/consumer](http://localhost:2101/consumer) 

![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1553494578679-2a006b4c-45a6-4cf1-83f1-986a8d150458.png#align=left&display=inline&height=404&name=image.png&originHeight=606&originWidth=1875&size=101944&status=done&width=1250)
<a name="0a0cf871"></a>
### 四、Feign-Hystrix仪表盘
直接使用上面的 [eureka-consumer-feign-hystric](https://github.com/wjw0315/SpringCloud-Dalston-Demo/tree/master/eureka-consumer-feign-hystric) 进行改造使用

- 只需要在pom.xml中添加依赖

```java
	<!--hystrix仪表盘-->
		<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-hystrix</artifactId>
			<version>1.3.5.RELEASE</version>
		</dependency>
		<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-hystrix-dashboard</artifactId>
			<version>1.3.5.RELEASE</version>
		</dependency>
```

- 给启动类SpringcloudFeignApplication添加两个注解：@EnableHystrixDashboard和@EnableCircuitBreaker，必须是两个。
- 然后即可直接启动
- 浏览器中访问：[http://localhost:2102/hystrix](http://localhost:2102/hystrix)
- 填写红框位置的数据，输入监控流http://localhost:2102/hystrix.stream ，Title随便填写，点击 `monitor stream` ，进入下一个界面。
- 请求 [http://localhost:2102/consumer](http://localhost:2102/consumer) 

<a name="fc4d26a3"></a>
### 五、Hystrix Turbine
看单个的Hystrix Dashboard的数据并没有什么多大的价值，要想看这个系统的Hystrix Dashboard数据就需要用到Hystrix Turbine。Hystrix Turbine将每个服务Hystrix Dashboard数据进行了整合。

- 把工程`eureka-consumer-ribbon-hystrix` 、`eureka-consumer-feign-hystrix`都开启hystrix仪表盘
- 新创建一个SpringBoot项目 `cloud-hystrix-turbine` 
- pom.xml中引入相关依赖

```java
<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-netflix-turbine</artifactId>
			<version>1.4.6.RELEASE</version>
</dependency>
```

- 在主入口添加注解 @EnableTurbine 来启用 Turbine

```java
@SpringBootApplication
@EnableTurbine
public class CloudHystrixTurbineApplication {

	public static void main(String[] args) {
		SpringApplication.run(CloudHystrixTurbineApplication.class, args);
	}
}
```

- 修改配置文件 `application.yml` 

```java
spring:
  application:
    name: cloud-hystrix-turbine

server:
  port: 2103

security.basic.enabled: false

turbine:
  aggregator:
    clusterConfig: default   # 指定聚合哪些集群，多个使用","分割，默认为default。可使用http://.../turbine.stream?cluster={clusterConfig之一}访问
  appConfig: eureka-consumer-ribbon-hystrix,eureka-consumer-feign-hystrix  # 配置Eureka中的serviceId列表，表明监控哪些服务
  clusterNameExpression: new String("default")
  # 1. clusterNameExpression指定集群名称，默认表达式appName；此时：turbine.aggregator.clusterConfig需要配置想要监控的应用名称
  # 2. 当clusterNameExpression: default时，turbine.aggregator.clusterConfig可以不写，因为默认就是default
  # 3. 当clusterNameExpression: metadata['cluster']时，假设想要监控的应用配置了eureka.instance.metadata-map.cluster: ABC，则需要配置，同时turbine.aggregator.clusterConfig: ABC
eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:1001/eureka/
```

- 依次启动服务 `eureka-registry-server` 、`eureka-client` 、`eureka-consumer-ribbon-hystrix` 、`eureka-consumer-feign-hystrix` 、`cloud-hystrix-turbine` 
- 打开浏览器输入：[http://localhost:2103/turbine.stream]()
- 一次做如下的请求

 [http://localhost:2101/consumer](http://localhost:2102/consumer)<br /> [http://localhost:2102/consumer](http://localhost:2101/consumer)

- 打开:[http://localhost:2103/hystrix](http://localhost:2103/hystrix) ，输入监控流http://localhost:2103/turbine.stream ，点击monitor stream 进入页面，可以看到这个页面聚合了2个service的hystrix dashbord数据。

<a name="af47a176"></a>
### 源码地址：
**GitHub:** [https://github.com/wjw0315/SpringCloud-Dalston-Demo](https://github.com/wjw0315/SpringCloud-Dalston-Demo)

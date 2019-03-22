---
layout:     post                  
title:      Dalston--负载均衡工具包（Ribbon）-3  
date:       2019-3-21             
author:     JiaweiWu        
header-img: img/post-bg-rwd.jpg  
category: SpringCloud   
catalog: true  
tags:                             
- SpringCloud
- Dalston
---

> 它是一个基于HTTP和TCP的客户端负载均衡器。它可以通过在客户端中配置ribbonServerList来设置服务端列表去轮询访问以达到均衡负载的作用。

> 当Ribbon与Eureka联合使用时，ribbonServerList会被DiscoveryEnabledNIWSServerList重写，扩展成从Eureka注册中心中获取服务实例列表。同时它也会用NIWSDiscoveryPing来取代IPing，它将职责委托给Eureka来确定服务端是否已经启动。

> 而当Ribbon与Consul联合使用时，ribbonServerList会被ConsulServerList来扩展成从Consul获取服务实例列表。同时由ConsulPing来作为IPing接口的实现。

> 我们在使用Spring Cloud Ribbon的时候，不论是与Eureka还是Consul结合，都会在引入Spring Cloud Eureka或Spring Cloud Consul依赖的时候通过自动化配置来加载上述所说的配置内容，所以我们可以快速在Spring Cloud中实现服务间调用的负载均衡。


------------------------------------
新创建一个工程`eureka-consumer-ribbon`

`pom.xml`中添加依赖

```
<dependencies>
    <dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-eureka</artifactId>
			<version>1.3.1.RELEASE</version>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-actuator</artifactId>
		</dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-ribbon</artifactId>
        <version>1.3.1.RELEASE</version>
    </dependency>
</dependencies>
```

修改应用主类。为`RestTemplate`增加`@LoadBalanced`注解：
```
@EnableDiscoveryClient
@SpringBootApplication
public class EurekaConsumerRibbonApplication {

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
		SpringApplication.run(EurekaConsumerRibbonApplication.class, args);
	}

}

```

修改`Controller`。去掉原来通`LoadBalancerClient`选取实例和拼接URL的步骤，直接通过`RestTemplate`发起请求。

```
@RestController
public class DcController {


    @Autowired
    RestTemplate restTemplate;
    
    @GetMapping("consumer")
    public  String Dc(){
        return  restTemplate.getForObject("http://eureka-client/client",String.class);
    }
}
```

> Spring Cloud Ribbon有一个拦截器，它能够在这里进行实际调用的时候，自动的去选取服务实例，并将实际要请求的IP地址和端口替换这里的服务名，从而完成服务接口的调用。

将eureka-registry-server、eureka-client、eureka-consumer-ribbon都启动起来，然后访问`http://localhost:2101/consumer `


# 源码地址
 **GitHub:**[https://github.com/wjw0315/SpringCloud-Dalston-Demo](https://github.com/wjw0315/SpringCloud-Dalston-Demo)
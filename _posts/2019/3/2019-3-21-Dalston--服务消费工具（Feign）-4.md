---
layout:     post                  
title:      Dalston--服务消费工具（Feign）-4  
date:       2019-3-21             
author:     JiaweiWu        
header-img: img/post-bg-rwd.jpg  
category: SpringCloud   
catalog: true  
tags:                             
- SpringCloud
- Dalston
---

> Spring Cloud Feign是一套基于Netflix Feign实现的声明式服务调用客户端。它使得编写Web服务客户端变得更加简单。我们只需要通过创建接口并用注解来配置它既可完成对Web服务接口的绑定。它具备可插拔的注解支持，包括Feign注解、JAX-RS注解。它也支持可插拔的编码器和解码器。Spring Cloud Feign还扩展了对Spring MVC注解的支持，同时还整合了Ribbon和Eureka来提供均衡负载的HTTP客户端实现。

### 接着之前的实例

依旧使用之前的服务注册工程`eureka-registry-server`以及服务提供方`eureka-client`。

服务消费者使用`eureka-consumer`工程进行改造。

1. 复制工程`eureka-consumer`重命名为`eureka-consumer-feign`并在`pom.xml`增加feign的依赖。

```
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-feign</artifactId>
</dependency>
```

2. 修改主类添加`@EnableFeignClients`注解来启动Feign的功能。

```
@EnableFeignClients
@EnableDiscoveryClient
@SpringBootApplication
public class EurekaConsumerFeignApplication {

	/**
	 * 初始化RestTemplate,使用REST请求
	 * @return
	 */
//	@Bean
//	public RestTemplate restTemplate(){
//		return new RestTemplate();
//	}

	public static void main(String[] args) {
		SpringApplication.run(EurekaConsumerFeignApplication.class, args);
	}

}

```

3. 创建一个Feign的客户端接口定义。使用@FeignClient注解来指定这个接口所要调用的服务名称，接口中定义的各个函数使用Spring MVC的注解就可以来绑定服务提供方的REST接口。

```
@FeignClient("eureka-client")
public interface DcService {

        @GetMapping("/client")
        String consumerDc();
}

```

4. 在controller中使用Feign客户端创建的接口来调用服务提供方的接口。

```
@RestController
public class DcController {

    @Autowired
    DcService dcService;

    @GetMapping("consumer")
    public  String Dc(){
        return  dcService.consumerDc();
    }
}

```
同时启动`eureka-registry-server``eureka-client``eureka-consumer-feign`这三个服务，访问`http://localhost:2101/consumer `就能在页面中看到我们想要的结果。


> Feign是基于Ribbon实现的，所以它自带了客户端负载均衡功能，也可以通过Ribbon的IRule进行策略扩展。另外，Feign还整合的Hystrix来实现服务的容错保护，在Dalston版本中，Feign的Hystrix默认是关闭的。

### 源码地址
 **GitHub:**[https://github.com/wjw0315/SpringCloud-Dalston-Demo](https://github.com/wjw0315/SpringCloud-Dalston-Demo)
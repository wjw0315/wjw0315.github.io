---
layout:     post                  
title:      SpringBoot-RabbitMQ      
date:       2018-10-22             
author:     JiaweiWu        
header-img: img/post-bg-rwd.jpg  
category: springboot   
catalog: true  
tags:                             
- SpringBoot 
---

# SpringBoot集成RabbitMQ

> springboot集成RabbitMQ非常简单，如果只是简单的使用配置非常少，springboot提供了spring-boot-starter-amqp项目对消息各种支持。

##### 简单使用
1、配置pom包，主要是添加spring-boot-starter-amqp的支持
```
<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```
2、配置文件

配置rabbitmq的安装地址、端口以及账户信息
```
spring.application.name=Spring-boot-rabbitmq

spring.rabbitmq.host=134.175.32.678
spring.rabbitmq.port=5672
spring.rabbitmq.username=admin
spring.rabbitmq.password=123456
```
3、队列配置
```
@Configuration
public class RabbitConfig {

    @Bean
    public Queue Queue() {
        return new Queue("hello");
    }

}
```
3、发送者

rabbitTemplate是springboot 提供的默认实现
```
public class HelloSender {

	@Autowired
	private AmqpTemplate rabbitTemplate;

	public void send() {
		String context = "hello " + new Date();
		System.out.println("Sender : " + context);
		this.rabbitTemplate.convertAndSend("hello", context);
	}

}
```
4、接收者
```
@Component
@RabbitListener(queues = "hello")
public class HelloReceiver {

    @RabbitHandler
    public void process(String hello) {
        System.out.println("Receiver  : " + hello);
    }

}
```
5、测试
```
@RunWith(SpringRunner.class)
@SpringBootTest
public class RabbitMqHelloTest {

	@Autowired
	private HelloSender helloSender;

	@Test
	public void hello() throws Exception {
		helloSender.send();
	}

}
```
**注意**，发送者和接收者的`queue name`必须一致，不然不能接收

##### 多对多使用
一个发送者，N个接收者或者N个发送者和N个接收者会出现什么情况？

###### 一对多发送
对上面的代码进行了小改造,接收端注册了两个Receiver,Receiver1和Receiver2，发送端加入参数计数，接收端打印接收到的参数，下面是测试代码，发送一百条消息，来观察两个接收端的执行效果
```
@Test
public void oneToMany() throws Exception {
	for (int i=0;i<100;i++){
		neoSender.send(i);
	}
}
```
结果如下：
```
Receiver 1: Spring boot n queue ****** 11
Receiver 2: Spring boot n queue ****** 12
Receiver 2: Spring boot n queue ****** 14
Receiver 1: Spring boot n queue ****** 13
Receiver 2: Spring boot n queue ****** 15
Receiver 1: Spring boot n queue ****** 16
Receiver 1: Spring boot n queue ****** 18
Receiver 2: Spring boot n queue ****** 17
Receiver 2: Spring boot n queue ****** 19
Receiver 1: Spring boot n queue ****** 20
```
根据返回结果得到以下结论

一个发送者，N个接受者,经过测试会均匀的将消息发送到N个接收者中

###### 多对多发送

复制了一份发送者，加入标记，在一百个循环中相互交替发送
```
@Test
	public void manyToMany() throws Exception {
		for (int i=0;i<100;i++){
			neoSender.send(i);
			neoSender2.send(i);
		}
}
```
结果如下：
```
Receiver 1: Spring boot n queue ****** 20
Receiver 2: Spring boot n queue ****** 20
Receiver 1: Spring boot n queue ****** 21
Receiver 2: Spring boot n queue ****** 21
Receiver 1: Spring boot n queue ****** 22
Receiver 2: Spring boot n queue ****** 22
Receiver 1: Spring boot n queue ****** 23
Receiver 2: Spring boot n queue ****** 23
Receiver 1: Spring boot n queue ****** 24
Receiver 2: Spring boot n queue ****** 24
Receiver 1: Spring boot n queue ****** 25
Receiver 2: Spring boot n queue ****** 25
```
结论：和一对多一样，接收端仍然会均匀接收到消息

##### 高级使用
###### 对象的支持

springboot以及完美的支持对象的发送和接收，不需要格外的配置。
```
//发送者
public void send(User user) {
	System.out.println("Sender object: " + user.toString());
	this.rabbitTemplate.convertAndSend("object", user);
}
```
```
//接收者
@RabbitHandler
public void process(User user) {
    System.out.println("Receiver object : " + user);
}
```
结果如下：
```
Sender object: User{name='n', pass='123456'}
Receiver object : User{name='n', pass='123456'}
```
###### Topic Exchange

> topic 是RabbitMQ中最灵活的一种方式，可以根据routing_key自由的绑定不同的队列

首先对topic规则配置，这里使用两个队列来测试
```
@Configuration
public class TopicRabbitConfig {

    final static String message = "topic.message";
    final static String messages = "topic.messages";

    @Bean
    public Queue queueMessage() {
        return new Queue(TopicRabbitConfig.message);
    }

    @Bean
    public Queue queueMessages() {
        return new Queue(TopicRabbitConfig.messages);
    }

    @Bean
    TopicExchange exchange() {
        return new TopicExchange("exchange");
    }

    @Bean
    Binding bindingExchangeMessage(Queue queueMessage, TopicExchange exchange) {
        return BindingBuilder.bind(queueMessage).to(exchange).with("topic.message");
    }

    @Bean
    Binding bindingExchangeMessages(Queue queueMessages, TopicExchange exchange) {
        return BindingBuilder.bind(queueMessages).to(exchange).with("topic.#");
    }
}
```
使用`queueMessages`同时匹配两个队列，`queueMessage`只匹配”`topic.message`”队列
```
public void send1() {
	String context = "hi, i am message 1";
	System.out.println("Sender : " + context);
	this.rabbitTemplate.convertAndSend("exchange", "topic.message", context);
}
```
```
public void send2() {
	String context = "hi, i am messages 2";
	System.out.println("Sender : " + context);
	this.rabbitTemplate.convertAndSend("exchange", "topic.messages", context);
}
```
发送`send1`会匹配到`topic.#`和`topic.message` 两个Receiver都可以收到消息，发送`send2`只有`topic.#`可以匹配所有只有Receiver2监听到消息

###### Fanout Exchange

> Fanout 就是我们熟悉的广播模式或者订阅模式，给Fanout交换机发送消息，绑定了这个交换机的所有队列都收到这个消息。

Fanout 相关配置
```
@Configuration
public class FanoutRabbitConfig {

    @Bean
    public Queue AMessage() {
        return new Queue("fanout.A");
    }

    @Bean
    public Queue BMessage() {
        return new Queue("fanout.B");
    }

    @Bean
    public Queue CMessage() {
        return new Queue("fanout.C");
    }

    @Bean
    FanoutExchange fanoutExchange() {
        return new FanoutExchange("fanoutExchange");
    }

    @Bean
    Binding bindingExchangeA(Queue AMessage,FanoutExchange fanoutExchange) {
        return BindingBuilder.bind(AMessage).to(fanoutExchange);
    }

    @Bean
    Binding bindingExchangeB(Queue BMessage, FanoutExchange fanoutExchange) {
        return BindingBuilder.bind(BMessage).to(fanoutExchange);
    }

    @Bean
    Binding bindingExchangeC(Queue CMessage, FanoutExchange fanoutExchange) {
        return BindingBuilder.bind(CMessage).to(fanoutExchange);
    }

}
```
这里使用了A、B、C三个队列绑定到Fanout交换机上面，发送端的routing_key写任何字符都会被忽略：
```
public void send() {
		String context = "hi, fanout msg ";
		System.out.println("Sender : " + context);
		this.rabbitTemplate.convertAndSend("fanoutExchange","", context);
}
```
结果如下：
```
Sender : hi, fanout msg 
...
fanout Receiver B: hi, fanout msg 
fanout Receiver A  : hi, fanout msg 
fanout Receiver C: hi, fanout msg 
```
结果说明，绑定到fanout交换机上面的队列都收到了消息



- [RabbitMQ的安装](http://note.youdao.com/noteshare?id=be18795d92a2b84dd3a789b6c863f3ee&sub=5B4A170990A74228B86DD447EC84F11D)
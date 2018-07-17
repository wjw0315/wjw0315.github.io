---
layout: post
title: spring集成mina
subtitle: spring集成mina，包含心跳检测，实现服务端主动推送
date: 2018-4-8
author: wjw
header-img: img/post-bg-rwd.jpg
catalog: true
stickie: true
tags:
- socket
---

## 服务端
### 1.常规的spring工程集成mina时，pom.xml中需要加入如下配置：

```
 <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-jdk14</artifactId>
        <version>1.7.7</version>
    </dependency>
    <dependency>
        <groupId>org.apache.mina</groupId>
        <artifactId>mina-integration-beans</artifactId>
        <version>2.0.13</version>
    </dependency>
    <dependency>
        <groupId>org.apache.mina</groupId>
        <artifactId>mina-core</artifactId>
        <version>2.0.13</version>
        <type>bundle</type>  
        <scope>compile</scope>
    </dependency>
    <dependency>
        <groupId>org.apache.mina</groupId>
        <artifactId>mina-integration-spring</artifactId>
        <version>1.1.7</version>
    </dependency>
```

注意此处mina-core的配置写法。如果工程中引入上述依赖之后报错：Missing artifact xxx bundle，则需要在pom.xml的plugins之间加入如下插件配置：

```
    <plugin>
        <groupId>org.apache.felix</groupId>
        <artifactId>maven-bundle-plugin</artifactId>
        <extensions>true</extensions>
    </plugin>
```

### 2.Filter1：编解码器，实现ProtocolCodecFactory解码工厂

```
package com.he.server;
import java.nio.charset.Charset;
import org.apache.mina.core.session.IoSession;
import org.apache.mina.filter.codec.ProtocolCodecFactory;
import org.apache.mina.filter.codec.ProtocolDecoder;
import org.apache.mina.filter.codec.ProtocolEncoder;
import org.apache.mina.filter.codec.textline.LineDelimiter;
import org.apache.mina.filter.codec.textline.TextLineDecoder;
import org.apache.mina.filter.codec.textline.TextLineEncoder;
public class MyCodeFactory implements ProtocolCodecFactory {
    private final TextLineEncoder encoder;
    private final TextLineDecoder decoder;
    public MyCodeFactory() {
        this(Charset.forName("utf-8"));
    }
    public MyCodeFactory(Charset charset) {
        encoder = new TextLineEncoder(charset, LineDelimiter.UNIX);
        decoder = new TextLineDecoder(charset, LineDelimiter.AUTO);
    }
    public ProtocolDecoder getDecoder(IoSession arg0) throws Exception {
        // TODO Auto-generated method stub
        return decoder;
    }
    public ProtocolEncoder getEncoder(IoSession arg0) throws Exception {
        // TODO Auto-generated method stub
        return encoder;
    }
    public int getEncoderMaxLineLength() {
        return encoder.getMaxLineLength();
    }
    public void setEncoderMaxLineLength(int maxLineLength) {
        encoder.setMaxLineLength(maxLineLength);
    }
    public int getDecoderMaxLineLength() {
        return decoder.getMaxLineLength();
    }
    public void setDecoderMaxLineLength(int maxLineLength) {
        decoder.setMaxLineLength(maxLineLength);
    }
}
```

此处使用了mina自带的TextLineEncoder编解码器，此解码器支持使用固定长度或者固定分隔符来区分上下两条消息。如果要使用自定义协议，则需要自己编写解码器。要使用websocket，也需要重新编写解码器，关于mina结合websocket，jira上有一个开源项目https://issues.apache.org/jira/browse/DIRMINA-907，专门为mina编写了支持websocket的编解码器，亲测可用。。。此部分不是本文重点，略。

### 3.Filter2：心跳工厂，加入心跳检测功能需要实现KeepAliveMessageFactory：

```
package com.he.server;
import org.apache.log4j.Logger;
import org.apache.mina.core.session.IoSession;
import org.apache.mina.filter.keepalive.KeepAliveMessageFactory;
public class MyKeepAliveMessageFactory implements  KeepAliveMessageFactory{

    private final Logger LOG = Logger.getLogger(MyKeepAliveMessageFactory.class);

    /** 心跳包内容 */  
    private static final String HEARTBEATREQUEST = "1111";  
    private static final String HEARTBEATRESPONSE = "1112"; 
    public Object getRequest(IoSession session) {
        LOG.warn("请求预设信息: " + HEARTBEATREQUEST);  
         return HEARTBEATREQUEST;
    }
    public Object getResponse(IoSession session, Object request) {
        LOG.warn("响应预设信息: " + HEARTBEATRESPONSE);  
        /** 返回预设语句 */  
        return HEARTBEATRESPONSE;  
    }
    public boolean isRequest(IoSession session, Object message) {
         LOG.warn("请求心跳包信息: " + message);  
         if (message.equals(HEARTBEATREQUEST))  
             return true;  
         return false;  
    }
    public boolean isResponse(IoSession session, Object message) {
      LOG.warn("响应心跳包信息: " + message);  
      if(message.equals(HEARTBEATRESPONSE))  
          return true;
        return false;
    }
}
```

此处我设置服务端发送的心跳包是1111，客户端应该返回1112.

### 4.实现必不可少的IoHandlerAdapter，得到监听事件处理权：

```
package com.he.server;
import java.net.InetSocketAddress;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.apache.log4j.Logger;
import org.apache.mina.core.service.IoHandlerAdapter;
import org.apache.mina.core.session.IdleStatus;
import org.apache.mina.core.session.IoSession;
public class MyHandler extends IoHandlerAdapter {
    //private final int IDLE = 3000;//(单位s)
    private final Logger LOG = Logger.getLogger(MyHandler.class);
    // public static Set<IoSession> sessions = Collections.synchronizedSet(new HashSet<IoSession>());
    public static ConcurrentHashMap<Long, IoSession> sessionsConcurrentHashMap = new ConcurrentHashMap<Long, IoSession>();
    @Override
    public void exceptionCaught(IoSession session, Throwable cause) throws Exception {
        session.closeOnFlush();
        LOG.warn("session occured exception, so close it." + cause.getMessage());
    }
    @Override
    public void messageReceived(IoSession session, Object message) throws Exception {
        String str = message.toString();
        LOG.warn("客户端" + ((InetSocketAddress) session.getRemoteAddress()).getAddress().getHostAddress() + "连接成功！");
        session.setAttribute("type", message);
        String remoteAddress = ((InetSocketAddress) session.getRemoteAddress()).getAddress().getHostAddress();
        session.setAttribute("ip", remoteAddress);
        LOG.warn("服务器收到的消息是：" + str);
        session.write("welcome by he");
    }
    @Override
    public void messageSent(IoSession session, Object message) throws Exception {
        LOG.warn("messageSent:" + message);
    }
    @Override
    public void sessionCreated(IoSession session) throws Exception {
        LOG.warn("remote client [" + session.getRemoteAddress().toString() + "] connected.");
        // my
        Long time = System.currentTimeMillis();
        session.setAttribute("id", time);
        sessionsConcurrentHashMap.put(time, session);
    }
    @Override
    public void sessionClosed(IoSession session) throws Exception {
        LOG.warn("sessionClosed.");
        session.closeOnFlush();
        // my
        sessionsConcurrentHashMap.remove(session.getAttribute("id"));
    }
    @Override
    public void sessionIdle(IoSession session, IdleStatus status) throws Exception {
        LOG.warn("session idle, so disconnecting......");
        session.closeOnFlush();
        LOG.warn("disconnected.");
    }
    @Override
    public void sessionOpened(IoSession session) throws Exception {
        LOG.warn("sessionOpened.");
        //  
        //session.getConfig().setIdleTime(IdleStatus.BOTH_IDLE, IDLE);
    }
}
```

此处有几点说明： 
**第一点**：网上教程会在此处（sessionOpened（）方法中）设置IDLE，IDLE表示session经过多久判定为空闲的时间，单位s，上述代码中已经注释掉了，因为后面在spring配置中加入心跳检测部分时会进行IDLE的配置，已经不需要在此处进行配置了，而且如果在心跳配置部分和此处都对BOTH_IDLE模式设置了空闲时间，亲测发现此处配置不生效。 
**第二点**：关于存放session的容器，建议使用

```
public static ConcurrentHashMap<Long, IoSession> sessionsConcurrentHashMap = new ConcurrentHashMap<Long, IoSession>();
```

而不是用已经注释掉的Collections.synchronizedSet类型的set或者map，至于原因，java5中新增了ConcurrentMap接口和它的一个实现类ConcurrentHashMap，可以保证线程的足够安全。详细的知识你应该搜索SynchronizedMap和ConcurrentHashMap的区别，学习更加多的并发安全知识。 
上述代码中，每次在收到客户端的消息时，我会返回一段文本：welcome by he。 
有了map，主动推送就不是问题了，想推给谁，在map中找到谁就可以了。

### 5.完成spring的配置工作

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
    <bean class="org.springframework.beans.factory.config.CustomEditorConfigurer">
        <property name="customEditors">
            <map>
                <entry key="java.net.SocketAddress"
                    value="org.apache.mina.integration.beans.InetSocketAddressEditor">
                </entry>
            </map>
        </property>
    </bean>
    <bean id="ioAcceptor" class="org.apache.mina.transport.socket.nio.NioSocketAcceptor"
        init-method="bind" destroy-method="unbind">
        <!--端口号-->
        <property name="defaultLocalAddress" value=":8888" />
        <!--绑定自己实现的handler-->
        <property name="handler" ref="serverHandler" />
        <!--声明过滤器的集合-->
        <property name="filterChainBuilder" ref="filterChainBuilder" />
        <property name="reuseAddress" value="true" />
    </bean>

    <bean id="filterChainBuilder"
        class="org.apache.mina.core.filterchain.DefaultIoFilterChainBuilder">
        <property name="filters">
            <map>
                <!--mina自带的线程池filter-->
                <entry key="executor" value-ref="executorFilter" />
                <entry key="mdcInjectionFilter" value-ref="mdcInjectionFilter" />
                <!--自己实现的编解码器filter-->
                <entry key="codecFilter" value-ref="codecFilter" />
                <!--日志的filter-->
                <entry key="loggingFilter" value-ref="loggingFilter" />
                <!--心跳filter-->
                <entry key="keepAliveFilter" value-ref="keepAliveFilter" />
            </map>
        </property>
    </bean>
 <!-- executorFilter多线程处理 -->  
    <bean id="executorFilter" class="org.apache.mina.filter.executor.ExecutorFilter" />
    <bean id="mdcInjectionFilter" class="org.apache.mina.filter.logging.MdcInjectionFilter">
        <constructor-arg value="remoteAddress" />
    </bean>

    <!--日志-->
    <bean id="loggingFilter" class="org.apache.mina.filter.logging.LoggingFilter" />

    <!--编解码-->
    <bean id="codecFilter" class="org.apache.mina.filter.codec.ProtocolCodecFilter">
        <constructor-arg>
            <!--构造函数的参数传入自己实现的对象-->
            <bean class="com.he.server.MyCodeFactory"></bean>
        </constructor-arg>
    </bean>

    <!--心跳检测filter-->
    <bean id="keepAliveFilter" class="org.apache.mina.filter.keepalive.KeepAliveFilter">
        <!--构造函数的第一个参数传入自己实现的工厂-->
        <constructor-arg>
            <bean class="com.he.server.MyKeepAliveMessageFactory"></bean>
        </constructor-arg>
        <!--第二个参数需要的是IdleStatus对象，value值设置为读写空闲-->
        <constructor-arg type = "org.apache.mina.core.session.IdleStatus" value="BOTH_IDLE" >
       </constructor-arg>
        <!--心跳频率，不设置则默认60s  -->
        <property name="requestInterval" value="5" />
        <!--心跳超时时间，不设置则默认30s    -->
        <property name="requestTimeout" value="10" />
        <!--不设置默认false-->
        <property name="forwardEvent" value="true" />
    </bean>

    <!--自己实现的handler-->
    <bean id="serverHandler" class="com.he.server.MyHandler" />
</beans>
```

好了，xml中已经写了足够多的注释了。说明一下关于心跳检测中的最后一个属性：forwardEvent，默认false，比如在心跳频率为5s时，实际上每5s会触发一次KeepAliveFilter中的session_idle事件，该事件中开始发送心跳包。当此参数设置为false时，对于session_idle事件不再传递给其他filter，如果设置为true，则会传递给其他filter，例如handler中的session_idle事件，此时也会被触发。另外IdleStatus一共有三个值，点击进源码就能看到。

### 6.写main方法启动服务端

```
package com.he.server;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
public class MainTest {
    public static void main(String[] args) {
        ClassPathXmlApplicationContext ct = new ClassPathXmlApplicationContext("applicationContext.xml");
    }
}
```

run之后，端口就已经开始监听了。此处，如果是web工程，使用tomcat之类的容器，只要在web.xml中配置了

```
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>/WEB-INF/classes/applicationContext.xml</param-value>
    </context-param>

    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>
```

则容器在启动时就会加载spring的配置文件，端口的监听就开始了，这样就不需要main方法来启动。

客户端，本文采用两种方式来实现客户端

**方式一**：用mina结构来实现客户端，引入mina相关jar包即可，Android也可以使用

1.先实现IoHandlerAdater得到监听事件，类似于服务端：

```
package com.he.client.minaclient;
import org.apache.log4j.Logger;
import org.apache.mina.core.service.IoHandlerAdapter;
import org.apache.mina.core.session.IdleStatus;
import org.apache.mina.core.session.IoSession;
public class ClientHandler extends IoHandlerAdapter{
    private final Logger LOG = Logger.getLogger(ClientHandler.class);  

    @Override
    public void messageReceived(IoSession session, Object message) throws Exception {
        // TODO Auto-generated method stub
        LOG.warn("客户端收到消息：" + message);
        if (message.toString().equals("1111")) {
            //收到心跳包
            LOG.warn("收到心跳包");
            session.write("1112");
        }
    }

    @Override
    public void messageSent(IoSession session, Object message) throws Exception {
        // TODO Auto-generated method stub
        super.messageSent(session, message);
    }

    @Override
    public void sessionClosed(IoSession session) throws Exception {
        // TODO Auto-generated method stub
        super.sessionClosed(session);
    }

    @Override
    public void sessionCreated(IoSession session) throws Exception {
        // TODO Auto-generated method stub
        super.sessionCreated(session);
    }

    @Override
    public void sessionIdle(IoSession session, IdleStatus status) throws Exception {
        // TODO Auto-generated method stub
        super.sessionIdle(session, status);
    }

    @Override
    public void sessionOpened(IoSession session) throws Exception {
        // TODO Auto-generated method stub
        super.sessionOpened(session);
    }
}
```

2.写main方法启动客户端，连接服务端：

```
package com.he.client.minaclient;
import java.net.InetSocketAddress;
import java.nio.charset.Charset;
import org.apache.mina.core.future.ConnectFuture;
import org.apache.mina.filter.codec.ProtocolCodecFilter;
import org.apache.mina.filter.codec.textline.TextLineCodecFactory;
import org.apache.mina.filter.logging.LoggingFilter;
import org.apache.mina.transport.socket.nio.NioSocketConnector;
public class ClientTest {
    public static void main(String[] args) throws InterruptedException {
        //创建客户端连接器. 
        NioSocketConnector connector = new NioSocketConnector();
        connector.getFilterChain().addLast("logger", new LoggingFilter());
        connector.getFilterChain().addLast("codec",
                new ProtocolCodecFilter(new TextLineCodecFactory(Charset.forName("utf-8")))); //设置编码过滤器 
        connector.setHandler(new ClientHandler());//设置事件处理器 
        ConnectFuture cf = connector.connect(new InetSocketAddress("127.0.0.1", 8888));//建立连接 
        cf.awaitUninterruptibly();//等待连接创建完成 
        cf.getSession().write("hello,测试！");//发送消息，中英文都有 
        //cf.getSession().closeOnFlush();
        //cf.getSession().getCloseFuture().awaitUninterruptibly();//等待连接断开 
        //connector.dispose();
    }
}
```

过程也是一样的，加各种filter，绑定handler。上述代码运行之后向服务器发送了：“hello，测试”，并且收到返回值：welcome by he。然后每隔5s，就会收到服务端的心跳包：1111。在handler的messageReceived中，确认收到心跳包之后返回1112，实现心跳应答。以上过程，每5s重复一次。 
main方法中最后三行注释掉的代码如果打开，客户端在发送完消息之后会主动断开。

**方式二**：客户端不借助于mina，换用java的普通socket来实现，这样就可以换成其他任何语言：

```
package com.he.client;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.Socket;
/**
 *@function：java的简单socket连接，长连接，尝试连续从服务器获取消息
 *@parameter:
 *@return：
 *@author:wjw
 *@notice:
 */
public class SocketTestTwo {
    public static final String IP_ADDR = "127.0.0.1";// 服务器地址
    public static final int PORT = 8888;// 服务器端口号
    static String text = null;
    public static void main(String[] args) throws IOException {
        System.out.println("客户端启动...");
        Socket socket = null;
        socket = new Socket(IP_ADDR, PORT);
        PrintWriter os = new PrintWriter(socket.getOutputStream());
        os.println("al");
        os.println("two");
        os.flush();
        while (true) {
            try {
                // 创建一个流套接字并将其连接到指定主机上的指定端口号
                DataInputStream input = new DataInputStream(socket.getInputStream());
                // 读取服务器端数据
                byte[] buffer;
                buffer = new byte[input.available()];
                if (buffer.length != 0) {
                    System.out.println("length=" + buffer.length);
                    // 读取缓冲区
                    input.read(buffer);
                    // 转换字符串
                    String three = new String(buffer);
                    System.out.println("内容=" + three);
                    if (three.equals("1111\n")) {
                        System.out.println("发送返回心跳包");
                        os = new PrintWriter(socket.getOutputStream());
                        os.println("1112");
                        os.flush();
                    }
                }
            } catch (Exception e) {
                System.out.println("客户端异常:" + e.getMessage());
                os.close();
            }
        }
    }
}
```

以上代码运行效果和前一种方式完全一样。 
但是注意此种方法和使用mina结构的客户端中有一处不同：对于心跳包的判断。本教程中服务端选用了mina自带的编解码器，通过换行符来区分上下两条消息，也就是每一条消息后面会带上一个换行符，所以在使用java普通的socket来连接时，判断心跳包不再是判断是否为“1111”，而是“1111\n”。对比mina结构的客户端中并不需要加上换行符是因为客户端中绑定了相同的编解码器。

工程应该配置有如下log4j的配置文件才能看到一样的打印结

```
log4j.rootLogger=WARN,stdout

log4j.appender.stdout = org.apache.log4j.ConsoleAppender
log4j.appender.stdout.layout = org.apache.log4j.PatternLayout
log4j.appender.stdout.Threshold=WARN
log4j.appender.stdout.layout.ConversionPattern = [%-5p] [%d{yyyy-MM-dd HH\:mm\:ss,SSS}] [%x]
```

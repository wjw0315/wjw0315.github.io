---
layout:     post                  
title:      SpringBoot--Netty的配置使用   
date:       2019-07-22             
author:     JiaweiWu        
header-img: img/post-bg-rwd.jpg  
category: springboot   
catalog: true  
tags:                             
- SpringBoot 
---

> Netty封装了JDK的NIO，让你用得更爽，你不用再写一大堆复杂的代码了。
> <br />Netty是一个异步事件驱动的网络应用框架，用于快速开发可维护的高性能服务器和客户端。
> <br /> 有了Netty，你可以实现自己的HTTP服务器，FTP服务器，UDP服务器，RPC服务器，WebSocket服务器，Redis的Proxy服务器，MySQL的Proxy服务器等等。  

在讲Netty之前我们先引入一个概念：NIO
<a name="iNa6L"></a>
# NIO
说NIO之前先说一下BIO（Blocking IO）,如何理解这个Blocking呢？

  1. 客户端监听（Listen）时，Accept是阻塞的，只有新连接来了，Accept才会返回，主线程才能继
  1. 读写socket时，Read是阻塞的，只有请求消息来了，Read才能返回，子线程才能继续处理
  1. 读写socket时，Write是阻塞的，只有客户端把消息收了，Write才能返回，子线程才能继续读取下一个请求

传统的BIO模式下，从头到尾的所有线程都是阻塞的，这些线程就干等着，占用系统的资源，什么事也不干。<br />那么NIO是怎么做到非阻塞的呢。它用的是事件机制。它可以用一个线程把Accept，读写操作，请求处理的逻辑全干了。如果什么事都没得做，它也不会死循环，它会将线程休眠起来，直到下一个事件来了再继续干活，这样的一个线程称之为NIO线程
<a name="xxv83"></a>
# Netty 内部流程
![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1563680575667-9dffee3a-a174-4327-b0c0-8718f69d881c.png#align=left&display=inline&height=586&name=image.png&originHeight=1172&originWidth=1984&size=771423&status=done&width=992)
<a name="h4KfO"></a>
# Netty在Spring Boot的简单实例
现在就使用一个简单的场景进行举例：服务端监控客户端是否在线。
<a name="a2fEj"></a>
## 服务端

- 引入netty的包依赖：

```yaml
<dependency>
  <groupId>io.netty</groupId>
  <artifactId>netty-all</artifactId>
  <version>5.0.0.Alpha1</version>
</dependency>
```

- 开启一个服务端：NettyServer.java

```yaml
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

/**
 * @author JiaweiWu
 */

@Component
public class NettyServer {

    private static final Logger LOGGER = LoggerFactory.getLogger(NettyServer.class);

    @Value("${netty.server.port}")
    public Integer port;


    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    private void startServer(){
        //服务端需要2个线程组  boss处理客户端连接  work进行客服端连接之后的处理
        EventLoopGroup boss = new NioEventLoopGroup();
        EventLoopGroup work = new NioEventLoopGroup();
        try {
            ServerBootstrap bootstrap = new ServerBootstrap();
            //服务器 配置
//            bootstrap.group(boss,work).channel(NioServerSocketChannel.class)
//                    .childHandler(new ChannelInitializer<SocketChannel>() {
//                        protected void initChannel(SocketChannel socketChannel) throws Exception {
//                            // HttpServerCodec：将请求和应答消息解码为HTTP消息
//                            socketChannel.pipeline().addLast("http-codec",new HttpServerCodec());
//                            // HttpObjectAggregator：将HTTP消息的多个部分合成一条完整的HTTP消息
//                            socketChannel.pipeline().addLast("aggregator",new HttpObjectAggregator(65536));
//                            // ChunkedWriteHandler：向客户端发送HTML5文件
//                            socketChannel.pipeline().addLast("http-chunked",new ChunkedWriteHandler());
//                            // 进行设置心跳检测
//                            socketChannel.pipeline().addLast(new IdleStateHandler(60,30,60*30, TimeUnit.SECONDS));
//                            // 配置通道处理  来进行业务处理
//                            socketChannel.pipeline().addLast(new MyChannelHandler());
//                        }
//                    }).option(ChannelOption.SO_BACKLOG,1024).childOption(ChannelOption.SO_KEEPALIVE,true);
            //服务器 配置
            bootstrap.group(boss,work).channel(NioServerSocketChannel.class)
                    .childHandler(new MyChatServerInializer()).option(ChannelOption.SO_BACKLOG,1024).childOption(ChannelOption.SO_KEEPALIVE,true);
            //绑定端口  开启事件驱动
            LOGGER.info("【服务器启动成功========端口："+port+"】");
            Channel channel = bootstrap.bind(port).sync().channel();
            channel.closeFuture().sync();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            //关闭资源
            boss.shutdownGracefully();
            work.shutdownGracefully();
        }
    }

    @PostConstruct()
    public void init(){
        //需要开启一个新的线程来执行netty server 服务器
        new Thread(new Runnable() {
            public void run() {
                startServer();
            }
        }).start();
    }

}
```
上面使用到两个配置：一个在配置文件application.properties中的配置，一个服务端的初始化配置MyChatServerInializer.java

- application.properties

```yaml
# netty 配置
# 端口
netty.server.port=9001
```

- MyChatServerInializer.java

```yaml
import com.jmk.frame.device.server.netty.handler.MyChannelHandler;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.stream.ChunkedWriteHandler;
import io.netty.handler.timeout.IdleStateHandler;

import java.util.concurrent.TimeUnit;

/**
 * @author JiaweiWu
 */
public class MyChatServerInializer extends ChannelInitializer<SocketChannel> {

    @Override
    protected void initChannel(SocketChannel ch) throws Exception {
        ChannelPipeline pipeline = ch.pipeline();

        //分割接收到的Bytebu，根据指定的分割符为换行
//        pipeline.addLast(new DelimiterBasedFrameDecoder(10240, Delimiters.lineDelimiter()));
//        pipeline.addLast(new StringDecoder(CharsetUtil.UTF_8));
//        pipeline.addLast(new StringEncoder(CharsetUtil.UTF_8));
        // HttpServerCodec：将请求和应答消息解码为HTTP消息
        pipeline.addLast("http-codec",new HttpServerCodec());
        // HttpObjectAggregator：将HTTP消息的多个部分合成一条完整的HTTP消息
        pipeline.addLast("aggregator",new HttpObjectAggregator(65536));
        // ChunkedWriteHandler：向客户端发送HTML5文件
        pipeline.addLast("http-chunked",new ChunkedWriteHandler());
        // 进行设置心跳检测
        pipeline.addLast(new IdleStateHandler(80,70,60*30, TimeUnit.SECONDS));
        // 配置通道处理  来进行业务处理
        pipeline.addLast(new MyChannelHandler());
    }
}
```

- 创建MyChannelHandler.java，对消息信号进行监测

```yaml
import cn.hutool.json.JSONObject;
import com.jmk.frame.common.constant.ConstantInterface;
import com.jmk.frame.device.common.netty.utils.GlobalUserUtil;
import com.jmk.frame.device.server.biz.DeviceBiz;
import com.jmk.frame.device.server.netty.entity.DeviceChannel;
import com.jmk.frame.device.server.netty.manager.DeviceChannelManager;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.*;
import io.netty.handler.codec.http.*;
import io.netty.handler.codec.http.websocketx.*;
import io.netty.handler.timeout.IdleStateEvent;
import io.netty.util.AttributeKey;
import io.netty.util.CharsetUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.List;

/**
 * @author JiaweiWu
 */
@Component
public class MyChannelHandler extends SimpleChannelInboundHandler<Object> {

    private static final Logger LOGGER = LoggerFactory.getLogger(MyChannelHandler.class);

    private static final String URI = "websocket";

    private WebSocketServerHandshaker handshaker ;

    private static MyChannelHandler myChannelHandler;

    @Autowired
    DeviceBiz deviceBiz;

    @PostConstruct
    public void init(){
        myChannelHandler = this;
    }


    /**
     * 连接上服务器
     * @param ctx
     * @throws Exception
     */
    @Override
    public void handlerAdded(ChannelHandlerContext ctx) throws Exception {
        LOGGER.info("【handlerAdded】====>"+ctx.channel().id());
        GlobalUserUtil.channels.add(ctx.channel());
    }

    /**
     * 断开连接
     * @param ctx
     * @throws Exception
     */
    @Override
    public void handlerRemoved(ChannelHandlerContext ctx) throws Exception {
        LOGGER.info("【handlerRemoved】====>"+ctx.channel().id());
        GlobalUserUtil.channels.remove(ctx);
       //修改设备的在线状态
        DeviceChannel deviceChannel =  DeviceChannelManager.getByChannelId(ctx.channel().id().asLongText());
        if (deviceChannel != null) {
            List<DeviceChannel> deviceChannels = DeviceChannelManager.getByImei(deviceChannel.getImei());
            LOGGER.info("flow==deviceChannelList:"+ new JSONObject(deviceChannels)+"-----size:"+deviceChannels.size());
            if (deviceChannels.size() < 2) {
                if (StringUtils.isNotBlank(deviceChannel.getImei())) {
                    myChannelHandler.deviceBiz.changeDeviceStatus(deviceChannel.getImei(), ConstantInterface.ONLINE_STATUS.NOT_ONLINE);
                }
            }
            DeviceChannelManager.remove(deviceChannel);
        }

    }

    /**
     * 连接异常   需要关闭相关资源
     * @param ctx
     * @param cause
     * @throws Exception
     */
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        LOGGER.error("【系统异常】======>"+cause.toString());
        ctx.close();
        ctx.channel().close();
    }

    /**
     * 活跃的通道  也可以当作用户连接上客户端进行使用
     * @param ctx
     * @throws Exception
     */
    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        LOGGER.info("【channelActive】=====>"+ctx.channel());
    }

    /**
     * 不活跃的通道  就说明用户失去连接
     * @param ctx
     * @throws Exception
     */
    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        LOGGER.info("【channelInactive】=====>"+ctx.channel());
    }

    /**
     * 这里只要完成 flush
     * @param ctx
     * @throws Exception
     */
    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) throws Exception {
        ctx.flush();
    }

    /**
     * 这里是保持服务器与客户端长连接  进行心跳检测 避免连接断开
     * @param ctx
     * @param evt
     * @throws Exception
     */
    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        if(evt instanceof IdleStateEvent){
            IdleStateEvent stateEvent = (IdleStateEvent) evt;
            PingWebSocketFrame ping = new PingWebSocketFrame();
            switch (stateEvent.state()){
                //读空闲（服务器端）
                case READER_IDLE:
                    LOGGER.info("【"+ctx.channel().remoteAddress()+"】读空闲（服务器端）");
                    ctx.writeAndFlush(ping);
                    break;
                //写空闲（客户端）
                case WRITER_IDLE:
                    LOGGER.info("【"+ctx.channel().remoteAddress()+"】写空闲（客户端）");
                    ctx.writeAndFlush(ping);
                    //不活跃客户端直接切断连接
                    ctx.close();
                    break;
                case ALL_IDLE:
                    LOGGER.info("【"+ctx.channel().remoteAddress()+"】读写空闲");
                    break;
            }
        }
    }

    /**
     * 收发消息处理
     * @param ctx
     * @param msg
     * @throws Exception
     */
    protected void messageReceived(ChannelHandlerContext ctx, Object msg) throws Exception {
        if(msg instanceof HttpRequest){//处理http握手请求
            doHandlerHttpRequest(ctx,(HttpRequest) msg);
        }else if(msg instanceof WebSocketFrame){//websocket请求
            doHandlerWebSocketFrame(ctx,(WebSocketFrame) msg);
        }
    }

    /**
     * websocket消息处理
     * @param ctx
     * @param msg
     */
    private void doHandlerWebSocketFrame(ChannelHandlerContext ctx, WebSocketFrame msg) {
        //判断msg 是哪一种类型  分别做出不同的反应
        if(msg instanceof CloseWebSocketFrame){
//            LOGGER.info("【关闭】");
            handshaker.close(ctx.channel(), (CloseWebSocketFrame) msg);
            return ;
        }
        if(msg instanceof PingWebSocketFrame){
//            LOGGER.info("【ping】");
            PongWebSocketFrame pong = new PongWebSocketFrame(msg.content().retain());
            ctx.channel().writeAndFlush(pong);
            return ;
        }
        if(msg instanceof PongWebSocketFrame){
//            LOGGER.info("【pong】");
//            PingWebSocketFrame ping = new PingWebSocketFrame(msg.content().retain());
//            ctx.channel().writeAndFlush(ping);
            return ;
        }
        if(!(msg instanceof TextWebSocketFrame)){
//            LOGGER.info("【不支持二进制】");
            throw new UnsupportedOperationException("不支持二进制");
        }
        //可以对消息进行处理
        //处理设备的在线状态
        try{
            String imei = ((TextWebSocketFrame) msg).text();
//            if (StringUtils.isNotBlank(imei)){
//                BaseContextHandler.set(ctx.channel().id().asLongText(),imei);
//            }
            if (StringUtils.isNotBlank(imei)){
                myChannelHandler.deviceBiz.changeDeviceStatus(imei, ConstantInterface.ONLINE_STATUS.ONLINE);
                DeviceChannel deviceChannel = new DeviceChannel();
                deviceChannel.setChannelId(ctx.channel().id().asLongText());
                deviceChannel.setImei(imei);
                DeviceChannelManager.add(deviceChannel);
                ctx.writeAndFlush(new TextWebSocketFrame(((TextWebSocketFrame) msg).text()));
            }
        }catch (Exception e){
            System.out.println("flow==change device status error:"+e);
        }

        //群发
//        for (Channel channel : GlobalUserUtil.channels) {
//            LOGGER.info("flow==msg:"+ ((TextWebSocketFrame) msg).text());
//            channel.writeAndFlush(new TextWebSocketFrame(((TextWebSocketFrame) msg).text()));
//        }

    }


    /**
     * wetsocket第一次连接握手
     * @param ctx
     * @param msg
     */
    private void doHandlerHttpRequest(ChannelHandlerContext ctx, HttpRequest msg) {
        // http 解码失败
        if(!msg.getDecoderResult().isSuccess() || (!"websocket".equals(msg.headers().get("Upgrade")))){
            sendHttpResponse(ctx, (FullHttpRequest) msg,new DefaultFullHttpResponse(HttpVersion.HTTP_1_1,HttpResponseStatus.BAD_REQUEST));
        }
        //可以获取msg的uri来判断
        String uri = msg.getUri();
        if(!uri.substring(1).equals(URI)){
            ctx.close();
        }
        ctx.attr(AttributeKey.valueOf("type")).set(uri);
        //可以通过url获取其他参数
        WebSocketServerHandshakerFactory factory = new WebSocketServerHandshakerFactory(
                "ws://"+msg.headers().get("Host")+"/"+URI+"",null,false
        );
        handshaker = factory.newHandshaker(msg);
        if(handshaker == null){
            WebSocketServerHandshakerFactory.sendUnsupportedWebSocketVersionResponse(ctx.channel());
        }
        //进行连接
        handshaker.handshake(ctx.channel(), (FullHttpRequest) msg);
        //可以做其他处理
    }

    private static void sendHttpResponse(ChannelHandlerContext ctx, FullHttpRequest req, DefaultFullHttpResponse res) {
        // 返回应答给客户端
        if (res.getStatus().code() != 200) {
            ByteBuf buf = Unpooled.copiedBuffer(res.getStatus().toString(), CharsetUtil.UTF_8);
            res.content().writeBytes(buf);
            buf.release();
        }
        // 如果是非Keep-Alive，关闭连接
        ChannelFuture f = ctx.channel().writeAndFlush(res);
        if (!HttpHeaders.isKeepAlive(req) || res.getStatus().code() != 200) {
            f.addListener(ChannelFutureListener.CLOSE);
        }
    }
}
```
上方用到了一个CopyOnWriteArrayList 对设备的数据进行共享<br />DeviceChannelManager.java

```yaml
import com.jmk.frame.device.common.utils.StringUtils;
import com.jmk.frame.device.server.netty.entity.DeviceChannel;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class DeviceChannelManager {

    private static  List<DeviceChannel> deviceChannelList = new CopyOnWriteArrayList<>();

    public static List<DeviceChannel> get(){
        return deviceChannelList;
    }
    public static DeviceChannel getByChannelId(String channelId){
        if (StringUtils.isNotBlank(channelId)){
            for (int i = 0; i<deviceChannelList.size();i++){
                if (deviceChannelList.get(i).getChannelId().equals(channelId)){
                    return deviceChannelList.get(i);
                }
            }
        }
        return null;
    }
    public static List<DeviceChannel> getByImei(String imei){
        if (StringUtils.isNotBlank(imei)){
            List<DeviceChannel> deviceChannels = new ArrayList<>();
            for (int i = 0; i<deviceChannelList.size();i++){
                if (deviceChannelList.get(i).getImei().equals(imei)){
                    deviceChannels.add(deviceChannelList.get(i));
                }
            }
            return deviceChannels;
        }
        return null;
    }

    public static boolean add(DeviceChannel deviceChannel){
        return deviceChannelList.add(deviceChannel);
    }

    public static  void remove(DeviceChannel deviceChannel){
        if (deviceChannel != null){
            remove(deviceChannel.getChannelId());
        }
    }

    public static void remove(String deviceChannelId){
        if (StringUtils.isNotBlank(deviceChannelId)){
            deviceChannelList.forEach(e->{
                if (deviceChannelId.equals(e.getChannelId())){
                    deviceChannelList.remove(e);
                }
            });
        }

    }
}

```
在MyChannelHandler中我们直接通过@Autowired自动注入的接口是无法直接使用的，我们需要要到另外的一个注解@PostConstruct<br />关于这个注解可以看此篇文章：[https://www.yuque.com/wjwcloud/note/mvmfnx](https://www.yuque.com/wjwcloud/note/mvmfnx)

- 此处我们先在MyChannelHandler上加上注解
- 定义MyChannelHandler： private static MyChannelHandler _myChannelHandler_
- 使用@PostConstruct对MyChannelHandler进行初始化
- 并使用@Autowired进行注入接口

```yaml
@PostConstruct	
public void init(){
	myChannelHandler = this;
}
```
调用接口时，我们需要如此使用（changeDeviceStatus为注入的接口中方法）：myChannelHandler.deviceBiz.changeDeviceStatus（）
<a name="WMwhP"></a>
## 客户端
客户端我们使用react-native官方提供的连接webSocket的方式进行举例：

```yaml
//建立websocket连接
        ws = new WebSocket(CONFIG.WEB_SOCKET.wsUrl);
        ws.onopen = () => {
          // 打开一个连接
          // let imei = DeviceInfo.
          console.log("flow==ws.imei:"+imei)
          ws.send(imei); // 发送一个消息
        };
        ws.onmessage = (e) => {
          // 接收到了一个消息
          console.log("flow==webSocket msg"+e.data);
          //心跳监测
          heartBeat.reset(ws)
        };
        ws.onerror = (e) => {
          // 发生了一个错误
          console.log("flow==webSocket error"+e.message);
        };
        ws.onclose = (e) => {
          // 连接被关闭了
          // console.log("flow==webSocket close"+e.code, e.reason);
          console.log("flow==webSocket close");
        };
```

- 心跳监测 **HeartBeat.js**

```yaml
export const heartBeat = {
    timeout: 60000, // 60s
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function (ws) {
        clearTimeout(this.timeoutObj)
        clearTimeout(this.serverTimeoutObj)
        this.start(ws)
    },
    start: function (ws) {
      if (ws) {
        // console.log('flow==start:'+ws)
        var self = this
        this.timeoutObj && clearTimeout(this.timeoutObj)
        this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
        this.timeoutObj = setTimeout(function () {
          // 这里发送一个心跳，后端收到后，返回一个心跳消息，
          // onmessage拿到返回的心跳就说明连接正常
          var message = {
            'data': {
              'type': '95001', // 事件类型编码
              'info': '{}', // 消息主体内容,业务组件自定义,可为空字符串或JSON字符串
              'time': new Date().getTime(), // 时间
              'deviceId': '', // 设备编码
              'traceId': '', // 染色ID
              'spanId': '0', // 日志ID
              'terminalID': '' // 前端页面的终端编码（唯一），可为空串
            }
          }
          console.log('flow==start send:' + JSON.stringify(message))
          ws.send(JSON.stringify(message))//数据格式这里默认是字符串，是字符串还是JSON格式看你们的后台开发而定
          //服务端失联断开，（暂未处理）
          self.serverTimeoutObj = setTimeout(function () {
            ws.onclose()
          }, self.timeout)

        }, this.timeout)
      }
    }
}
```

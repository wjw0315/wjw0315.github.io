---
layout:     post                  
title:      Java Socket      
subtitle:   Java_Socket         
date:       2018-7-21             
author:     Mr.W                   
header-img: img/post-bg-rwd.jpg  
keywords_post:  "Java Socket"
catalog: true                          
tags:                             
- Java Socket 
---


# 一、TCP编程

## 1、

TCP协议是面向连接的、可靠的、有序的、以字节流的方式发送数据，通过三次握手方式建立连接，形成传输数据的通道，在连接中进行大量数据的传输，效率会稍低

##  2、

&nbsp; &nbsp; &nbsp; Java中基于TCP协议实现网络通信的类

&nbsp; &nbsp; &nbsp;  客户端的Socket类

  &nbsp; &nbsp; &nbsp; 服务器端的ServerSocket类
  
  ![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018-7-21-Socket/1.png)
  
##   3、Socket通信的步骤

     ① 创建ServerSocket和Socket

     ② 打开连接到Socket的输入/输出流

     ③ 按照协议对Socket进行读/写操作

     ④ 关闭输入输出流、关闭Socket

##  4、服务器端：

     ① 创建ServerSocket对象，绑定监听端口

     ② 通过accept()方法监听客户端请求

     ③ 连接建立后，通过输入流读取客户端发送的请求信息

     ④ 通过输出流向客户端发送乡音信息

     ⑤ 关闭相关资源
     

```
 /** 
  * 基于TCP协议的Socket通信，实现用户登录，服务端 
  */ 
 //1、创建一个服务器端Socket，即ServerSocket，指定绑定的端口，并监听此端口 
 ServerSocket serverSocket =newServerSocket(10000);//1024-65535的某个端口 
 //2、调用accept()方法开始监听，等待客户端的连接 
 Socket socket = serverSocket.accept(); 
 //3、获取输入流，并读取客户端信息 
 InputStream is = socket.getInputStream();
 InputStreamReader isr =newInputStreamReader(is);
 BufferedReader br =newBufferedReader(isr);
 String info =null
 while((info=br.readLine())!=null){
 System.out.println("我是服务器，客户端说："+info)；
 }
 socket.shutdownInput();//关闭输入流
 //4、获取输出流，响应客户端的请求
 OutputStream os = socket.getOutputStream();
 PrintWriter pw = new PrintWriter(os);
 pw.write("欢迎您！");
 pw.flush();
 
 
 //5、关闭资源
 pw.close();
 os.close();
 br.close();
 isr.close();
 is.close();
 socket.close();
 serverSocket.close();
```

## 5、客户端：

     ① 创建Socket对象，指明需要连接的服务器的地址和端口号
    
     ② 连接建立后，通过输出流想服务器端发送请求信息
    
     ③ 通过输入流获取服务器响应的信息
    
     ④ 关闭响应资源 
     
     
```
  //客户端
  //1、创建客户端Socket，指定服务器地址和端口
  Socket socket =newSocket("localhost",10086); 
  //2、获取输出流，向服务器端发送信息
  OutputStream os = socket.getOutputStream();//字节输出流
  PrintWriter pw =newPrintWriter(os);//将输出流包装成打印流
  pw.write("用户名：admin；密码：123"); 
  pw.flush(); 
  socket.shutdownOutput();
  //3、获取输入流，并读取服务器端的响应信息
  InputStream is = socket.getInputStream();
  BufferedReader br = new BufferedReader(new InputStreamReader(is));
  String info = null;
  while((info=br.readLine())!null){
   System.out.println("我是客户端，服务器说："+info);
  }
  
  //4、关闭资源
  br.close();
  is.close();
  pw.close();
  os.close();
  socket.close();
 ```
 
##   6、应用多线程实现服务器与多客户端之间的通信

       ① 服务器端创建ServerSocket，循环调用accept()等待客户端连接
    
       ② 客户端创建一个socket并请求和服务器端连接
    
       ③ 服务器端接受苦读段请求，创建socket与该客户建立专线连接
    
       ④ 建立连接的两个socket在一个单独的线程上对话
    
       ⑤ 服务器端继续等待新的连接        
       
       
```
 //服务器线程处理
  //和本线程相关的socket
  Socket socket =null; 
  //
  public serverThread(Socket socket){ 
 this.socket = socket; 
  } 
  
  publicvoid run(){
  //服务器处理代码
  }
  
  //============================================
  //服务器代码
  ServerSocket serverSocket =newServerSocket(10000);
  Socket socket =null;
  int count =0;//记录客户端的数量
  while(true){
  socket = serverScoket.accept();
  ServerThread serverThread =newServerThread(socket);
   serverThread.start();
   count++;
  System.out.println("客户端连接的数量："+count);
  }
 ```
 
#  二、UDP编程
 
> UDP协议（用户数据报协议）是无连接的、不可靠的、无序的,速度快

> 进行数据传输时，首先将要传输的数据定义成数据报（Datagram），大小限制在64k，在数据报中指明数据索要达到的Socket（主机地址和端口号），然后再将数据报发送出去

DatagramPacket类:表示数据报包

 DatagramSocket类：进行端到端通信的类

## 1、服务器端实现步骤

    ① 创建DatagramSocket，指定端口号
    
    ② 创建DatagramPacket
    
    ③ 接受客户端发送的数据信息
    
    ④ 读取数据
    
    
```
 //服务器端，实现基于UDP的用户登录
  //1、创建服务器端DatagramSocket，指定端口
  DatagramSocket socket =new datagramSocket(10010); 
  //2、创建数据报，用于接受客户端发送的数据
  byte[] data =newbyte[1024];//
  DatagramPacket packet =newDatagramPacket(data,data.length); 
  //3、接受客户端发送的数据 
  socket.receive(packet);//此方法在接受数据报之前会一致阻塞 
  //4、读取数据
  String info =newString(data,o,data.length);
  System.out.println("我是服务器，客户端告诉我"+info);
  
  
  //=========================================================
  //向客户端响应数据
  //1、定义客户端的地址、端口号、数据
  InetAddress address = packet.getAddress();
  int port = packet.getPort();
  byte[] data2 = "欢迎您！".geyBytes();
  //2、创建数据报，包含响应的数据信息
  DatagramPacket packet2 = new DatagramPacket(data2,data2.length,address,port);
  //3、响应客户端
  socket.send(packet2);
  //4、关闭资源
  socket.close();
 ```
 
## 2、客户端实现步骤

       ① 定义发送信息
    
       ② 创建DatagramPacket，包含将要发送的信息
    
       ③ 创建DatagramSocket
    
       ④ 发送数据
       
       
```
 //客户端
  //1、定义服务器的地址、端口号、数据
  InetAddress address =InetAddress.getByName("localhost"); 
  int port =10010; 
  byte[] data ="用户名：admin;密码：123".getBytes(); 
  //2、创建数据报，包含发送的数据信息
  DatagramPacket packet = newDatagramPacket(data,data,length,address,port); 
  //3、创建DatagramSocket对象
  DatagramSocket socket =newDatagramSocket();
  //4、向服务器发送数据
  socket.send(packet);
  
  
  //接受服务器端响应数据
  //======================================
  //1、创建数据报，用于接受服务器端响应数据
  byte[] data2 = new byte[1024];
  DatagramPacket packet2 = new DatagramPacket(data2,data2.length);
  //2、接受服务器响应的数据
  socket.receive(packet2);
  String raply = new String(data2,0,packet2.getLenth());
  System.out.println("我是客户端，服务器说："+reply);
  //4、关闭资源
  socket.close();
```

## **注意：**

1、多线程的优先级问题：

    根据实际的经验，适当的降低优先级，否侧可能会有程序运行效率低的情况

2、是否关闭输出流和输入流：

     对于同一个socket，如果关闭了输出流，则与该输出流关联的socket也会被关闭，所以一般不用关闭流，直接关闭socket即可

3、使用TCP通信传输对象，IO中序列化部分

4、socket编程传递文件，IO流部分

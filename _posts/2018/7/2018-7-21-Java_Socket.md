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


# һ��TCP���

  1��TCPЭ�����������ӵġ��ɿ��ġ�����ġ����ֽ����ķ�ʽ�������ݣ�ͨ���������ַ�ʽ�������ӣ��γɴ������ݵ�ͨ�����������н��д������ݵĴ��䣬Ч�ʻ��Ե�

  2��Java�л���TCPЭ��ʵ������ͨ�ŵ���

&nbsp; &nbsp; &nbsp;  �ͻ��˵�Socket��

  &nbsp; &nbsp; &nbsp; �������˵�ServerSocket��
  
  ![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018-7-21-Socket/1.png)
  
   3��Socketͨ�ŵĲ���

     �� ����ServerSocket��Socket

     �� �����ӵ�Socket������/�����

     �� ����Э���Socket���ж�/д����

     �� �ر�������������ر�Socket

  4���������ˣ�

     �� ����ServerSocket���󣬰󶨼����˿�

     �� ͨ��accept()���������ͻ�������

     �� ���ӽ�����ͨ����������ȡ�ͻ��˷��͵�������Ϣ

     �� ͨ���������ͻ��˷���������Ϣ

     �� �ر������Դ
     

```
 /** 
  * ����TCPЭ���Socketͨ�ţ�ʵ���û���¼������� 
  */ 
 //1������һ����������Socket����ServerSocket��ָ���󶨵Ķ˿ڣ��������˶˿� 
 ServerSocket serverSocket =newServerSocket(10000);//1024-65535��ĳ���˿� 
 //2������accept()������ʼ�������ȴ��ͻ��˵����� 
 Socket socket = serverSocket.accept(); 
 //3����ȡ������������ȡ�ͻ�����Ϣ 
 InputStream is = socket.getInputStream();
 InputStreamReader isr =newInputStreamReader(is);
 BufferedReader br =newBufferedReader(isr);
 String info =null
 while((info=br.readLine())!=null){
 System.out.println("���Ƿ��������ͻ���˵��"+info)��
 }
 socket.shutdownInput();//�ر�������
 //4����ȡ���������Ӧ�ͻ��˵�����
 OutputStream os = socket.getOutputStream();
 PrintWriter pw = new PrintWriter(os);
 pw.write("��ӭ����");
 pw.flush();
 
 
 //5���ر���Դ
 pw.close();
 os.close();
 br.close();
 isr.close();
 is.close();
 socket.close();
 serverSocket.close();
```

 5���ͻ��ˣ�

     �� ����Socket����ָ����Ҫ���ӵķ������ĵ�ַ�Ͷ˿ں�
    
     �� ���ӽ�����ͨ���������������˷���������Ϣ
    
     �� ͨ����������ȡ��������Ӧ����Ϣ
    
     �� �ر���Ӧ��Դ 
     
     
```
  //�ͻ���
  //1�������ͻ���Socket��ָ����������ַ�Ͷ˿�
  Socket socket =newSocket("localhost",10086); 
  //2����ȡ���������������˷�����Ϣ
  OutputStream os = socket.getOutputStream();//�ֽ������
  PrintWriter pw =newPrintWriter(os);//���������װ�ɴ�ӡ��
  pw.write("�û�����admin�����룺123"); 
  pw.flush(); 
  socket.shutdownOutput();
  //3����ȡ������������ȡ�������˵���Ӧ��Ϣ
  InputStream is = socket.getInputStream();
  BufferedReader br = new BufferedReader(new InputStreamReader(is));
  String info = null;
  while((info=br.readLine())!null){
   System.out.println("���ǿͻ��ˣ�������˵��"+info);
  }
  
  //4���ر���Դ
  br.close();
  is.close();
  pw.close();
  os.close();
  socket.close();
 ```
 
   6��Ӧ�ö��߳�ʵ�ַ��������ͻ���֮���ͨ��

       �� �������˴���ServerSocket��ѭ������accept()�ȴ��ͻ�������
    
       �� �ͻ��˴���һ��socket������ͷ�����������
    
       �� �������˽��ܿ�������󣬴���socket��ÿͻ�����ר������
    
       �� �������ӵ�����socket��һ���������߳��϶Ի�
    
       �� �������˼����ȴ��µ�����        
       
       
```
 //�������̴߳���
  //�ͱ��߳���ص�socket
  Socket socket =null; 
  //
  public serverThread(Socket socket){ 
 this.socket = socket; 
  } 
  
  publicvoid run(){
  //�������������
  }
  
  //============================================
  //����������
  ServerSocket serverSocket =newServerSocket(10000);
  Socket socket =null;
  int count =0;//��¼�ͻ��˵�����
  while(true){
  socket = serverScoket.accept();
  ServerThread serverThread =newServerThread(socket);
   serverThread.start();
   count++;
  System.out.println("�ͻ������ӵ�������"+count);
  }
 ```
 
 # ����UDP���
 
> UDPЭ�飨�û����ݱ�Э�飩�������ӵġ����ɿ��ġ������,�ٶȿ�

> �������ݴ���ʱ�����Ƚ�Ҫ��������ݶ�������ݱ���Datagram������С������64k�������ݱ���ָ��������Ҫ�ﵽ��Socket��������ַ�Ͷ˿ںţ���Ȼ���ٽ����ݱ����ͳ�ȥ

DatagramPacket��:��ʾ���ݱ���

 DatagramSocket�ࣺ���ж˵���ͨ�ŵ���

 1����������ʵ�ֲ���

    �� ����DatagramSocket��ָ���˿ں�
    
    �� ����DatagramPacket
    
    �� ���ܿͻ��˷��͵�������Ϣ
    
    �� ��ȡ����
    
    
```
 //�������ˣ�ʵ�ֻ���UDP���û���¼
  //1��������������DatagramSocket��ָ���˿�
  DatagramSocket socket =new datagramSocket(10010); 
  //2���������ݱ������ڽ��ܿͻ��˷��͵�����
  byte[] data =newbyte[1024];//
  DatagramPacket packet =newDatagramPacket(data,data.length); 
  //3�����ܿͻ��˷��͵����� 
  socket.receive(packet);//�˷����ڽ������ݱ�֮ǰ��һ������ 
  //4����ȡ����
  String info =newString(data,o,data.length);
  System.out.println("���Ƿ��������ͻ��˸�����"+info);
  
  
  //=========================================================
  //��ͻ�����Ӧ����
  //1������ͻ��˵ĵ�ַ���˿ںš�����
  InetAddress address = packet.getAddress();
  int port = packet.getPort();
  byte[] data2 = "��ӭ����".geyBytes();
  //2���������ݱ���������Ӧ��������Ϣ
  DatagramPacket packet2 = new DatagramPacket(data2,data2.length,address,port);
  //3����Ӧ�ͻ���
  socket.send(packet2);
  //4���ر���Դ
  socket.close();
 ```
 
 2���ͻ���ʵ�ֲ���

       �� ���巢����Ϣ
    
       �� ����DatagramPacket��������Ҫ���͵���Ϣ
    
       �� ����DatagramSocket
    
       �� ��������
       
       
```
 //�ͻ���
  //1������������ĵ�ַ���˿ںš�����
  InetAddress address =InetAddress.getByName("localhost"); 
  int port =10010; 
  byte[] data ="�û�����admin;���룺123".getBytes(); 
  //2���������ݱ����������͵�������Ϣ
  DatagramPacket packet = newDatagramPacket(data,data,length,address,port); 
  //3������DatagramSocket����
  DatagramSocket socket =newDatagramSocket();
  //4�����������������
  socket.send(packet);
  
  
  //���ܷ���������Ӧ����
  //======================================
  //1���������ݱ������ڽ��ܷ���������Ӧ����
  byte[] data2 = new byte[1024];
  DatagramPacket packet2 = new DatagramPacket(data2,data2.length);
  //2�����ܷ�������Ӧ������
  socket.receive(packet2);
  String raply = new String(data2,0,packet2.getLenth());
  System.out.println("���ǿͻ��ˣ�������˵��"+reply);
  //4���ر���Դ
  socket.close();
```

**ע�⣺**

1�����̵߳����ȼ����⣺

    ����ʵ�ʵľ��飬�ʵ��Ľ������ȼ��������ܻ��г�������Ч�ʵ͵����

2���Ƿ�ر����������������

     ����ͬһ��socket������ر��������������������������socketҲ�ᱻ�رգ�����һ�㲻�ùر�����ֱ�ӹر�socket����

3��ʹ��TCPͨ�Ŵ������IO�����л�����

4��socket��̴����ļ���IO������
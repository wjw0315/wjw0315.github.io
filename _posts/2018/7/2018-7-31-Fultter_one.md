---
layout:     post                  
title:      Win搭建flutter开发环境       
date:       2018-7-31             
author:     Mr.W                   
header-img: img/post-bg-rwd.jpg  
category: Flutter   
catalog: true  
tags:                             
- Flutter 
---

# 前言

> 在这里还是要啰嗦几句。亚马逊的 Alexa ，特斯拉的自动驾驶汽车，智能温度控制设备，甚至是家用智能
，物联网的时代要来了，不管你想信不信，反正我是相信的。

> Fultter高效率，一套开发能运行到Android和iOS，而且体积小。但是不管怎么样，不要去想着谁取代谁而把其他的丢掉。我们都本着都是学习的态度对待。（服务端Java还是稳健的呀   》_《）咳咳，不皮了不皮了，回正话题，

> 今天我们说讨论的是先从Fultter的搭建开始，对于Fuchsia这个微内核系统我们下次再聊。

> 有人就会说了已经有一个中文的官网教你怎么搭建了为什么还要搞一篇这样的文章，那是因为中文官网翻译过一的有些东西可能不是直接讲明白了。我在这里完整的进行疏导一遍。希望对第一次搭建的朋友们有所帮助。

# 工具：

[Git Windows](https://git-scm.com/download/win)

PowerShell

# 一、克隆Fultter：

`git clone -b beta https://github.com/flutter/flutter.git`

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/7-30/1.png)


你可以直接到这个地址下载也行：
https://github.com/flutter/flutter

# 二、配置环境变量：

我的电脑-》属性-》高级系统设置-》环境变量

## 1、配置用户变量，配成系统变量也可以，随便你

```
 PATH=**/flutter/bin  //文件的全路径
 PUB_HOSTED_URL=https://pub.flutter-io.cn //国内用户需要设置
 FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn //国内用户需要设置
 ```
 ![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/7-30/4.png)

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/7-30/5.png)


`PUB_HOSTED_URL`和`FLUTTER_STORAGE_BASE_URL`是google为国内开发者搭建的临时镜像。详情请参考 [Using Flutter in China](https://github.com/flutter/flutter/wiki/Using-Flutter-in-China)

## 2、在cmd下运行命令：`flutter upgrade ` 查看是否有更新。

我的因为是之前下载过老版本的，下载了就需要更新一下。
![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/7-30/2.png)

3、接着在cmd下运行命令：`flutter doctor ` 


**可能出现如下问题**（没有出现就跳过此步骤）：
![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/7-30/3.png)

**解决：** 管理员方式运行Flutter目录下的`flutter_console.bat`

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/7-30/6.png)

执行命令：`flutter doctor `等待Dart SDK下载完。

出现如下的就说明配置完成：

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/7-30/7.png)

可以看到我本机上是已经安装好了Android Studio的，IDEA也是有的，但是IDEA上并没有安装上相应的插件。

下面开始编辑器的配置。我已经安装好了Android Studio。那么久用这个进行开发。

# Android Studio设置

最基本的如果没有安装好Android Studio 以及SDK ，那么就先安装好来，安装3.0以上的版本。


## 1、Android真机设置：

要准备在Android设备上运行并测试您的Flutter应用，您需要安装Android 4.1（API level 16）或更高版本的Android设备.

a、在您的设备上启用 开发人员选项 和 USB调试 。详细说明可在Android文档中找到。

b、使用USB将手机插入电脑。如果您的设备出现提示，请授权您的计算机访问您的设备。

c、在终端中，运行 `flutter devices` 命令以验证Flutter识别您连接的Android设备。

d、运行启动您的应用程序 `flutter run`。

默认情况下，Flutter使用的Android SDK版本是基于你的 adb 工具版本。 如果您想让Flutter使用不同版本的Android SDK，则必须将该 ANDROID_HOME 环境变量设置为SDK安装目录。

## 2、Android模拟器设置：

要准备在Android模拟器上运行并测试您的Flutter应用，请按照以下步骤操作：

a 在您的机器上启用 VM acceleration .

b 启动 **Android Studio>Tools>Android>AVD Manager** 并选择 **Create Virtual Device**.

c 选择一个设备并选择 Next

d 为要模拟的Android版本选择一个或多个系统映像，然后选择 Next. 建议使用 x86 或 x86_64 image .

e 在 Emulated Performance下, 选择 Hardware - GLES 2.0 以启用 硬件加速.

f 验证AVD配置是否正确，然后选择 Finish。

g 在 Android Virtual Device Manager中, 点击工具栏的 Run。模拟器启动并显示所选操作系统版本或设备的启动画面.

h 运行 **flutter run**启动您的设备. 连接的设备名是 **Android SDK built for <platform>**,其中 platform 是芯片系列, 如 x86.

## 3、安装Flutter和Dart插件

settings –> Plugins –> Browse repositories，输入Dart，安装。同样的也安装好Flutter。

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/7-30/8.png)

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/7-30/9.png)


配置到这里就结束了，接下来就是创建demo进行体验了。请关注后期更新的文章。

上期说是要学习vue的，现在我已经找了合作伙伴，所以先接触最新的东西。

[Flutter demo起步--暂未更新]()

**参考**

1、[Flutter 中文网](https://flutterchina.club/)

2、[Using Flutter in China](https://github.com/flutter/flutter/wiki/Using-Flutter-in-China)

---
layout:     post                  
title:      Win�flutter��������       
date:       2018-7-31             
author:     Mr.W                   
header-img: img/post-bg-rwd.jpg  
category: Flutter   
catalog: true  
tags:                             
- Flutter 
---

# ǰ��

> �����ﻹ��Ҫ���¼��䡣����ѷ�� Alexa ����˹�����Զ���ʻ�����������¶ȿ����豸�������Ǽ�������
����������ʱ��Ҫ���ˣ����������Ų��ţ������������ŵġ�

> Fultter��Ч�ʣ�һ�׿��������е�Android��iOS���������С�����ǲ�����ô������Ҫȥ����˭ȡ��˭���������Ķ��������Ƕ����Ŷ���ѧϰ��̬�ȶԴ����������Java�����Ƚ���ѽ   ��_�����ȿȣ���Ƥ�˲�Ƥ�ˣ��������⣬

> ��������˵���۵����ȴ�Fultter�Ĵ��ʼ������Fuchsia���΢�ں�ϵͳ�����´����ġ�

> ���˾ͻ�˵���Ѿ���һ�����ĵĹ���������ô���Ϊʲô��Ҫ��һƪ���������£�������Ϊ���Ĺ��������һ����Щ�������ܲ���ֱ�ӽ������ˡ��������������Ľ����赼һ�顣ϣ���Ե�һ�δ������������������

# ���ߣ�

[Git Windows](https://git-scm.com/download/win)

PowerShell

# һ����¡Fultter��

`git clone -b beta https://github.com/flutter/flutter.git`

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/7-30/1.png)


�����ֱ�ӵ������ַ����Ҳ�У�
https://github.com/flutter/flutter

# �������û���������

�ҵĵ���-������-���߼�ϵͳ����-����������

## 1�������û����������ϵͳ����Ҳ���ԣ������

```
 PATH=**/flutter/bin  //�ļ���ȫ·��
 PUB_HOSTED_URL=https://pub.flutter-io.cn //�����û���Ҫ����
 FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn //�����û���Ҫ����
 ```
 ![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/7-30/4.png)

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/7-30/5.png)


`PUB_HOSTED_URL`��`FLUTTER_STORAGE_BASE_URL`��googleΪ���ڿ����ߴ����ʱ����������ο� [Using Flutter in China](https://github.com/flutter/flutter/wiki/Using-Flutter-in-China)

## 2����cmd���������`flutter upgrade ` �鿴�Ƿ��и��¡�

�ҵ���Ϊ��֮ǰ���ع��ϰ汾�ģ������˾���Ҫ����һ�¡�
![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/7-30/2.png)

3��������cmd���������`flutter doctor ` 


**���ܳ�����������**��û�г��־������˲��裩��
![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/7-30/3.png)

**�����** ����Ա��ʽ����FlutterĿ¼�µ�`flutter_console.bat`

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/7-30/6.png)

ִ�����`flutter doctor `�ȴ�Dart SDK�����ꡣ

�������µľ�˵��������ɣ�

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/7-30/7.png)

���Կ����ұ��������Ѿ���װ����Android Studio�ģ�IDEAҲ���еģ�����IDEA�ϲ�û�а�װ����Ӧ�Ĳ����

���濪ʼ�༭�������á����Ѿ���װ����Android Studio����ô����������п�����

# Android Studio����

����������û�а�װ��Android Studio �Լ�SDK ����ô���Ȱ�װ��������װ3.0���ϵİ汾��


## 1��Android������ã�

Ҫ׼����Android�豸�����в���������FlutterӦ�ã�����Ҫ��װAndroid 4.1��API level 16������߰汾��Android�豸.

a���������豸������ ������Աѡ�� �� USB���� ����ϸ˵������Android�ĵ����ҵ���

b��ʹ��USB���ֻ�������ԡ���������豸������ʾ������Ȩ���ļ�������������豸��

c�����ն��У����� `flutter devices` ��������֤Flutterʶ�������ӵ�Android�豸��

d��������������Ӧ�ó��� `flutter run`��

Ĭ������£�Flutterʹ�õ�Android SDK�汾�ǻ������ adb ���߰汾�� ���������Flutterʹ�ò�ͬ�汾��Android SDK������뽫�� ANDROID_HOME ������������ΪSDK��װĿ¼��

## 2��Androidģ�������ã�

Ҫ׼����Androidģ���������в���������FlutterӦ�ã��밴�����²��������

a �����Ļ��������� VM acceleration .

b ���� **Android Studio>Tools>Android>AVD Manager** ��ѡ�� **Create Virtual Device**.

c ѡ��һ���豸��ѡ�� Next

d ΪҪģ���Android�汾ѡ��һ������ϵͳӳ��Ȼ��ѡ�� Next. ����ʹ�� x86 �� x86_64 image .

e �� Emulated Performance��, ѡ�� Hardware - GLES 2.0 ������ Ӳ������.

f ��֤AVD�����Ƿ���ȷ��Ȼ��ѡ�� Finish��

g �� Android Virtual Device Manager��, ����������� Run��ģ������������ʾ��ѡ����ϵͳ�汾���豸����������.

h ���� **flutter run**���������豸. ���ӵ��豸���� **Android SDK built for <platform>**,���� platform ��оƬϵ��, �� x86.

## 3����װFlutter��Dart���

settings �C> Plugins �C> Browse repositories������Dart����װ��ͬ����Ҳ��װ��Flutter��

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/7-30/8.png)

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/7-30/9.png)


���õ�����ͽ����ˣ����������Ǵ���demo���������ˡ����ע���ڸ��µ����¡�

[Flutter demo��--��δ����]()

**�ο�**

1��[Flutter ������](https://flutterchina.club/)

2��[Using Flutter in China](https://github.com/flutter/flutter/wiki/Using-Flutter-in-China)
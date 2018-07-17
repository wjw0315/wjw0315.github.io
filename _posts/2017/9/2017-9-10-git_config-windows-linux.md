---
layout:     post
title:      git配置（Windows+Linux）
subtitle:   git_config-windows-linux
date:       2017-09-10
author:     wjw
header-img: img/post-bg-ios9-web.jpg
catalog: true
stickie: true
tags:
    - Git
---

## Git的基础配置：

1、配置用户名（提交时会进行引用）
```
Git config --global user.name "wjw0215"
```

2、配置邮箱（提交时会引用）：

```
Git config --global user.email "821060818@qq.com"
```

3、其他配置：

```
git config --global merge.tool "kdiff3"
```

#如果没有装kdiff3就不需要设置

```
Git config --global core.autocrlf false
```

#让Git不要管Windows/unix 换行符转换的事。

 
4、编码配置：

```
Git config --global gui.encoding utf-8
git config --global core.quotepath off
```

#避免Git status显示的中文文件名乱码

5、Windows上还需要的配置：

```
Git config --global core.ignorecase false
```

## git ssh key pair 配置：

1、在Linux的命令行下，或者Windows上的Git bash 命令行窗口中键入：
```
ssh-keygen -t rsa -C "821060818@qq.com"
```

2、然后一路回车，不要输入任何的密码之类的，生成ssh key pair

3、
```
ssh-add ~/.ssh/id_rsa
```

4、

```
cat ~/.ssh/id_rsa.pub
```

将生成出来的文件全部的复制出来，

【注】执行ssh-add时出现Could not open a connection to your authentication agent ，如果有报错就先执行
```
eval `ssh-agent`
```
(此处不是单引号，是~键上的那个`)，之后再执行
```
ssh-add ~/.ssh/id_rsa
```
成功后执行
```
ssh-add –l
```
就会有新加的rsa了

 

## Git的验证：

```
Git --version 
```
出现版本信息就是安装成功。

Git的常用命令：

 切换分支：git checkout 分支名
 拉取：git pull
 提交：git push

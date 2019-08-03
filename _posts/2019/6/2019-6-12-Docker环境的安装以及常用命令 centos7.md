---
layout:     post                  
title:      Docker环境的安装以及常用命令 centos7       
date:       2019-6-12             
author:     JiaweiWu                   
header-img: img/post-bg-rwd.jpg  
category: Docker   
catalog: true  
tags:                             
- Docker
---


<a name="77a1b9d1"></a>
# 一、安装Docker环境

安装

`yum install docker`

安装完成之后，使用下面的命令来启动 docker 服务，并将其设置为开机启动：

```
service docker start
chkconfig docker on

#LCTT 译注：此处采用了旧式的 sysv 语法，如采用CentOS 7中支持的新式 systemd 语法，如下：

systemctl  start docker.service
systemctl  enable docker.service
```

使用Docker 中国加速器

```
vi  /etc/docker/daemon.json

#添加后：
{
    "registry-mirrors": ["https://registry.docker-cn.com"],
    "live-restore": true
}
```

输入docker version 返回版本信息则安装正常。

<a name="8a86db1f"></a>
# 二、安装jdk

`yum -y install java-1.8.0-openjdk*`

配置环境变量 打开 vim /etc/profile 添加一下内容

```
export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.161-0.b14.el7_4.x86_64 
export PATH=$PATH:$JAVA_HOME/bin
```

修改完成之后，使其生效

```
source /etc/profile
```

输入`java -version` 返回版本信息则安装正常。

<a name="8389b667"></a>
# 三、安装maven

到maven官网下载压缩包

```
## 解压
tar vxf apache-maven-3.5.2-bin.tar.gz
## 移动
mv apache-maven-3.5.2 /usr/local/maven3
```

修改环境变量， 在/etc/profile中添加以下几行

```
MAVEN_HOME=/usr/local/maven3
export MAVEN_HOME
export PATH=${PATH}:${MAVEN_HOME}/bin
```

记得执行`source /etc/profile`使环境变量生效。

输入`mvn -version` 返回版本信息则安装正常。

> 这样整个构建环境就配置完成了。


<a name="0dfbe902"></a>
# 常用命令

除过以上我们使用的Docker命令外，Docker还有一些其它常用的命令

- docker登陆

`docker login`

- docker 退出登陆

`docker logout`

- docker退出登陆后重新登陆

`winpty docker login`

- 拉取docker镜像

`docker pull image_name`

- 查看宿主机上的镜像，Docker镜像保存在/var/lib/docker目录下:

`docker images`

- 删除镜像

[注意]删除镜像前，先停止镜像对应的容器的运行，并删除容器后在删除镜像

`docker rmi docker.io/tomcat:7.0.77-jre7 或者 docker rmi b39c68b7af30`

- 查看当前有哪些容器正在运行

`docker ps`

- 查看所有容器

`docker ps -a`

- 启动、停止、重启容器命令：

```
docker start container_name/container_id
docker stop container_name/container_id
docker restart container_name/container_id
```

- 后台启动一个容器后，如果想进入到这个容器，可以使用attach命令：

`docker attach container_name/container_id`

- 删除容器的命令：

`docker rm container_name/container_id`

- 删除所有停止的容器：

`docker rm $(docker ps -a -q)`

- 查看当前系统Docker信息

`docker info`

- 从Docker hub上下载某个镜像:

```
docker pull centos:latest
docker pull centos:latest
```

- 查找Docker Hub上的nginx镜像

`docker search nginx`

执`行docker pull centos`会将Centos这个仓库下面的所有镜像下载到本地repository。

- 查看日志：（例如查看nginx）`docker logs nginx`
- 进容器：`docker exec -it (镜像ID) sh`
<a name="hD2Vh"></a>
# 常见问题
1、删除镜像的时候报错image is referenced in multiple repositories<br />原因：<br />此时会发现同一个imageID对应两个资源，所以此时我们需要的是指定镜像资源以及tag进行删除<br />eg: `docker rmi <镜像资源名称>:<tag>`  

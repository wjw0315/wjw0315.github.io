---
layout:     post                  
title:      Docker +jenkins+GitLab      
date:       2019-6-13             
author:     JiaweiWu                   
header-img: img/post-bg-rwd.jpg  
category: Docker   
catalog: true  
tags:                             
- Docker
---

1：什么是持续集成：<br />持续集成是指开发者在代码的开发过程中，可以频繁的将代码部署集成到主干，并进行自动化测试<br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1560349368864-4c8dfe01-7ab2-40ba-b593-976553d7d4ba.png#align=left&display=inline&height=218&name=image.png&originHeight=435&originWidth=1000&size=91745&status=done&width=500)<br />2：什么是持续交付：<br />持续交付指的是在持续集成的环境基础之上，将代码部署到预生产环境<br />3：持续部署：<br />在持续交付的基础上，把部署到生产环境的过程自动化，持续部署和持续交付的区别就是最终部署到生产环境是自动化的。   <br />                                                                               
<a name="QmKXz"></a>
# 1、搭建docker私服
请看之前的文章：[https://www.yuque.com/wjwcloud/note/woxxm8](https://www.yuque.com/wjwcloud/note/woxxm8)

<a name="dlWpi"></a>
# 2、搭建GitLab
拉取gitlab镜像，并启动
```
docker pull gitlab/gitlab-ce
```

```
docker run --detach \
--hostname gitlab.wjwcloud.com \
--publish 8443:443 --publish 48080:80 --publish 8022:22 \
--name gitlab \
--restart always \
--volume /opt/gitlab/config:/etc/gitlab \
--volume /opt/gitlab/logs:/var/log/gitlab \
--volume /opt/gitlab/data:/var/opt/gitlab \
gitlab/gitlab-ce:latest
```
我们指定了三个端口,22表示ssh端口,80表示http端口,443表示https端口,分别映射到宿主机上的8022、48080和8443端口,我们还通过--volume指定目录映射,其中

- /etc/gitlab表示gitlab的配置目录,映射到宿主机的/opt/gitlab/config目录.
- /var/log/gitlab表示gitlab的日志目录,映射到宿主机的/opt/gitlab/logs目录.
- /var/opt/gitlab表示gitlab的数据目录,映射到宿主机的/opt/gitlab/data目录.

还可为其指定网络配置：
```
--hostname ：指定hostname;

--net : 指定网络模式

--ip：指定IP

--add-host ：指定往/etc/hosts添加的host
```
【⚠️】在Mac端可能出现error：

```
Error response from daemon: Mounts denied: 
The paths /opt/gitlab/logs and /opt/gitlab/config and /opt/gitlab/data
are not shared from OS X and are not known to Docker.
```
**原因：**处理将命令改成下面(因为/opt/gitlab 不在docker中的共享目录中, 查看和配置 Docker -> Preferences… -> File Sharing)<br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1560402668560-76c7404f-3dab-48ca-aea5-53321efbfb9b.png#align=left&display=inline&height=413&name=image.png&originHeight=826&originWidth=1092&size=161563&status=done&width=546)

开启48080的端口，浏览器访问：http;//ip:48080 进入修改管理员密码页面.<br />【⚠️】如果出现如下：<br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1560353592108-90e576db-22c1-48f4-93b9-a8468585916a.png#align=left&display=inline&height=563&name=image.png&originHeight=1126&originWidth=1816&size=113773&status=done&width=908)<br />1、可能机器内存太小，执行指令 free -m 查看看下used  和 free的使用情况，如果free一直在减少，说明gitlab正在启动，消耗内存中，还没有启动完成！这个时候访问是会提示502 Whoops, GitLab is taking too much time to respond.  这个时候不要去修改什么端口，启动等等<br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1560353946160-af3ebcce-ece0-441c-b053-021288e810c9.png#align=left&display=inline&height=304&name=image.png&originHeight=608&originWidth=1208&size=134692&status=done&width=604)<br />2、可能端口冲突，修改启动端口即可。

接下来，我们将密码修改,<br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1560399141512-269d1141-d5d7-4578-82cb-66618d28d3e7.png#align=left&display=inline&height=656&name=image.png&originHeight=1312&originWidth=2306&size=218473&status=done&width=1153)<br />修改完密码后接着进入管理登录页面,输入登录用户名密码root/修改的password登录进去.

<a name="u7vXX"></a>
# 3、安装Jenkins
拉取Jenkins镜像

```
docker pull jenkinsci/jenkins
```
启动jenkins容器

```
docker run \
-d \
-p 38080:8080 \
-p 50000:50000 \
--name jenkins \
--link gitlab:gitlab \
-u root \
-v /opt/jenkins:/var/jenkins_home \
jenkinsci/jenkins:latest
```

--link <name or id>:alias<br />其中，name和id是源容器的name和id，alias是源容器在link下的别名

开启38080端口，其中8080端口是jenkins的端口,38080是映射宿主机的端口,50000端口是master和slave通信端口.以root用户来启动容器,同时通过配置--link连接gitlab,因为要与gitlab容器通讯下载代码.

打开浏览器http://IP:38080/访问跳转到解锁jenkins页面.

在服务器上以下执行命令查看密码
```
[root@cenots ~]# cat /var/jenkins_home/secrets/initialAdminPassword
```
然而cat: /var/jenkins_home/secrets/initialAdminPassword: 没有那个文件或目录<br />由于之前启动jenkins容器时我们做了目录映射 -v /opt/jenkins:/var/jenkins_home,所以要将执行命令改为:
```
[root@centos ~]# cat /opt/jenkins/secrets/initialAdminPassword
aa**********4d3a
```
在解锁页面上输入上述密码,继续进入。<br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1560406947661-718cd19e-c4dd-40f2-8aba-839e71691b8f.png#align=left&display=inline&height=581&name=image.png&originHeight=1162&originWidth=2104&size=135734&status=done&width=1052)<br />【⚠️】<br />**由于我们需要使用Jenkins进行自动化发布docker镜像，需要使用到docker的服务，而我们部署的Jenkins就是采用的docker，因而此时在Jenkins中无法使用docker 。那么解决的方案有如下：**<br />1.不使用Jenkins镜像,直接在宿主机上安装Jenkins服务,可以调用宿主机上的docker命令.<br />2.使用dood方案:表示在docker容器中使用宿主机上的docker服务.<br />3.使用dind方案:在docker镜像中要再安装docker服务,此时在容器中的docker和宿主机的docker是两个不同的程序,相互没有关联.<br />4.使用https与docker后台程序通讯,通过https暴露socket,并且可以使用宿主的镜像,但因为打开了端口增加了攻击面,可以说是最不安全的.
<a name="MzpIK"></a>
# 
<a name="QwAbG"></a>
## 使用第2种方案进行处理：
1.先删掉之前建好的jenkins容器和镜像，先创建一个Jenkins的配置目录，并修改目录权限。
```
mkdir -p /opt/jenkins-w
//修改挂载目录权限.
chown -R 1000 /opt/jenkins-w
```
2、然后在虚拟机上创建一个空的Dockerfile文件.
```
[root@centos jenkins-w]# touch Dockerfile
```
3、编写Dockerfile脚本
```
[root@centos jenkins-w]# vi Dockerfile
```
```
FROM jenkins:latest
USER root
ARG dockerGid=999
RUN echo "docker:x:${dockerGid}:jenkins" >> /etc/group
USER jenkins
```
4、重新构建jenkins镜像
```
[root@centos jenkins-w]# docker build -t jenkins .
```
5、在启动Jenkins容器，并且挂载到docker 里的Jenkins目录下.

```
docker run \
-d \
-p 38080:8080 \
-p 50000:50000 \
--name jenkins \
-v /var/run/docker.sock:/var/run/docker.sock \
-v $(which docker):/bin/docker \
-v /opt/jenkins-w:/var/jenkins_home \
-u root \
--link gitlab:gitlab \
jenkins:latest
```
绑定宿主机jdk、maven

```
-v /opt/jdk/jdk1.8.0_211/bin/java:/usr/bin/jdk1.8.0_211/java \
-v /opt/jdk/jdk1.8.0_211:/var/local/jdk1.8.0_211 \
-v /opt/maven/apache-maven-3.5.4:/var/local/apache-maven-3.5.4 \
```

注意这两个-v参数(将jenkins容器内的docker命令指向了宿主机):<br />-v /var/run/docker.sock:/var/run/docker.sock<br />-v $(which docker):/bin/docker<br />之后直接在jenkins里面就可以使用docker命令了.同样的启动jenkins容器后找回管理员密码:
```
cat /opt/jenkins-w/secrets/initialAdminPassword
```
进去系统后先修改jenkins时间设置:打开【系统管理】->【脚本命令行】运行下面的命令:
```
System.setProperty('org.apache.commons.jelly.tags.fmt.timeZone', 'Asia/Shanghai')
```
<a name="gpWaI"></a>
## jenkin控制台配置


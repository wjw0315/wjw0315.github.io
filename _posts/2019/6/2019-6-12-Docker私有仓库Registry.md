---
layout:     post                  
title:      Docker私有仓库Registry      
date:       2019-6-12             
author:     JiaweiWu                   
header-img: img/post-bg-rwd.jpg  
category: Docker   
catalog: true  
tags:                             
- Docker
---


<a name="4SoNv"></a>
## 一、什么是Docker私有仓库Registry

> 官方的Docker hub是一个用于管理公共镜像的好地方，我们可以在上面找到我们想要的镜像，也可以把我们自己的镜像推送上去。但是，有时候我们的服务器无法访问互联网，或者你不希望将自己的镜像放到公网当中，那么你就需要Docker Registry，它可以用来存储和管理自己的镜像。


<a name="EGALL"></a>
## 二、安装Docker及Registry

安装Docker见之前博文：<br />[https://www.yuque.com/wjwcloud/note/yx78yb](https://www.yuque.com/wjwcloud/note/yx78yb)

安装Registry：

很简单，只需要运行一个Registry容器即可（包括下载镜像和启动容器、服务）

```
docker run -d -p 5000:5000 -v /data/registry:/var/lib/registry --name registry --restart=always registry
```

<a name="ebgro"></a>
## 三、如何使用Registry

我也看过其他博文，经常报的一个错误就是：

```
unable to ping registry endpoint https://172.18.3.22:5000/v0/
v2 ping attempt failed with error: Get https://172.18.3.22:5000/v2/: http: server gave HTTP response to HTTPS client
```

这是由于Registry为了安全性考虑，默认是需要https证书支持的.

但是我们可以通过一个简单的办法解决：

修改`/etc/docker/daemon.json`文件

```
#vi /etc/docker/daemon.json
{
    "insecure-registries": ["<ip>:5000"] 
}
```

```
#systemctl daemon-reload 

#systemctl restart docker
```

注：：Registry的机器ip地址，在安装registry的节点和客户端需要访问私有Registry的节点都需要执行此步操作。

<a name="DGyVv"></a>
## 四、通过 docker tag重命名镜像，使之与registry匹配

`docker tag inits/nginx1.8 <ip>:5000/nginx1.8:latest`

<a name="6NnWo"></a>
## 五、上传镜像到Registry

`docker push <ip>:5000/nginx1.8:latest`

<a name="40BmE"></a>
## 六、查看Registry中所有镜像信息

`curl http://<ip>:5000/v2/_catalog`

返回：<br />`{"repositories":["centos6.8","jenkins1.638","nginx","redis3.0","source2.0.3","zkdubbo"]}`

<a name="IwQ66"></a>
## 七、其他Docker服务器下载镜像

`docker pull <ip>:5000/nginx1.8:latest`

<a name="7Y0vD"></a>
## 八、启动镜像

`docker run -it <ip>:5000/nginx1.8:latest /bin/bash`

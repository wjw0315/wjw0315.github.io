---
layout:     post                  
title:      Docker+FastDFS      
date:       2019-6-13             
author:     JiaweiWu                   
header-img: img/post-bg-rwd.jpg  
category: Docker   
catalog: true  
tags:                             
- Docker
---

<a name="wrKtD"></a>
# 下载启动镜像
```
//使用docker镜像构建tracker容器，跟踪服务器，起到调度的作用
docker run -d --network=host --name tracker -v /opt/fdfs/tracker:/var/fdfs delron/fastdfs tracker
//使用docker镜像构建storage容器，存储服务器，提供容量和备份服务
docker run -d --network=host --name storage -e TRACKER_SERVER=ip:22122 -v /opt/fdfs/storage:/var/fdfs -e GROUP_NAME=group1 delron/fastdfs storage
```

- ip: 服务器外网IP地址
<a name="yo7wI"></a>
# 进入storage容器
到storage的配置文件中配置http访问的端口，配置文件在/etc/fdfs目录下的storage.conf,配置文件的最底部：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1561994499485-7cddf9df-419f-4fe3-b7cf-39874afeee60.png#align=left&display=inline&height=217&name=image.png&originHeight=434&originWidth=1130&size=71546&status=done&width=565)


接着配置nginx，在/usr/local/nginx目录下，修改nginx.conf文件：

- 这个是默认配置：<br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1561994651127-4cde47eb-8cab-4268-9021-34584e69a094.png#align=left&display=inline&height=171&name=image.png&originHeight=342&originWidth=816&size=35404&status=done&width=408)
- 可自行修改上面的配置如下，不做修改可直接使用：

```
location /group1/M00 {
        alias  /var/fdfs;
    }
```

将一张照片（m.png）放置在/var/fdfs/storage目录下，进入storage容器，进入/var/fdfs目录，运行下面命令：

```
/usr/bin/fdfs_upload_file /etc/fdfs/client.conf m.png

```
![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1561994963024-36636a20-6f2d-42ee-82d5-d10aaaaa677f.png#align=left&display=inline&height=70&name=image.png&originHeight=140&originWidth=1186&size=45443&status=done&width=593)

通过URL即可直接访问:http://<ip地址>:8888/group1/M00/00/00/rBIE1V0aI3aALAH5AAGMleOKlpA961.png

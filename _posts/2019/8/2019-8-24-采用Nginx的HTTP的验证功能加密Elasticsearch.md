---
layout:     post                  
title:      采用Nginx的HTTP的验证功能加密Elasticsearch      
date:       2019-8-24             
author:     JiaweiWu                  
header-img: img/post-bg-rwd.jpg  
category: 运维   
catalog: true  
tags:                             
- ELK 
---

# 采用Nginx的HTTP的验证功能加密Elasticsearch

> Elasticsearch默认是完全暴露在互联网上的RESTful服务接口。在我们实际生产中自然不能直接无加密的将数据暴露。Nginx是一个高性能的反向代理服务，可以使用它的HTTP的验证功能给ES进行加密。


结合上篇文章中配置好的服务进行处理：[https://www.yuque.com/wjwcloud/note/dhurpr](https://www.yuque.com/wjwcloud/note/dhurpr)

docker安装运行一个Nginx

```java
mkdir -p /opt/docker/nginx80/www /opt/docker/nginx80/logs /opt/docker/nginx80/conf

docker run --name nginx80 -p 80:80 -p 8080:8080 -p 8101:8101 -p 8102:8102  -v /opt/docker/nginx80/html:/usr/share/nginx/html \
-v /opt/docker/nginx80/logs:/var/log/nginx -v /opt/docker/nginx80/conf:/etc/nginx/conf.d  -d nginx
```

每次修改Nginx的配置重启Nginx:<br />`docker restart nignx80`
<a name="Ojo1x"></a>
# Nginx的代理

```java

http {
  server {
    listen 8080;
    location / {
      proxy_pass http://localhost:9200;
    }
  }
}
```

<a name="D03uH"></a>
# Nginx进行持久化数据
使用nginx保持elasticsearch连接。这么做可以减少elasticsearch因每次请求都需要连接/断开的压力。

```java

events {
    worker_connections  1024;
}
 
http {
 
  upstream elasticsearch {
    server 127.0.0.1:9200;
 
    keepalive 15;
  }
 
  server {
    listen 8080;
 
    location / {
      proxy_pass http://elasticsearch;
      proxy_http_version 1.1;
      proxy_set_header Connection "Keep-Alive";
      proxy_set_header Proxy-Connection "Keep-Alive";
    }
 
  }
 
}
```
没有持久化连接的时候，每次请求elasticsearch数据opened connections都会增加：
```
$ curl 'localhost:9200/_nodes/stats/http?pretty' | grep total_opened
# "total_opened" : 11
$ curl 'localhost:9200/_nodes/stats/http?pretty' | grep total_opened
# "total_opened" : 12
```
使用nginx持久化连接后，opened connections每回都一样：
```
$ curl 'localhost:8080/_nodes/stats/http?pretty' | grep total_opened
# "total_opened" : 13
$ curl 'localhost:9200/_nodes/stats/http?pretty' | grep total_opened
# "total_opened" : 13
```

<a name="3gZ1B"></a>
# 负载均衡

```
events {
    worker_connections  1024;
}
 
http {
 
  upstream elasticsearch {
    server 127.0.0.1:9200;
    server 127.0.0.1:9201;
    server 127.0.0.1:9202;
 
    keepalive 15;
  }
 
  server {
    listen 8080;
 
    location / {
      proxy_pass http://elasticsearch;
      proxy_http_version 1.1;
      proxy_set_header Connection "Keep-Alive";
      proxy_set_header Proxy-Connection "Keep-Alive";
    }
 
  }
 
}
```
对于elasticsearch本身有负载均衡机制。

<a name="2ARhV"></a>
# Nginx处理基本的用户认证

```
events {
  worker_connections  1024;
}
 
http {
 
  upstream elasticsearch {
    server 127.0.0.1:9200;
  }
 
  server {
    listen 8080;
 
    auth_basic "Login Elasticsearch";
    auth_basic_user_file /etc/nginx/conf.d/htpasswd;
 
    location / {
      proxy_pass http://elasticsearch;
      proxy_redirect off;
    }
  }
 
}
```

**auth_basic_user_file** 表示账号密码存放的文本地址。<br />采用在线工具 [https://www.sojson.com/htpasswd.html](https://www.sojson.com/htpasswd.html) 进行生成密码<br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/250511/1566614125603-01417b05-344a-4f5c-9061-9e4f55d22bb3.png#align=left&display=inline&height=551&name=image.png&originHeight=585&originWidth=1454&size=95029&status=done&width=1369.1149845527423)<br />或者可以直接采用指令向文件中插入账号密码：
```
printf "test:$(openssl passwd -crypt test)\n" >>/opt/docker/nginx80/conf/htpasswd
```

设置一个账号密码： test test

在线工具生成的账号密码则将生成的结果复制到我们设置的目录文件中。

测试对于普通的请求拒绝：
```
$ curl -i localhost:8080
# HTTP/1.1 401 Unauthorized
```
输入帐号密码后，就可以建立连接了：
```
$ curl -i test:test@localhost:8080
# HTTP/1.1 200 OK
```
此时我们可以对外关闭9200的端口。
<a name="adzO3"></a>
# Nginx处理简单授权
如果没有授权机制，只要登录，就可以对集群中任何事情，更改或删除数据，查看内部数据，甚至关闭集群。<br />通过非常小的改动，我们就可以拒绝通过RESTful命令关闭集群。

```
events {
  worker_connections  1024;
}
 
http {
 
  upstream elasticsearch {
    server 127.0.0.1:9200;
  }
  server {

   		listen 8080;
      location / {
        auth_basic "Login Elasticsearch";
        auth_basic_user_file /etc/nginx/conf.d/htpasswd;
        if ($request_filename ~ _shutdown) {
          return 403;
          break;
        }

        proxy_pass http://elasticsearch;
        proxy_redirect off;
      }
   }
 }
```

尝试调用关闭集群，将会返回拒绝信息：
```
$ curl -i -X POST test:test@localhost:8080/_cluster/nodes/_shutdown
# HTTP/1.1 403 Forbidden
```

可以配置允许某些请求，拒绝其余的请求，通过两个location来实现：
```
events {
	worker_connections  1024;
}
http {
  upstream elasticsearch {
  	server 127.0.0.1:9200;
	}
  server {
    listen 8080;
    auth_basic "Login Elasticsearch";
    auth_basic_user_file /etc/nginx/conf.d/htpasswd;
    
    location ~* ^(/_cluster|/_nodes) {
        proxy_pass http://elasticsearch;
        proxy_redirect off;
    }
    location / {
        return 403;
        break;
    }
  }
}
```
这样，请求/_cluster 和 /_nodes将通过，其他的会被拒绝：
```
$ curl -i test:test@localhost:8080/
HTTP/1.1 403 Forbidden

$ curl -i test:test@localhost:8080/_cluster/health
# HTTP/1.1 200 OK

$ curl -i test:test@localhost:8080/_nodes/stats
HTTP/1.1 200 OK
```

<a name="LXQ0x"></a>
# Nginx处理选择性认证
```
events {
	worker_connections  1024;
}
http {
  upstream elasticsearch {
  	server 127.0.0.1:9200;
  }
  server {
    listen 8080;
    location / {
      error_page 590 = @elasticsearch;
      error_page 595 = @protected_elasticsearch;
      set $ok 0;
      if ($request_uri ~ ^/$) {
      set $ok "${ok}1";
      }
      if ($request_method = HEAD) {
      set $ok "${ok}2";
      }
      if ($ok = 012) {
      return 590;
      }
      return 595;
    }
    location @elasticsearch {
        proxy_pass http://elasticsearch;
        proxy_redirect off;
    }
    location @protected_elasticsearch {
        auth_basic  "Login Elasticsearch";
        auth_basic_user_file /etc/nginx/conf.d/htpasswd;
        proxy_pass http://elasticsearch;
        proxy_redirect off;
    }
  }
}
```
首先，我们定义两个状态代码：590-不需要验证，595-需要验证，使用nginx的location功能，两个location都指向同一个集群，但是其中一个需要认证。<br />然后我们设置一个变量$ok，默认值0，当进入请求是／，$ok变成01.如果请求是HEAD$ok变成012。<br />如果$ok是012，返回590状态码，换句话说，不需验证，其他情况返回595，需要验证。
```
$ curl -i -X HEAD localhost:8080
# HTTP/1.1 200 OK

$ curl -i localhost:8080
# HTTP/1.1 401 Unauthorized

$ curl -i test:test@localhost:8080
# HTTP/1.1 200 OK
```

<a name="t1j2m"></a>
# Nginx处理多角色授权
**授权模式：**

- 没有认证的用户只能使用ping命令，ping指定的URL(/)；
- 认证过的user用户可以执行_search与_analyze请求；
- 认证过的admin用户可以执行任何请求。

```
events {
  worker_connections  1024;
}
 
http {
 
  upstream elasticsearch {
      server 127.0.0.1:9200;
  }
 
  # Allow HEAD / for all
  #
  server {
      listen 8080;
 
      location / {
        return 401;
      }
 
      location = / {
        if ($request_method !~ "HEAD") {
          return 403;
          break;
        }
 
        proxy_pass http://elasticsearch;
        proxy_redirect off;
      }
  }
 
  # Allow access to /_search and /_analyze for authenticated "users"
  #
  server {
      listen 8081;
 
      auth_basic  "Elasticsearch Users";
      auth_basic_user_file /etc/nginx/conf.d/users;
 
      location / {
        return 403;
      }
 
      location ~* ^(/_search|/_analyze) {
        proxy_pass http://elasticsearch;
        proxy_redirect off;
      }
  }
 
  # Allow access to anything for authenticated "admins"
  #
  server {
      listen 8082;
 
      auth_basic  "Elasticsearch Admins";
      auth_basic_user_file /etc/nginx/conf.d/admins;
 
      location / {
        proxy_pass http://elasticsearch;
        proxy_redirect off;
      }
  }
 
}
```

现在，所有用户都能ping集群，但是做不了其他操作：
```
$ curl -i -X HEAD localhost:8080
# HTTP/1.1 200 OK
$ curl -i -X GET localhost:8080
# HTTP/1.1 403 Forbidden
```
user用户可以执行search，analyze请求，其他的不可以：
```
$ curl -i localhost:8081/_search
# HTTP/1.1 401 Unauthorized

$ curl -i user:user@localhost:8081/_search
# HTTP/1.1 200 OK

$ curl -i user:user@localhost:8081/_analyze?text=Test
# HTTP/1.1 200 OK

$ curl -i user:user@localhost:8081/_cluster/health
# HTTP/1.1 403 Forbidden

```
admin用户可以做任何操作:
```
$ curl -i admin:admin@localhost:8082/_search
# HTTP/1.1 200 OK

$ curl -i admin:admin@localhost:8082/_cluster/health
# HTTP/1.1 200 OK

```
这样轻松解决了基于多角色的授权，这么做的代价是：每一种角色都使用不同的端口。

<a name="LUUqk"></a>
# 参考
1、Tips to secure Elasticsearch clusters for free with encryption, users, and more：[https://www.elastic.co/cn/blog/tips-to-secure-elasticsearch-clusters-for-free-with-encryption-users-and-more](https://www.elastic.co/cn/blog/tips-to-secure-elasticsearch-clusters-for-free-with-encryption-users-and-more)

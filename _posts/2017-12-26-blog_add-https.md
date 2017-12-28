---
layout:     post
title:      cloudflare的免费https服务,给你的网站加一个S
subtitle:   blog_add-https
date:       2017-12-26
author:     Fe
header-img: img/post-bg-miku1.jpg
catalog: true
tags:
    - Blog
    - Https
---
>参考:[百度](https://baidu.com),[阳光早已褪色](http://blog.csdn.net/u011244202/article/details/57106544),[molunerfinn](https://molunerfinn.com/hexo-travisci-https/)   
>使用cloudflare给网站上个小锁,https服务    
>关于http和https的区别,可以看我的另一篇文章:[HTTP和HTTPS的区别](/2017/12/27/difference-between-http-and-https/)

## 前言  

由于购买了域名, `.github.io` 的证书不能用在我的 [fedemo.top](https://fedemo.top)上面了.

这使得我的网址前面没有了那把绿色的小锁,这使得我动起了https改造的念头.

刚好,在域名解析这边.百度云没有通知我就直接劫持了我的DNS,虽然认证完很快就解封了,不过还是给我留下了坏印象.  

在寻找其他DNS服务商的时候我发现了[cloudflare](https://www.cloudflare.com/)  

一个提供DNS,并且提供免费HTTPS服务的CDN提供商.  

本着分享精神,在这里写一个简单的教程,记录下我给我的博客加上HTTPS的过程

## 一、注册  

当然,第一步是注册了.    

由于[cloudflare](https://www.cloudflare.com/),是国外的网站,并且没有中文支持,英语差的可能有点苦手.

![](https://raw.githubusercontent.com/FeDemo/posts_img/master/2017-12-26-blog_add-https/1.png)

跟着提示一步步走就好了,过程略过......  

## 二、添加DNS解析

注册成功后,第二步就是添加DNS解析了,选择 **DNS**   

主要是添加两条A记录指向github pages,ip地址分别是`192.30.252.153`和`192.30.252.153`,然后再把 `www` 指向非 `www` 的地址(也可以把非 `www.` 的地址指向 `www.` 的地址)

![](https://raw.githubusercontent.com/FeDemo/posts_img/master/2017-12-26-blog_add-https/2.png)

接着需要将我们的DNS服务商的地址改成Cloudflare要求的两个DNS服务器地址:  

![](https://raw.githubusercontent.com/FeDemo/posts_img/master/2017-12-26-blog_add-https/3.png)  

一般会过24到48小时生效,不够不影响我们的使用  

## 三、开启HTTPS

第三步就需要我们使用cloudflare的HTTPS服务了,选择 **Crypto**  

开启SSL服务:  

![](https://raw.githubusercontent.com/FeDemo/posts_img/master/2017-12-26-blog_add-https/4.png)

这里的实现原理其实是用户到 **cloudflare** 服务器的连接为https，而 **cloudflare** 到 **GithubPage** 服务器的连接为http，就是在CDN服务器那里加上反向代理。
到这里,我们就可以使用cloudflare的证书来进行https连接了.

## 四、重定向HTTP访问到HTTPS

这个时候我们访问[https://fedemo.top](https://fedemo.top)自然走的是HTTPS。但是如果有人访问了[http://fedemo.top](http://fedemo.top)，那要如何跳转到HTTPS的页面呢？CloudFare另一个很棒的功能 **Page Rules** 就派上用场了。我们可以指定我们的域名强制使用HTTPS，并且当访问是HTTP的时候重定向到HTTPS。这样就能保证用户访问我们的页面都是通过HTTPS的了。

![](https://raw.githubusercontent.com/FeDemo/posts_img/master/2017-12-26-blog_add-https/5.png)

## 五、加入HSTS解析

上面说到，我们有可能访问自己的网站是走HTTP->304重定向->HTTPS。这个是浏览器跟服务器进行了一次通信之后才发生的跳转。那有没有可能做到，访问的是HTTP，但是浏览器识别之后自动转成HTTPS访问，而不经过重定向那一层操作呢？有的。通过HSTS的Preload List。

可以参考这篇文章对HSTS进行更深入的了解。简单来说，HSTS能够使我们的网站安全性更上一层楼。

还是CloudFare，它家自有的HSTS功能，开启之后就能很好的满足我们的需要。（真是完美了）还是在Crypto选项下，开启HSTS

![](https://raw.githubusercontent.com/FeDemo/posts_img/master/2017-12-26-blog_add-https/6.png)   

建议都使用默认的选项。

![](https://raw.githubusercontent.com/FeDemo/posts_img/master/2017-12-26-blog_add-https/8.png) 
然后可以去[HSTS Preload List](https://hstspreload.org/)的网站把我们的域名进行检查并收录（不能是子域名，必须是一级域名），如果没通过会给出修改建议，按照建议修改就行。如果通过了，就会放入审核列表。之后可以时不时回来看看自己的网站被收录了没有。我是等了快一周才被收录。网上的说法普遍是几周内。所以耐心等待收录。一旦被收录就会应用到主流浏览器上，这样你的网站就是更加安全的网站啦。

## 成果

最终:     
![](https://raw.githubusercontent.com/FeDemo/posts_img/master/2017-12-26-blog_add-https/7.png)
我的网站加上了一个代表安全的绿色的小锁,一本满足






<br>

---
layout:     post
title:      在Windows上安装Jekyll
subtitle:   blog_insert jekyll for windows
date:       2017-12-11
author:     Fe
header-img: img/post-bg-coffee.jpeg
catalog: true
tags:
    - Blog
    - Jekyll
---
>在本地调试你的博客  
>官网 [jekyllcn.com](http://jekyllcn.com)

# 在Windows上安装Jekyll
## 什么是Jekyll  

Jekyll 是一个简单的博客形态的静态站点生产机器。它有一个模版目录，其中包含原始文本格式的文档，通过一个转换器（如 Markdown）和我们的 Liquid 渲染器转化成一个完整的可发布的静态网站，你可以发布在任何你喜爱的服务器上。Jekyll 也可以运行在 GitHub Page 上，也就是说，你可以使用 GitHub 的服务来搭建你的项目页面、博客或者网站，而且是完全免费的。  

以上来自官网介绍翻译  
上官网 [jekyllcn.com](http://jekyllcn.com)

## 为什么需要Jekyll

在github上搭建的博客,由于github自带 **Jekyll** .所以才会识别我们的Jekyll项目.  
如果我们只是纯粹的书写markdown格式的文章,那么的确不需要安装Jekyll,可以如果想对博客进行样式以及一些小功能的修改,那么久需要不停的改代码F5了.如果没有安装Jekll,我们得不停的commit,push.这样一来延迟较大,有时提交了代码可能要等个十几分钟才更新,二来这样会污染我们的git history记录,会形成很多不必要的记录,不利于查看维护.

## 安装Jekyll
#### Jekyll依赖

安装 Jekyll 相当简单，但是你得先做些准备:
- Ruby:(rubyinstaller-2.2.5-x64.exe)
- DevKit:(DevKit-mingw64-32-4.7.2-20130224-1151-sfx.exe)  

以上是我使用的版本号,可以参考一下    
下载地址:[点我下载](https://rubyinstaller.org/downloads/archives/)  
![](https://raw.githubusercontent.com/FeDemo/posts_img/master/2017-12-11-blog_insert-jekyll-for-windows/1.png)

#### 下载安装

- 从rubyinstaller下载安装包并安装,把该钩的都√上  

    ![rubyinstaller](https://raw.githubusercontent.com/FeDemo/posts_img/master/2017-12-11-blog_insert-jekyll-for-windows/2.png)

- 把安装的DevKit点开解压,可以放在ruby的同一目录

    ![DevKit](https://raw.githubusercontent.com/FeDemo/posts_img/master/2017-12-11-blog_insert-jekyll-for-windows/3.png)

#### cmd命令

1. 通过 开始→运行→cmd→打开命令行窗口
2. 进入DevKit解压的目录,我是放在和ruby同一目录的.  
    `> G:`  
    `> cd G:\Ruby22-x64`
3. 生成config.xml配置文件，该配置文件中包含了前面的Ruby安装目录 （G:\Ruby22-x64）  
    `> ruby dk.rb init`
4. 安装dk.rb  
    `> ruby dk.rb install`
5. 安装Jekyll  
    `> gem install jekyll`
6. 安装jekyll-paginate  
    `> gem install jekyll-paginate`
7. 测试:输入`jekyll -v`查看版本号,是否安装成功

## 一些Error
####  连接超时
在第五步安装Jekyll时，可能会报错
```
ERROR:  Could not find a valid gem 'sass' (>= 0), here is why:
Unable to download data from .... (http://rubygems.org/latest_specs.4.8.gz)
```
这是因为被墙了,连接超时,GFW无敌!
- 解决方案1  
翻墙，挂vpn保证连接顺畅

- 解决方案2
通过连接国内镜像网站:[http://gems.ruby-china.org/](http://gems.ruby-china.org/)    
将该网站加入gem sources   
`gem sources -a http://gems.ruby-china.org/`  
成功会有success提示  
重试下`> gem install jekyll`就好了

## 使用jekyll本地查看网页

```
  cd 项目地址
  jekyll serve
```
接着在浏览器上输入[http://127.0.0.1:4000](http://127.0.0.1:4000),可以查看我们的博客了

## Star
如果觉得这篇教程还有点用，请点播关注，给我的[github仓库](https://github.com/FeDemo/fedemo.github.io) 点个 **star** 吧！

![](https://raw.githubusercontent.com/FeDemo/posts_img/master/star.png)

点上面 **↑** 那个星星

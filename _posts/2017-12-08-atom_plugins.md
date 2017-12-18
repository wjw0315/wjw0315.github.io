---
layout:     post
title:      Atom插件推荐
subtitle:   atom_plugins
date:       2017-12-08
author:     Fe
header-img: img/post-bg-android.jpg
catalog: true
tags:
    - Atom
---
>Atom插件推荐  
小清新的Atom

## 前言

Atom是一款由github推出额开源且免费的文本编辑器.  
所以,有很多用户自行开发的开源插件,我们可以很方便的安装这些插件.  
虽然ATOM打开大文件是硬伤，不过有这些插件用起来真的是很顺手,Atom大法好.

## 插件目录

汉化插件: [simplified-chinese-menu](https://github.com/chinakids/atom-simplified-chinese-menu)  
miku插件:
[atom-miku](https://github.com/sunqibuhuake/atom-miku)  

## 插件安装
#### Atom下载

需要使用Atom插件,首先你需要下载一个Atom.
可以参考一下我的另一篇文章:
[Atom初体验](/2017/11/26/atom_first/)

#### 使用Atom自带的插件安装入口

setting → install → 搜索 → 安装install   
推荐会翻墙有VPN人事使用,我直接下就没成功过 OTZ  
![](https://raw.githubusercontent.com/FeDemo/posts_img/master/2017-12-08-atom_plugins/1.png)

#### 使用命令行安装(推荐)
依赖:
- git
- 配置amp环境变量  
在atom里找到amp/bin的位置,一般在  `C:\Users\Administrator\AppData\Local\atom\app-1.22.1\resources\app\apm\bin`  
将其配置至path,测试输入`amp`是否成功    

安装插件:
- 进入atom存放插件的文件夹  
`cd C:\Users\Administrator\.atom\packages`
- 从github中把项目clone到本地  
`git clone $url(git资源地址)`   
git资源地址见下图
![](https://raw.githubusercontent.com/FeDemo/posts_img/master/2017-12-08-atom_plugins/2.png)  
- 进入clone的文件夹  
`cd atom-asciidoc-preview`
- 安装插件  
`apm install`  
如果apm不能识别请用 `npm install atom-miku`
- 成功

## 插件介绍
#### 汉化插件

[simplified-chinese-menu](https://github.com/chinakids/atom-simplified-chinese-menu)  
大部分的菜单都有汉化,是一款很好用的插件
![](https://raw.githubusercontent.com/FeDemo/posts_img/master/2017-12-08-atom_plugins/simplified-chinese-menu.png)

#### miku插件

[atom-miku](https://github.com/sunqibuhuake/atom-miku)
Miku能从你的代码中得到获得充能！  
可以让你更效率的撸代码  
总之是个好东西  
![](https://raw.githubusercontent.com/FeDemo/posts_img/master/2017-12-08-atom_plugins/atom_miku.gif)   

**可能出现的BUG**   
- Jquery版本错误
  ```
  At Cannot find module 'jquery'

  Error: Cannot find module 'jquery'
      at Module._resolveFilename (module.js:336:15)
      at Function.Module._resolveFilename (C:\Users\Administrator\Desktop\Atom\resources\app.asar\src\module-cache.js:383:52)
      at Function.Module._load (module.js:286:25)
      ......
  ```  
  解决方案(来自[yfd0101](https://github.com/sunqibuhuake/atom-miku/issues/20)):
  ```
  换个jQuery库，不要用3.1.0版本的jQuery，换成老版本的就可以运行了，比如，我用的JQuery2.2.0，并且你必须把把他改成JQuery,js，不然会提示找不到JQuery模块。
  路径是：C:\Users\yourname.atom\packages\atom-miku\node_modules\jquery\dist\JQuery.js
  （You can replace the JQuery3.x.0 with a older JQuery.js！For example ,I use the JQuery2.2.0,and you must rename the JQuey2.2.0.js to JQuery.js,）
  ```
  <br>
- 读取onDidChange失败
  ```
  At Cannot read property 'onDidChange' of undefined

  TypeError: Cannot read property 'onDidChange' of undefined
      at Object.module.exports.AtomMiku.activate(/Users/bluse/.atom/packages/atom-miku/lib/main.js:40:29)  
      ......
  ```
  解决方法(来自[smancang](https://github.com/sunqibuhuake/atom-miku/issues/6)):
  ```
  这是因为当前没有active的页签 所以失败 ，重启atom，随便打开个文件，再ctrl+alt+k 就不会出错了
  This is because there is no active tab.Restart atom,open a file any one you like,then press ctrl+alt +k, it works.
  ```

  <br>
- 没有安装成功
```
At C:\Users\admin\.atom\packages\atom-miku\lib\miku-view.js:108
TypeError: Cannot read property 'addFrame' of undefined
    at MikuView.module.exports.MikuView.addFrame (C:\Users\admin\.atom\packages\atom-miku\lib\miku-view.js:108:26)
    at C:\Users\admin\.atom\packages\atom-miku\lib\main.js:41:27
    ......
```
解决方法:
```
apm install atom-miku
如果apm不能识别请用 npm install atom-miku
```

## Star

如果觉得这篇教程还有点用，请点播关注，给我的[github仓库](https://github.com/FeDemo/fedemo.github.io) 点个 **star** 吧！

![](https://raw.githubusercontent.com/FeDemo/posts_img/master/star.png)

点上面 **↑** 那个星星

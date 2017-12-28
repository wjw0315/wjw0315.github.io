---
layout:     post
title:      JS window.location对象笔记,url解剖
subtitle:   http_window.location
date:       2017-12-21
author:     Fe
header-img: img/post-bg-ios9-web.jpg
catalog: true
tags:
    - Http
    - JS
---
>参考:[W3C](http://www.w3school.com.cn),[hebedich](http://www.jb51.net/article/57407.htm)  
>window.location对象笔记

## 前言

location是一个常用的对象,我们可以通过他获得有关当前 **URL** 的信息   

PS: window.location等价于document.location，可以交换使用

关于他的属性以及一些方法却一直记得不是很熟,在这里做一个简单的笔记,方便以后查看


## Location

>一个例子

URL:  [http://127.0.0.1:4000/2017/12/21/http_window.location/?name=fedemo&&id=001#cn](/)  

#### Location 对象属性

这八个属性都是可读写的,我们可以设置或返回其中的数据  
但是只有修改href与hash还有意义,location.href会重新定位到一个URL，而修改location.hash会跳到当前页面中的anchor(``<a id="name">``或者`<div id="id">`等)名字的标记(如果有)，而且页面不会被重新加载

|属性|描述|值|
|:-:|:-:|:-:|
|hash|从井号 (#) 开始的 URL（锚）|#cn|
|host|主机名和当前 URL 的端口号|4000|
|hostname|当前 URL 的主机名|127.0.0.1|
|href|完整的 URL|http://127.0.0.1:4000/2017/12/21/http_window.location/?name=fedemo&&id=001#cn|
|pathname|当前 URL 的路径部分|/2017/12/21/http_window.location/|
|port|当前 URL 的端口号|4000|
|protocol|当前 URL 的协议|http|
|search|从问号 (?) 开始的 URL（查询部分）|?name=fedemo&&id=001|

PS: `hash`和`search`,实质上是截取第一个#(?)之后的字段    
<br>
#### Location 对象方法

|属性|描述|
|:-:|:-:|
|assign()|加载新的文档|
|reload()|重新加载当前文档|
|replace()|用新的文档替换当前文档|  

>location.assign( url )

location.assign('http://www.baidu.com'); 等价于 window.location = 'http://www.baidu.com'   

这种方式会将新地址放到浏览器历史栈中，意味着转到新页面后“后退按钮”仍可以回到该页面。

>location.reload( force )

重新载入当前页面。force为true时从服务器端重载；false则从浏览器缓存中重载，默认值false。

>location.replace( url )

与assign方法一样，但会从浏览器历史栈中删除本页面，也就是说跳转到新页面后“后退按钮”不能回到该页面。   

目前IE、Chrome只是简单的跳转，只有Firefox会删除本页面的历史记录。
## 对象描述

Location 对象存储在 Window 对象的 Location 属性中，表示那个窗口中当前显示的文档的 Web 地址。它的 href 属性存放的是文档的完整 URL，其他属性则分别描述了 URL 的各个部分。这些属性与 Anchor 对象（或 Area 对象）的 URL 属性非常相似。当一个 Location 对象被转换成字符串，href 属性的值被返回。这意味着你可以使用表达式 location 来替代 location.href。

不过 Anchor 对象表示的是文档中的超链接，Location 对象表示的却是浏览器当前显示的文档的 URL（或位置）。但是 Location 对象所能做的远远不止这些，它还能控制浏览器显示的文档的位置。如果把一个含有 URL 的字符串赋予 Location 对象或它的 href 属性，浏览器就会把新的 URL 所指的文档装载进来，并显示出来。

除了设置 location 或 location.href 用完整的 URL 替换当前的 URL 之外，还可以修改部分 URL，只需要给 Location 对象的其他属性赋值即可。这样做就会创建新的 URL，其中的一部分与原来的 URL 不同，浏览器会将它装载并显示出来。例如，假设设置了Location对象的 hash 属性，那么浏览器就会转移到当前文档中的一个指定的位置。同样，如果设置了 search 属性，那么浏览器就会重新装载附加了新的查询字符串的 URL。

除了 URL 属性外，Location 对象的 reload() 方法可以重新装载当前文档，replace() 可以装载一个新文档而无须为它创建一个新的历史记录，也就是说，在浏览器的历史列表中，新文档将替换当前文档。

## url

url: 统一资源定位符 / Uniform Resource Locator

统一资源定位符是对可以从互联网上得到的资源的位置和访问方法的一种简洁的表示，是互联网上标准资源的地址。互联网上的每个文件都有一个唯一的URL，它包含的信息指出文件的位置以及浏览器应该怎么处理它。   

它最初是由蒂姆·伯纳斯·李发明用来作为万维网的地址。现在它已经被万维网联盟编制为互联网标准RFC1738了。










<br><br><br><br>

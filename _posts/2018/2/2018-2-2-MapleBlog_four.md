---
layout:     post
title:      SSM博客实战(4)–二级菜单的实现
subtitle:   MapleBlog_four
date:       2018-2-2
author:     wjw
header-img: img/home-bg-o.jpg
catalog: true
tags:
    - MapleBlog
---
## SSM博客实战(4)–二级菜单的实现

二级菜单的实现效果：
![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018-2-2-MapleBlog_four/2.png)

数据库表：

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018-2-2-MapleBlog_four/1.png)

其中 category_pid 表是父级分类的id，category_pid=0表示为该分类为一级目录，category_pid=1表示该分类为id=1的子分类...category_order 是分类的排序.

### 视图层代码

 jsp 页面代码
```
    <c:forEach items="${categoryList}" var="category">
             <c:if test="${category.pid==0}">
                 <li>
                     <a href="#">
                         <i class="${category.icon}"></i>
                         <span class="font-text">${category.name}&nbsp;</span>
                     </a>
                     <ul>
                         <c:forEach items="${categoryList}" var="cate">
                             <c:if test="${cate.pid==category.id}">
                                 <li>
                                     <a href="#">${cate.name}</a>
                                 </li>
                             </c:if>
                         </c:forEach>
                     </ul>
                 </li>
             </c:if>
         </c:forEach>
```

***其实，主要是用了两个 forEach 语句和 if 语句***


## Star
如果觉得这篇教程还有点用，请点播关注，给我的<a href="https://github.com/wjw0315/wjw0315.github.io" target="view_window">github仓库</a> 点个 **star** 吧，谢谢！

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/star.png)

点上面 **↑** 那个星星

---
layout:     post
title:      Markdown语法写博客
subtitle:   markdown_edit
date:       2018-1-31
author:     wjw
header-img: img/post-bg-rwd.jpg
catalog: true
stickie: true
tags:
    - markdown
---
>下面是基本markdown编写博文的教程  

-
## 文章的格式

每一篇文章文件命名采用的是`2017-02-04-Hello_edit.md`时间+标题的形式，空格用`-`替换连接。

文件的格式是 `.md` 的 <a href="http://sspai.com/25137/" target="view_window">MarkDown</a> 文件。

我们的博客文章格式采用是 **MarkDown**+ **YAML** 的方式。

<a href="http://www.ruanyifeng.com/blog/2016/07/yaml.html?f=tt" target="view_window">YAML</a> 就是我们配置 `_config`文件用的语言。

<a href="http://sspai.com/25137/" target="view_window">MarkDown</a> 是一种轻量级的「标记语言」，很简单。<a href="http://sspai.com/25137/" target="view_window">花半个小时看一下</a>就能熟练使用了

## 这是页头的格式
  ```
  ---
  layout:     post                  #不要管他
  title:      Markdown语法写博客      #标题
  subtitle:   markdown_edit         #别名,简介,标题下面的那一行字
  date:       2018-1-31             #发表时间
  author:     wjw                   #作者
  header-img: img/post-bg-rwd.jpg   #背景图片
  catalog: true                     #是否开启目录       
  tags:                             #标签,可以有多个
      - markdown
  ---
  ```
按格式创建文章后，提交保存。进入你的博客主页，新的文章将会出现在你的主页上.

## markdown基本语法格式<br><br>

### 标题
这是最为常用的格式，在平时常用的的文本编辑器中大多是这样实现的：输入文本、选中文本、设置标题格式。

而在 Markdown 中，你只需要在文本前面加上 **#** 即可，同理、你还可以增加二级标题、三级标题、四级标题、五级标题和六级标题，总共六级，只需要增加 **#** 即可，标题字号相应降低。

>注：# 和「一级标题」之间建议保留一个字符的空格，这是最标准的 Markdown 写法。

你可以你的编辑器中尝试输入这六级标题，可以参考下方的截图：

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018-1-31-markdown_edit/1.png)

### 列表
列表格式也很常用，在 Markdown 中，你只需要在文字前面加上 **-** 就可以了。<br>
如果你希望有序列表，
也可以在文字前面加上 `1. 2. 3.` 就可以了，

>注：`-、1.` 和文本之间要保留一个字符的空格。

列表案例截图如下：
![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018-1-31-markdown_edit/2.png)

### 链接和图片
在 Markdown 中，插入链接不需要其他按钮，你只需要使用 `[显示文本](链接地址)` 这样的语法即可，例如：<br>
`[简书](http://www.jianshu.com)`

在 Markdown 中，插入图片不需要其他按钮，你只需要使用 `[图片上传失败...(image-5fdc5-1510890177031)]` 这样的语法即可，例如：

`![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018-1-31-markdown_edit/1.png)`

### 引用

在我们写作的时候经常需要引用他人的文字，这个时候引用这个格式就很有必要了，在 Markdown 中，你只需要在你希望引用的文字前面加上 `>` 就好了，例如：

`> 一盏灯， 一片昏黄`

显示结果为：

>一盏灯， 一片昏黄

### 斜体和粗体

Markdown 的粗体和斜体也非常简单，用两个 `*` 包含一段文本就是粗体的语法，用一个 `*` 包含一段文本就是斜体的语法。例如：

`*一盏灯*， **一片昏黄**`

显示结果为

*一盏灯*， **一片昏黄**

### 代码引用

需要引用代码时，如果引用的语句只有一段，不分行，可以用 ` 将语句包起来。
如果引用的语句为多行，可以将```置于这段代码的首行和末行。
代码引用的案例截图：

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018-1-31-markdown_edit/3.png)

### 表格

相关代码：

```
|Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
```
显示结果为

|Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

相关代码：

```
dog | bird | cat
----|------|----
foo | foo  | foo
bar | bar  | bar
baz | baz  | baz
```
显示结果：

dog | bird | cat
----|------|----
foo | foo  | foo
bar | bar  | bar
baz | baz  | baz




## Star
如果觉得这篇教程还有点用，请点播关注，或者给我的<a href="https://github.com/wjw0315/wjw0315.github.io" target="view_window">github仓库</a> 点个 **star** 吧！

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/star.png)

点上面 **↑** 那个星星

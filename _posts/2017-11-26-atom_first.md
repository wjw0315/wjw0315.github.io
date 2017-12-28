---
layout:     post
title:      Atom初体验
subtitle:   atom_first
date:       2017-11-26
author:     Fe
header-img: img/post-bg-github-cup.jpg
catalog: true
tags:
    - Atom
---
>小清新   
>汉化插件   
>菜单翻译  
>使用Atom来编写Markdown   

## 前言

### 一些想说的话  

接触*Atom*是在下载*GitHub DesTop*的同时,当时我通过客服端把我的项目clone下来.在想能不能直接在上面直接修改我的项目,实在不行查看下也好啊,然而并没有发现有这个按钮.只可以查看到HisTory的历史修改记录,并不能查看整个项目.要查看只能点开clone下来的文件夹.这时,我发现了一个软件.每错,这就是**Atom**.

当我下下来之后,深黑色的界面,简洁的操作系统.这不就是*Sublime*么.  
第一眼看上去这两个编辑器真的很像,不过在用了之后感觉*Atom*有些小优化比*sublime*人性化多了.比如可以很轻松的做到多屏分页,查看项目更直观,可以直接修改编码,开源,对git原生支持,最重要的是**颜值**比sublime高啊.

所以,在这里强力安利Atom!

PS:现在已经完全替换Sublime了

### Atom

Atom 是github专门为程序员推出的一个跨平台文本编辑器。具有简洁和直观的图形用户界面，并有很多有趣的特点：支持CSS，HTML，JavaScript等网页编程语言。它支持宏，自动完成分屏功能，集成了文件管理器。  

支持CSS，HTML，JavaScript等网页编程语言。它支持宏，自动完成分屏功能，集成了文件管理器。

通过丰富的插件机制可以完成各种语言开发, 常用于web 开发, 也可用于 php 等后端开发.

---
>该部分更新于2017-12-5

### 汉化插件安装


发现一个好用的Atom汉化插件：
[simplified-chinese-menu](https://atom.io/packages/simplified-chinese-menu)


只要把插件项目clone到  ` (用户名)\Administrator\.atom\packages `  后再打开Atom就可以了
Atom会自动识别插件

---

## 下载


我们可以github的本地客服端[GitHub Desktop](https://desktop.github.com/)直接打开并下载并打开Atom:    

![Atom](https://raw.githubusercontent.com/FeDemo/posts_img/master/2017-11-26-atom_first/1.png)  

点击这个按钮会自动跳转至官网: [Atom](https://atom.io/) 点击Download下载就好了   

![AtomDown](https://raw.githubusercontent.com/FeDemo/posts_img/master/2017-11-26-atom_first/2.png)   

当然如果网速不够也不会翻墙也可选择直接[百度](https://www.baidu.com)

## 使用

### 菜单翻译
>菜单翻译转自[http://blog.csdn.net/crper](http://blog.csdn.net/crper/article/details/51420731)  

#### File菜单翻译  

|快捷键|英文|中文|作用|
|:-------------:|:-------------:|:-------------:|:-------------:|
|ctrl+shift+N |	New Window |	新窗口 |	新建一个atom编辑器视图窗|
|ctrl+n 	|New File 	|新建文件| 	新建一个普通文本文件|
|ctrl+o |	Open File |	打开文件 |	从某个路径打开需要编辑的文件|
|ctrl+shift+o |	Open Folder |	打开目录 |	打开工作目录|
|*ctrl+shift+t |	Reopen Closed File |	重新打开关闭文件 |	最近关闭的文件，有历史记录|
|ctrl+comma |	settings |	设置中心 |	comma就是逗号键|
|ctrl+s |	Save |	保存 |	保存当前编辑的文件|
|ctrl+shift+s |	Sava As |	另存为 |	把编辑的文件保存到其他位置|
|ctrl+w |	Close Tab |	关闭标签页 |	就是当前编辑的编辑窗口页面|
|ctrl+shift+w |	Close Window |	退出编辑器 |	如中文所示，关闭Atom|  

#### Edit【编辑】  

|快捷键|英文|中文|作用|
|:-------------:|:-------------:|:-------------:|:-------------:|
|ctrl+z |	Undo |	撤销 |	返回上一步|
|ctrl+y |	Redo |	重做 |	很少用|
|ctrl+x |	Cut |	剪切 |	如中文所示|
|ctrl+c |	Copy |	复制 |	如中文所示|
|ctrl+shift+c |	Copy Path |	复制文件路径 |	当前编辑文件的路径|
|ctrl+v |	Paste |	粘贴 |	如中文所示|
|ctrl+a |	Select All |	全选 |	选择全文|
|ctrl+/ |	Toggle Command |	注释 |	如中文所示|
|ctrl+] |	Indent |	缩进 |	如中文所示|
|ctrl+[ |	outdent |	回退缩进 |	有点类似撤销，与缩进相反|
|alt+shift+left |arrow 	Move Selection Left 	|移动选择到左边 |	意思就是你选定部分内容到光标前一个位置|
|alt+shift+right |arrow 	Move Selection Right |	移动选择到右边 |	一致|
|ctrl+del[Delete] |	Delete to End of Word 	|删除当前光标处到词尾结束部分 |	就是删除范围在单词内|
|ctrl+shift+k |	Delete Line |	删除行 	|删除光标处的行|
|ctrl+alt+] 	|Fold 	|展开段落 	|展开代码块|
|ctrl+alt+[ | 	Unfold |	折叠段落 |	就是折叠代码块|
|ctrl+alt+shift+] |	Unfold All |	展开所有折叠段落| 	展开所有折叠代码块|
|ctrl+alt+shift+[ |	Fold All |	折叠所有段落 |	折叠所有可折叠的代码块|
|ctrl+alt+q |	Reflow Selection |	浮动选择区域 	|意思就是你选择的区域会变成流动布局，一般是行内容追加在上一行后面|
|ctrl+shift+u 	|Select Encoding |	选择文件编码 |	如中文所示|
|ctrl+g |	Go to Line |	跳转到某行 |	跳转|
|ctrl+shift+l |	Select Grammar |	选择语法格式 |	其实就是什么格式的文件|
|ctrl+f2 |	View All |	查看所有书签【切换跳到书签位置】 |	书签是个很实用的功能|
|ctrl+alt+f2 |	Toggle Bookmark |	是否在光标处设置标签 |	如中文所示|
|f2 	|Jump to Next Bookmark |	跳到下一个标签位置 |	如中文所示|
|ctrl+f2 |	Jump to Previour Bookmark |	跳到上一个标签位置 |	如中文所示|  

#### View【视图】  

|快捷键|英文|中文|作用|
|:-------------:|:-------------:|:-------------:|:-------------:|
|F11 |	Toggle Full Screen 	|切换全屏 	|如中文所示|
|ctrl+alt+r |	Reload Window |	重新加载窗口 |	跟重开编辑器差不多|
|ctrl+alt+p |	Run Package Specs 	|让包执行特定模式 	|具体不晓得|
|ctrl+alt+i |	Toggle Developer Tools |	打开开发者工具| 	就是chrome的调试工具|
|ctrl+shift+= |	Increase Font Size| 	加大编辑窗口字体字号 |	如中文所示|
|ctrl+shift+-| 	Decrease Font Size |	减小编辑窗口字体字号 |	如中文所示|
|ctrl+0 	|Resset Font Size |	重置字体字号 |	恢复默认大小|
|*ctrl+alt+O |	Toggle Symbols-Tree-View |	文件索引 |	这个是插件的|
|ctrl+\ |	Toggle Tree View 	|是否展开目录树 	|执行这个默认会聚焦侧边栏|
|ctrl+shift+p 	|Toggle Command Plaette |	打开全局命令片段 |	最强大的功能|  

#### Selection【选择】  

|快捷键|英文|中文|作用|
|:-------------:|:-------------:|:-------------:|:-------------:|
|ctrl+alt+up| arrow 	Add Selection Above |	选择选区到上一行| 	就是选定部分区域追加到上一行选定|
|ctrl+alt+down| arrow 	Add Selection Below |	选择选区到下一行 |	一致|
|Esc 	|Single Selection |	选择单行 |	没试出来|
|ctrl+shift+Home |	Select to Top |	光标处到顶部 |	全选功能的拆开，挺实用的|
|ctrl+shift+End |	Select to Bottom |	光标处到底部 |	全选功能的拆开，挺实用的|
|ctrl+l |	Select Line |	光标处一行选定 |	如中文所示|
|ctrl+shift+left| arrow 	Select to Begining of Word |	光标处到词头 |	也很实用|
|ctrl+shift+right| arrow 	Select to End of Word 	|光标处到词尾 |	也很使用|
|shift+home| 	Select to Character of Line 	|光标处到行首 	|如中文所示|
|shift+end |	Select to End of Line |	光标处到行尾 	|很实用|
|ctrl+alt+m |	Select inside Brackets |	选定括号内内容 |	就是括号，或者标签内的内容|

#### Find【搜索】  

|快捷键|英文|中文|作用|
|:-------------:|:-------------:|:-------------:|:-------------:|
|ctrl+f 	|Find in Buffer |	从缓存中找 	|换个理解就是编辑文件内查询|
|ctrl+alt+f 	|Replace in Buffer |	从缓存中查询替换 |	就是在文件内替换查找文本|
|ctrl+d |Select Next| 	查询及选定相同的内容 |	神器！|
|alt+F3 	|Select All |	全选文件内当前选定的内容| 	能匹配到的都选定，神器！|
|ctrl+shift+f |	Find in Project |	从工作目录查询 	|可以理解为全局搜索|
|f3 	|Find Next |	查询下一个 |	就是当前文件内查找的内容，下一个匹配的|
|shift+f3 	|Find Previous |	查询上一个 	|一致|
|ctrl+b |	Find Buffer |	展开缓存 |	就是当前打开的所有编辑文件|
|ctrl+p |	Find File| 	查询且打开文件 |	全局搜索文件名打开文件|
|ctrl+shift+b |	Find Modifiled File |	查询编辑的文件 |	没反应。。|

#### core[内置快捷键]  

|快捷键|英文|中文|作用|
|:-------------:|:-------------:|:-------------:|:-------------:|
|ctrl+r |	Toggle File Symbols |	文件内符号索引 |	很方便跳转，试用|

## Markdown  

Markdown是一种可以使用普通文本编辑器编写的标记语言，通过简单的标记语法，它可以使普通文本内容具有一定的格式。

Markdown具有一系列衍生版本，用于扩展Markdown的功能（如表格、脚注、内嵌HTML等等），这些功能原初的Markdown尚不具备，它们能让Markdown转换成更多的格式，例如LaTeX，Docbook。Markdown增强版中比较有名的有Markdown Extra、MultiMarkdown、 Maruku等。这些衍生版本要么基于工具，如Pandoc；要么基于网站，如GitHub和Wikipedia，在语法上基本兼容，但在一些语法和渲染效果上有改动。

### 为什么要用Atom书写Markdown

*Markdown*是一个轻量级的*标记语言*  
他的语法十分简单。常用的标记符号也不超过十个，这种相对于更为复杂的HTML 标记语言来说，Markdown 可谓是十分轻量的，学习成本也不需要太多，且一旦熟悉这种语法规则，会有一劳永逸的效果。

正式应为它的语法简单,以及很高的可读性,使得它非常适合用于书写.包括很多网站（例如简书）也支持了 Markdown 的文字录入。  

它使我们专心于码字，用「标记」语法，来代替常见的排版格式。例如此文从内容到格式，甚至插图，键盘就可以通通搞定了。   

在这,不过多赘述,有兴趣的可以看一下https://sspai.com/post/25137

### 需要强调的快捷键

有一个快捷键需要强调,就是**ctrl+shift+m**,使用这个快捷键可以调出Markdown预览,
可以一边编写一边查看效果,上图:    

![ctrl+shift+m](https://raw.githubusercontent.com/FeDemo/posts_img/master/2017-11-26-atom_first/3.png)  

对,那些表格就是这样画出来的,是不是很棒

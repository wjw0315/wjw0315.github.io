---
layout:     post
title:      SSM博客实战（一）–正则表达式去除html标签
subtitle:   MapleBlog_one
date:       2018-2-1
author:     wjw
header-img: img/home-bg-o.jpg
catalog: true
tags:
    - MapleBlog
---
## SSM博客实战（一）–正则表达式去除html标签


- 大部分博客网站的首页文章的内容都是截取了文章的一部分，然后点击“查看更多”才能看完整的文字。所以，截取字符串是必不可少的。

- 但是如果我们直接用 substring 截取，会出现很多问题。比如样式不会改变，加粗的，文字颜色都不会去掉。还有就是一个 html标签如<strong></strong>可能会被截成两段，导致后面的文字全部加粗之类的。这种情况绝不允许。
- 就像下图中截取不当使得文字上出现颜色
 
![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018-2-1-MapleBlog_one/1.png)

> 除去HTML标签的实现

### java的实现：

```
import java.util.regex.Matcher;
import java.util.regex.Pattern;
public class Demo {
    private static final String regEx_script = "<script[^>]*?>[\\s\\S]*?<\\/script>"; // 定义script的正则表达式
    private static final String regEx_style = "<style[^>]*?>[\\s\\S]*?<\\/style>"; // 定义style的正则表达式
    private static final String regEx_html = "<[^>]+>"; // 定义HTML标签的正则表达式
    private static final String regEx_space = "\\s*|\t|\r|\n";//定义空格回车换行符
    /**
     * @param htmlStr
     * @return
     *  删除Html标签
     */
    public static String delHTMLTag(String htmlStr) {
        Pattern p_script = Pattern.compile(regEx_script, Pattern.CASE_INSENSITIVE);
        Matcher m_script = p_script.matcher(htmlStr);
        htmlStr = m_script.replaceAll(""); // 过滤script标签
        Pattern p_style = Pattern.compile(regEx_style, Pattern.CASE_INSENSITIVE);
        Matcher m_style = p_style.matcher(htmlStr);
        htmlStr = m_style.replaceAll(""); // 过滤style标签
        Pattern p_html = Pattern.compile(regEx_html, Pattern.CASE_INSENSITIVE);
        Matcher m_html = p_html.matcher(htmlStr);
        htmlStr = m_html.replaceAll(""); // 过滤html标签
        Pattern p_space = Pattern.compile(regEx_space, Pattern.CASE_INSENSITIVE);
        Matcher m_space = p_space.matcher(htmlStr);
        htmlStr = m_space.replaceAll(""); // 过滤空格回车标签
        return htmlStr.trim(); // 返回文本字符串
    }
    public static String getTextFromHtml(String htmlStr){
        htmlStr = delHTMLTag(htmlStr);
        htmlStr = htmlStr.replaceAll(" ", "");
        htmlStr = htmlStr.substring(0,100);
        return htmlStr;
    }
    public static void main(String[] args) {
        String str = "ubuntu 安装 phpmyadmin  两种 （两者选一）:\n" +
            "<h4>1: apt-get 安装  然后使用 已有的虚拟主机目录建立软连接</h4>\n" +
            "<div class=\"dp-highlighter\">\n" +
            "<ol class=\"dp-xml\" start=\"1\">\n" +
            " \t<li class=\"alt\">sudo  apt-get install  phpmyadmin</li>\n" +
            " \t<li class=\"\">sudo  ln-s /usr/share/phpmyadmin/      /var/www/pma</li>\n" +
            "</ol>\n" +
            "</div>\n" +
            "<h4>2:手动上传</h4>\n" +
            "网上下载 phpmyadmin软件包,使用 filezilla 上传到 /var/www/pma (pma自己创建)\n" +
            "\n" +
            "使用 ip/pma 查看 phpmyadmin\n" +
            "\n" +
            "其实 还可以 考虑给phpmyadmin 配置虚拟主机\n" ;
         System.out.println(getTextFromHtml(str));
    }
}
```

### JSP 实现

这里我们需要 **自定义标签**
#### 1、在WEB-INF 下新建一个 myTag.dtd 文件
```
    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE taglib
            PUBLIC "-//Sun Microsystems, Inc.//DTD JSP Tag Library 1.2//EN"
            "http://java.sun.com/dtd/web-jsptaglibrary_1_2.dtd">
    <taglib>
        <tlib-version>1.0</tlib-version><!-- 代表标签库的版本号 -->
        <jsp-version>1.2</jsp-version><!-- 代表jsp的版本 -->
        <short-name>SimpleTag</short-name><!-- 你的标签库的简称 -->
       <!-- <uri>http://wjwcloud.com</uri>--><!-- 你标签库的引用uri -->
        <tag>
            <name>htmlFilter</name>
            <tag-class>com.wujiawei.blog.util.others.HtmlFilterTag</tag-class>
            <body-content>scriptless</body-content>
        </tag>
    </taglib>
```
注意：

`<short-name>`  和  `<uri>`  可以随便填

`<tag>` 标签内的 `<name>`  和下面的类名一致， `<tag-class>` 是类的地址， `<body-content>`  这里就填 scriptless好了，意思是标签体内可以放文本，jsp标签和其他任意标签

#### 2、在对应位置新建 HtmlFilterTag.java
```
    package com.wujiawei.blog.util.others;
    /**
     * Created by wjw 
     */
        import java.io.IOException;
        import java.io.StringWriter;
        import java.util.regex.Matcher;
        import java.util.regex.Pattern;
        import javax.servlet.jsp.JspException;
        import javax.servlet.jsp.PageContext;
        import javax.servlet.jsp.tagext.JspFragment;
        import javax.servlet.jsp.tagext.SimpleTagSupport;
    public class HtmlFilterTag extends SimpleTagSupport {
        private static final int subLength = 200; //截取字符串长度
        private static final String regEx_script = "<script[^>]*?>[\\s\\S]*?<\\/script>"; // 定义script的正则表达式
        private static final String regEx_style = "<style[^>]*?>[\\s\\S]*?<\\/style>"; // 定义style的正则表达式
        private static final String regEx_html = "<[^>]+>"; // 定义HTML标签的正则表达式
        private static final String regEx_space = "\\s*|\t|\r|\n";//定义空格回车换行符
        public static String filter(String htmlStr) {
            Pattern p_script = Pattern.compile(regEx_script, Pattern.CASE_INSENSITIVE);
            Matcher m_script = p_script.matcher(htmlStr);
            htmlStr = m_script.replaceAll(""); // 过滤script标签
            Pattern p_style = Pattern.compile(regEx_style, Pattern.CASE_INSENSITIVE);
            Matcher m_style = p_style.matcher(htmlStr);
            htmlStr = m_style.replaceAll(""); // 过滤style标签
            Pattern p_html = Pattern.compile(regEx_html, Pattern.CASE_INSENSITIVE);
            Matcher m_html = p_html.matcher(htmlStr);
            htmlStr = m_html.replaceAll(""); // 过滤html标签
            Pattern p_space = Pattern.compile(regEx_space, Pattern.CASE_INSENSITIVE);
            Matcher m_space = p_space.matcher(htmlStr);
            htmlStr = m_space.replaceAll(""); // 过滤空格回车标签
            return htmlStr.trim(); // 返回文本字符串
        }
        @Override
        public void doTag() throws JspException, IOException {
            StringWriter sw = new StringWriter();
            JspFragment jf = this.getJspBody();
            jf.invoke(sw);
            String content = sw.getBuffer().toString();
            content = filter(content);
            content = content.replaceAll(" ", "");
            int contentLength =content.length();
            if(contentLength>subLength) {
                content = content.substring(0,subLength);
            } else {
                content = content.substring(0,contentLength);
            }
            ((PageContext) this.getJspContext()).getOut().write(content);
        }
    }
```
注意：

大家也可以按照自己的需求，修改上面的代码

#### 3、在 jsp 里调用，以下是部分 jsp 代码
```
    <%@ page language="java" contentType="text/html; charset=UTF-8"
             pageEncoding="UTF-8"%>
    <%@ taglib uri="/WEB-INF/myTag.dtd" prefix="wjw"%>  
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="utf-8">
    </head>
    <body>
           <wjw:htmlFilter>  ${article.content} </wjw:htmlFilter>  
    </body>
    </html>
```
注意：

一定要引入 dtd 文件，注意你的路径，prefix 填你的标签前缀，比如我填的是 wjw，下面调用的话，前缀保持正确即可

4、最终效果如下

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018-2-1-MapleBlog_one/2.png)

## Star
如果觉得这篇教程还有点用，请点播关注，给我的<a href="https://github.com/wjw0315/wjw0315.github.io" target="view_window">github仓库</a> 点个 **star** 吧，谢谢！

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/star.png)

点上面 **↑** 那个星星

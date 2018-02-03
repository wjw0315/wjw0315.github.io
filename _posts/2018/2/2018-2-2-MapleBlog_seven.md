---
layout:     post
title:      SSM博客实战(7)-springmvc和layui富文本编辑器实时上传图片功能实
subtitle:   MapleBlog_seven
date:       2018-2-2
author:     wjw
header-img: img/home-bg-o.jpg
catalog: true
tags:
    - MapleBlog
---
## SSM博客实战(7)-springmvc和layui富文本编辑器实时上传图片功能实现

>本文将介绍 springmvc 上传功能实现，以及layui 前端插件的使用，尤其是其富文本编辑器的上传图片接口的实现。

### 一、开发准备

1、layui 官网：http://www.layui.com/

点击"立即下载"可以获取前端框架，没有使用过的朋友可以自行了解下。

下载好后，引入其核心 js 和 css 文件，可以测试是否按照成功。

2、layui 富文本编辑器文档：http://www.layui.com/doc/modules/layedit.html

3、几个必备的 依赖jar，用于上传和 json 数据返回

上传必备依赖

```
    <dependency>
        <groupId>commons-fileupload</groupId>
        <artifactId>commons-fileupload</artifactId>
        <version>1.2.2</version>
      </dependency>
      <dependency>
        <groupId>commons-io</groupId>
        <artifactId>commons-io</artifactId>
        <version>2.4</version>
      </dependency>
```

json 依赖

```
    <dependency>
         <groupId>org.json</groupId>
         <artifactId>json</artifactId>
         <version>20170516</version>
       </dependency>
```
 
### 二、layui 代码部署

1、layui 完整的文件,那几个 js 文件 ，只需要引入 layui.all.js 即可，之前要引入 jQuery库

2、引入 核心 css 和 js 文件

css

```
    <link rel="stylesheet" href="${pageContext.request.contextPath}/plugin/layer/css/layui.css">
```

js

```
    <script src="${pageContext.request.contextPath}/js/jquery.min.js"></script>
    <script src="${pageContext.request.contextPath}/plugin/layer/layui.all.js"></script>
    <script>
        //JavaScript代码区域
        layui.use('element', function(){
            var element = layui.element;
        });
    </script>
```
 


3、实现一个编辑器

代码可以从 layui 官网导航上的 "文档"-->"表单"获取

地址：http://www.layui.com/demo/form.html

我们拷贝一段代码

```
    <form class="layui-form"  method="post" id="myForm" enctype="multipart/form-data">
        <div class="layui-form-item layui-form-text">
            <label class="layui-form-label">内容</label>
            <div class="layui-input-block">
                <textarea class="layui-textarea layui-hide" name="content" lay-verify="content" id="content"></textarea>
            </div>
        </div>
    </form>
```

注意：form表单的class需要加上 layui-form

textarea 标签的 name 和 id，要和下面一致

然后在 其后加上 js 文件创建一个 编辑器和让图片按钮能发送数据

```
    <script>
                layui.use(['form', 'layedit', 'laydate'], function() {
                 var form = layui.form
                   , layer = layui.layer
                   , layedit = layui.layedit
                   , laydate = layui.laydate;
               //上传图片,必须放在 创建一个编辑器前面
               layedit.set({
                   uploadImage: {
                        url: '${pageContext.request.contextPath}/uploadFile' //接口url
                       ,type: 'post' //默认post
                   }
               });
               //创建一个编辑器
               var editIndex = layedit.build('content',{
                       height:400
                   }
               );
          });
    </script>
```

注意：上传图片的代码必须放在 创建一个编辑器 前面

具体文档：http://www.layui.com/doc/modules/layedit.html

 

4、富文本编辑器效果预览：


![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018-2-2-MapleBlog_seven/2.png)
 
### 三、springmvc 实现上传功能

1、加入基本的 依赖

前面已经说了，上传需要两个 jar，另外我们需要返回 Json 数据，也需要一个 Json 的jar

 

2、spirngmvc.xml 配置文件上传

```
    <bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
        <!--设置上传最大尺寸为5MB-->
        <property name="maxUploadSizePerFile" value="5242880"/>
        <property name="defaultEncoding" value="UTF-8"/>
        <property name="resolveLazily" value="true"/>
    </bean>
```

***如果你发现，无法获得上传的文件，通常是没有添加此处代码***

 

3、新建一个上传文件的控制器

```
    package com.wujiawei.blog.controller.common;
    import org.apache.ibatis.annotations.Param;
    import org.json.JSONObject;
    import org.springframework.stereotype.Controller;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.ResponseBody;
    import org.springframework.web.multipart.MultipartFile;
    import javax.servlet.http.HttpServletRequest;
    import java.io.File;
    import java.io.IOException;
    import java.text.SimpleDateFormat;
    import java.util.Calendar;
    import java.util.Date;
    import java.util.HashMap;
    import java.util.Map;
    @Controller
    public class UploadFileController {
        //上传文件
        @ResponseBody
        @RequestMapping(value = "/uploadFile")
        public String uploadFile(HttpServletRequest request,@Param("file") MultipartFile file) throws IOException {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmssSS");
            String res = sdf.format(new Date());
            //服务器上使用
           // String rootPath =request.getServletContext().getRealPath("/resource/uploads/");//target的目录
            //本地使用
            String rootPath ="/uploads/";
            //原始名称
            String originalFilename = file.getOriginalFilename();
            //新的文件名称
            String newFileName = res+originalFilename.substring(originalFilename.lastIndexOf("."));
            //创建年月文件夹
            Calendar date = Calendar.getInstance();
            File dateDirs = new File(date.get(Calendar.YEAR)
                    + File.separator + (date.get(Calendar.MONTH)+1));
            //新文件
            File newFile = new File(rootPath+File.separator+dateDirs+File.separator+newFileName);
            //判断目标文件所在的目录是否存在
            if(!newFile.getParentFile().exists()) {
                //如果目标文件所在的目录不存在，则创建父目录
                newFile.getParentFile().mkdirs();
            }
            System.out.println(newFile);
            //将内存中的数据写入磁盘
            file.transferTo(newFile);
            //完整的url
            String fileUrl =  "/uploads/"+date.get(Calendar.YEAR)+ "/"+(date.get(Calendar.MONTH)+1)+ "/"+ newFileName;
            Map<String,Object> map = new HashMap<String,Object>();
            Map<String,Object> map2 = new HashMap<String,Object>();
            map.put("code",0);//0表示成功，1失败
            map.put("msg","上传成功");//提示消息
            map.put("data",map2);
            map2.put("src",fileUrl);//图片url
            map2.put("title",newFileName);//图片名称，这个会显示在输入框里
            String result = new JSONObject(map).toString();
            return result;
        }
    }
```

注意：

① 博主这里文件是上传到本地的 /uploads/ 目录，大家自行修改。待会儿还要在 Tomcat 或者 IDE 里配置静态资源虚拟映射(即55行的路径，/uploads )，才能在浏览器里访问图片

② 图片上传，以 年/月/文件名 形式储存，其中文件名是按时间自动命名

③ 第 55 行的是图片的 url，/ 表示根目录，会自动加上 域名的，大家可根据自己情况修改

④ 第 59-66 行代码是生产 以 Map 方式 创建JSON，最终返回给 前台

这里的 JSON，layui 是有要求的,如图

SSM博客实战(7)-springmvc和layui富文本编辑器实时上传图片功能实现

创建 JSON 的方法很多，这里不介绍了，记得 JSON 区分大小写，不支持注释 即可

关于 JSON 的大家可以百度或者上慕课网找教程

⑤ 这个方法的路径映射是 /uploadFile  要和 我们上面配置的 接口 url 一致，否则无法上传

 
四、静态资源虚拟路径配置

这里介绍两种方法。

1、Tomcat 的server.xml 里配置

如果使用IDE如IntellJ IDEA运行Tomcat，无效。如果是部署到服务器上，可以使用

打开 Tomcat 安装目录 下的 conf/server.xml

在 Host 标签里添加一行 context 配置即可，如下

```
    <Host name="localhost"  appBase="webapps"
             unpackWARs="true" autoDeploy="true">
         <!-- SingleSignOn valve, share authentication between web applications
              Documentation at: /docs/config/valve.html -->
         <!--
         <Valve className="org.apache.catalina.authenticator.SingleSignOn" />
         -->
         <!-- Access log processes all example.
              Documentation at: /docs/config/valve.html
              Note: The pattern used is equivalent to using pattern="common" -->
         <Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
                prefix="localhost_access_log." suffix=".txt"
                pattern="%h %l %u %t &quot;%r&quot; %s %b" />
                　<!-- 增加的静态资源映射配置 -->
        <Context path="/uploads" docBase="/uploads" reloadable="true" crossContext="true"></Context>
       </Host>
```

注意：

path 是服务器上的虚拟路径

docBase 是你的本地物理路径

比如，我在本地测试，项目地址(相当于域名)是 http://localhost:8090/MapleBlog

我要访问 /uploads/2017/9/1.png 这张图片，在浏览器上只需要输入

http://localhost:8090/MapleBlog/uploads/2017/9/1.png 就能访问

 

2、在IDE 里配置

因为我们通常是用 IDE 来运行 Tomcat，似乎这时候 本地Tomcat 安装目录的 配置不生效，暂时不追究

具体方法如下，因为博主用的是 IntelliJ IDEA，这里介绍IDEA 如果配置静态资源映射

（1） 点击右上角的Tomcat 配置

（2）点击 Deployment，点击下面的 加号 ，添加一条映射

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018-2-2-MapleBlog_seven/tomcat1.png)

 

因为我的项目文件夹的映射是 /Uploads ，所以这里前面也加了/Uploads，大家可根据自己情况填写


## Star
如果觉得这篇教程还有点用，请点播关注，给我的<a href="https://github.com/wjw0315/wjw0315.github.io" target="view_window">github仓库</a> 点个 **star** 吧，谢谢！

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/star.png)

点上面 **↑** 那个星星

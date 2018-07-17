---
layout:     post
title:      SSM博客实战(9)-拦截器验证权限和登录与注销的实现
subtitle:   MapleBlog_nine
date:       2018-2-2
author:     wjw
header-img: img/home-bg-o.jpg
catalog: true
stickie: true
tags:
    - MapleBlog
---
## SSM博客实战(9)-拦截器验证权限和登录与注销的实现

>本文将介绍通过拦截器验证权限和后台登录与注销。

拦截器的作用在于，比如我们输入 xxx.com/admin 发起请求进入 网站后台或者其他后台页面。我们的拦截器会在 Controller  调用之前进行拦截，至于什么拦截，由我们来写。比如，判断用户是否登录(可以通过 session 判断)，如果没有登录，我们让它跳转到登录页面。

### 一、拦截器的基本使用

#### 1、新建一个 拦截器

SecurityInterceptor.java

```
    package com.wujiawei.blog.Interceptor;
    import org.springframework.web.servlet.HandlerInterceptor;
    import org.springframework.web.servlet.ModelAndView;
    import javax.servlet.http.HttpServletRequest;
    import javax.servlet.http.HttpServletResponse;
    public class SecurityInterceptor implements HandlerInterceptor {
        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object o) throws Exception {
            System.out.println("SecurityInterceptor...preHandle...");
            //这里可以根据session的用户来判断角色的权限，根据权限来转发不同的页面
            if(request.getSession().getAttribute("userId") == null) {
                request.getRequestDispatcher("/login").forward(request,response);
                return false;
            }
            return true;
        }
        @Override
        public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {
        }
        @Override
        public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {
        }
    }
```

判断是否有 userId 这个session，如果没有(或者过期了)转发到登录页面

 

#### 2、配置 springmvc.xml

通过使用 mvc:interceptors 标签来声明需要加入到SpringMVC拦截器链中的拦截器。

```
    <mvc:interceptors>
          <mvc:interceptor>
              <mvc:mapping path="/admin"/>
              <bean class="com.wujiawei.blog.Interceptor.SecurityInterceptor"/>
          </mvc:interceptor>
          <mvc:interceptor>
              <mvc:mapping path="/admin/**"/>
              <bean class="com.wujiawei.blog.Interceptor.SecurityInterceptor"/>
          </mvc:interceptor>
      </mvc:interceptors>
```
 

只需两步，我们已经能成功拦截  /admin 和其其前缀的如 /admin/article 等其他所有路径啦。

 
### 二、登录实现

登录主要是验证该用户是否存在，密码是否正确。然后添加 session 和页面跳转

#### 1、登录表单

login.jsp

```
    <%
             String username = "";
             String password = "";
             //获取当前站点的所有Cookie
             Cookie[] cookies = request.getCookies();
             for (int i = 0; i < cookies.length; i++) {//对cookies中的数据进行遍历，找到用户名、密码的数据
                 if ("username".equals(cookies[i].getName())) {
                        username = cookies[i].getValue();
                 } else if ("password".equals(cookies[i].getName())) {
                     password = cookies[i].getValue();
                 }
             }
    %>
        <form name="loginForm" id="loginForm"  method="post">
                    <input type="text" name="username" id="user_login"
                               class="input" value="<%=username%>" size="20" required/></label>
                    <input type="password" name="password" id="user_pass"
                               class="input" value="<%=password%>" size="20" required/>
                     <input name="rememberme" type="checkbox" id="rememberme" value="1" /> 记住密码
                    <input type="button" name="wp-submit" id="submit-btn" class="button button-primary button-large" value="登录" />
        </form>
```

为了代码简洁，这里去掉了多余的标签和属性。我这里是扒了 wordpress 的登录页面，这里也用到了 cookie 。

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018-2-2-MapleBLog_nine/1.png)

注意：这里的 form 表单里没有 action 属性，最终发送数据通过 ajax 。同样，也没有 submit 按钮，为了防止 ajax+form+submit 导致 success 里无法页面跳转。

 

#### 2、js 代码

```
    <%--登录验证--%>
     $("#submit-btn").click(function () {
         var user = $("#user_login").val();
         var password = $("#user_pass").val();
         if(user=="") {
             alert("用户名不可为空!");
         } else if(password==""){
             alert("密码不可为空!");
         } else {
             $.ajax({
                 async: false,//同步，待请求完毕后再执行后面的代码
                 type: "POST",
                 url: '${pageContext.request.contextPath}/loginVerify',
                 contentType: "application/x-www-form-urlencoded; charset=utf-8",
                 data: $("#loginForm").serialize(),
                 dataType: "json",
                 success: function (data) {
                     if(data.code==0) {
                         alert(data.msg);
                     } else {
                         window.location.href="${pageContext.request.contextPath}/admin";
                     }
                 },
                 error: function () {
                     alert("数据获取失败")
                 }
             })
         }
     })
```

这里 ajax 使用同步，防止出现后台没有返回值，就执行了后面的js代码，进而出现 ajax 执行 error:function() 里的代码。数据类型使用 json，当然也可以使用 text，只不过 text 只能 返回普通的字符串。

最后，如果验证通过，将跳转到 xxx.com/admin 页面(当然后台需要加入session，否则拦截器会拦截)。

 

#### 3、控制器代码

```
    //登录页面显示
        @RequestMapping("/login")
        public ModelAndView loginView() {
            ModelAndView modelAndView = new ModelAndView();
            modelAndView.setViewName("/Admin/login");
            return modelAndView;
        }
        //登录验证
        @RequestMapping(value = "/loginVerify",method = RequestMethod.POST)
        @ResponseBody
        public String loginVerify(HttpServletRequest request, HttpServletResponse response) throws Exception {
            Map<String, Object> map = new HashMap<String, Object>();
            String username = request.getParameter("username");
            String password = request.getParameter("password");
            String rememberme = request.getParameter("rememberme");
            UserCustom userCustom = userService.getUserByNameOrEmail(username);
            if(userCustom==null) {
                map.put("code",0);
                map.put("msg","用户名无效！");
            } else if(!userCustom.getUserPass().equals(password)) {
                map.put("code",0);
                map.put("msg","密码错误！");
            } else {
                //登录成功
                map.put("code",1);
                map.put("msg","");
                //添加session
                request.getSession().setAttribute("user", userCustom);
                //添加cookie
                if(rememberme!=null) {
                    //创建两个Cookie对象
                    Cookie nameCookie = new Cookie("username", username);
                    //设置Cookie的有效期为3天
                    nameCookie.setMaxAge(60 * 60 * 24 * 3);
                    Cookie pwdCookie = new Cookie("password", password);
                    pwdCookie.setMaxAge(60 * 60 * 24 * 3);
                    response.addCookie(nameCookie);
                    response.addCookie(pwdCookie);
                }
            }
            String result = new JSONObject(map).toString();
            return result;
        }
```

这里登录验证方法内，getUserByNameOrEmail() 方法用来从数据库里查找是否有该用户(用户名或者邮箱)。如果有，而且密码正确，添加一条 session，要和拦截器里写的一致哦。并将信息添加到 Map 中，然后转成 JSON 数据，这里需要导入 对应JSON 的jar 包。

```
    <dependency>
      <groupId>org.json</groupId>
      <artifactId>json</artifactId>
      <version>20170516</version>
    </dependency>
```



#### 4、Service 和 DAO

这里就不贴 Service 和 Dao 的代码了，主要就是根据 字符串查找用户的操作啦。

 
 
### 三、注销实现

注销就比较简单了，清除 session 就行了。

1、jsp 页面

```
    <a href="${pageContext.request.contextPath}/admin/logout">退了</a>
```
 

2、控制器代码

```
    //退出登录
       @RequestMapping(value = "/admin/logout")
       public String logout(HttpSession session) throws Exception {
           session.removeAttribute("userId");
           session.invalidate();
           return "redirect:/login";
       }
```


## Star
如果觉得这篇教程还有点用，请点播关注，给我的<a href="https://github.com/wjw0315/wjw0315.github.io" target="view_window">github仓库</a> 点个 **star** 吧，谢谢！

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/star.png)

点上面 **↑** 那个星星

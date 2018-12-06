---
layout:     post                  
title:      MVC拦截器-HandlerInterceptorAdapter
date:       2018-11-08             
author:     JiaweiWu        
header-img: img/post-bg-rwd.jpg  
category: Spring  
catalog: true  
tags:                             
- Spring 
---

一般情况下，对来自浏览器的请求的拦截，是利用Filter实现的

而在Spring中，基于Filter这种方式可以实现Bean预处理、后处理。 比如注入`FilterRegistrationBean`，然后在这个Bean上传递自己继承Filter实现的自定义Filter进入即可。

而Spring MVC也有拦截器，不仅可实现Filter的所有功能，还可以更精确的控制拦截精度。 

Spring MVC提供的`org.springframework.web.servlet.handler.HandlerInterceptorAdapter`这个适配器，继承此类，可以非常方便的实现自己的拦截器。

它有三个方法：

```
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)throws Exception {    
        return true;    
}    
public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView)throws Exception {    
}    
public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)throws Exception {    
} 
```
- preHandle在业务处理器处理请求之前被调用。预处理，可以进行编码、安全控制等处理； 
- postHandle在业务处理器处理请求执行完成后，生成视图之前执行。后处理（调用了Service并返回ModelAndView，但未进行页面渲染），有机会修改ModelAndView； 
- afterCompletion在DispatcherServlet完全处理完请求后被调用，可用于清理资源等。返回处理（已经渲染了页面），可以根据ex是否为null判断是否发生了异常，进行日志记录；

# 一、基于XML配置使用Spring MVC

可以利用`SimpleUrlHandlerMapping`、`BeanNameUrlHandlerMapping`进行Url映射（相当于struts的path映射）和拦截请求（注入interceptors）。

如果基于注解使用Spring MVC，可以使用`DefaultAnnotationHandlerMapping`注入`interceptors`。

注意无论基于XML还是基于注解，`HandlerMapping Bean`都是需要在XML中配置的。 

#### 实例一：
`TimeBasedAccessInterceptor.java`

```
public class TimeBasedAccessInterceptor extends HandlerInterceptorAdapter {  
    private int openingTime;  
    private int closingTime;  
    private String mappingURL;//利用正则映射到需要拦截的路径  
    public void setOpeningTime(int openingTime) {  
        this.openingTime = openingTime;  
    }  
    public void setClosingTime(int closingTime) {  
        this.closingTime = closingTime;  
    }  
    public void setMappingURL(String mappingURL) {  
        this.mappingURL = mappingURL;  
    }  
    @Override  
    public boolean preHandle(HttpServletRequest request,  
            HttpServletResponse response, Object handler) throws Exception {  
        String url=request.getRequestURL().toString();  
        if(mappingURL==null || url.matches(mappingURL)){  
            Calendar c=Calendar.getInstance();  
            c.setTime(new Date());  
            int now=c.get(Calendar.HOUR_OF_DAY);  
            if(now<openingTime || now>closingTime){  
                request.setAttribute("msg", "注册开放时间：9：00-12：00");  
                request.getRequestDispatcher("/msg.jsp").forward(request, response);  
                return false;  
            }  
            return true;  
        }  
        return true;  
    }  
}
```
xml的配置：

```
<bean id="timeBasedAccessInterceptor" class="com.spring.handler.TimeBasedAccessInterceptor">  
    <property name="openingTime" value="9" />  
    <property name="closingTime" value="12" />  
    <property name="mappingURL" value=".*/user\.do\?action=reg.*" />  
</bean>  
<bean class="org.springframework.web.servlet.mvc.annotation.DefaultAnnotationHandlerMapping">  
    <property name="interceptors">  
        <list>  
            <ref bean="timeBasedAccessInterceptor"/>  
        </list>  
    </property>  
</bean>
```
这里我们定义了一个mappingURL属性，实现利用正则表达式对url进行匹配，从而更细粒度的进行拦截。当然如果不定义mappingURL，则默认拦截所有对Controller的请求。 

#### 实例二：多拦截器

xml的配置
```
<!--配置拦截器, 多个拦截器,顺序执行 -->  
<mvc:interceptors>    
    <mvc:interceptor>    
        <!-- 匹配的是url路径， 如果不配置或/**,将拦截所有的Controller -->  
        <mvc:mapping path="/" />  
        <mvc:mapping path="/user/**" />  
        <mvc:mapping path="/test/**" />  
        <bean class="com.alibaba.interceptor.CommonInterceptor"></bean>    
    </mvc:interceptor>  
    <!-- 当设置多个拦截器时，先按顺序调用preHandle方法，然后逆序调用每个拦截器的postHandle和afterCompletion方法 -->  
</mvc:interceptors>
```

```
import javax.servlet.http.HttpServletRequest;  
import javax.servlet.http.HttpServletResponse;  
  
import org.slf4j.Logger;  
import org.slf4j.LoggerFactory;  
import org.springframework.web.servlet.ModelAndView;  
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;  
  
import com.alibaba.util.RequestUtil;  
  
public class CommonInterceptor extends HandlerInterceptorAdapter{  
    private final Logger log = LoggerFactory.getLogger(CommonInterceptor.class);  
    public static final String LAST_PAGE = "com.alibaba.lastPage";  
    /* 
     * 利用正则映射到需要拦截的路径     
      
    private String mappingURL; 
     
    public void setMappingURL(String mappingURL) {     
               this.mappingURL = mappingURL;     
    }    
  */  
    /**  
     * 在业务处理器处理请求之前被调用  
     * 如果返回false  
     *     从当前的拦截器往回执行所有拦截器的afterCompletion(),再退出拦截器链 
     * 如果返回true  
     *    执行下一个拦截器,直到所有的拦截器都执行完毕  
     *    再执行被拦截的Controller  
     *    然后进入拦截器链,  
     *    从最后一个拦截器往回执行所有的postHandle()  
     *    接着再从最后一个拦截器往回执行所有的afterCompletion()  
     */    
    @Override    
    public boolean preHandle(HttpServletRequest request,    
            HttpServletResponse response, Object handler) throws Exception {    
        if ("GET".equalsIgnoreCase(request.getMethod())) {  
            RequestUtil.saveRequest();  
        }  
        log.info("==============执行顺序: 1、preHandle================");    
        String requestUri = request.getRequestURI();  
        String contextPath = request.getContextPath();  
        String url = requestUri.substring(contextPath.length());  
        
        log.info("requestUri:"+requestUri);    
        log.info("contextPath:"+contextPath);    
        log.info("url:"+url);    
          
        String username =  (String)request.getSession().getAttribute("user");   
        if(username == null){  
            log.info("Interceptor：跳转到login页面！");  
            request.getRequestDispatcher("/WEB-INF/jsp/login.jsp").forward(request, response);  
            return false;  
        }else  
            return true;     
    }    
    
    /** 
     * 在业务处理器处理请求执行完成后,生成视图之前执行的动作    
     * 可在modelAndView中加入数据，比如当前时间 
     */  
    @Override    
    public void postHandle(HttpServletRequest request,    
            HttpServletResponse response, Object handler,    
            ModelAndView modelAndView) throws Exception {     
        log.info("==============执行顺序: 2、postHandle================");    
        if(modelAndView != null){  //加入当前时间    
            modelAndView.addObject("var", "测试postHandle");    
        }    
    }    
    
    /**  
     * 在DispatcherServlet完全处理完请求后被调用,可用于清理资源等   
     *   
     * 当有拦截器抛出异常时,会从当前拦截器往回执行所有的拦截器的afterCompletion()  
     */    
    @Override    
    public void afterCompletion(HttpServletRequest request,    
            HttpServletResponse response, Object handler, Exception ex)    
            throws Exception {    
        log.info("==============执行顺序: 3、afterCompletion================");    
    }    
  
}
```
# 二、SpringBoot加入拦截器

#### 1、配置spring mvc的拦截器WebMvcConfigurerAdapter

`WebMvcConfig.java`


```
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Autowired
    private AuthorizationInterceptor authorizationInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authorizationInterceptor).addPathPatterns("/api/**");
    }

}
```
`AuthorizationInterceptor.java`

```
@Component
public class AuthorizationInterceptor extends HandlerInterceptorAdapter {
    @Autowired
    private TokenService tokenService;

    public static final String USER_KEY = "userId";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Login annotation;
        if(handler instanceof HandlerMethod) {
        
		//处理Login Annotation，实现方法级权限控制
            annotation = ((HandlerMethod) handler).getMethodAnnotation(Login.class);
        }else{
            return true;
        }
        //如果为空在表示该方法不需要进行权限验证
        if(annotation == null){
            return true;
        }

        //从header中获取token
        String token = request.getHeader("token");
        //如果header中不存在token，则从参数中获取token
        if(StringUtils.isBlank(token)){
            token = request.getParameter("token");
        }

        //token为空
        if(StringUtils.isBlank(token)){
            throw new RRException("token不能为空");
        }

        //查询token信息
        TokenEntity tokenEntity = tokenService.queryByToken(token);
        if(tokenEntity == null || tokenEntity.getExpireTime().getTime() < System.currentTimeMillis()){
            throw new RRException("token失效，请重新登录");
        }

        //设置userId到request里，后续根据userId，获取用户信息
        request.setAttribute(USER_KEY, tokenEntity.getUserId());

        return true;
    }
}

```
登录校验注解：

`Login.java`

```
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Login {
}

```

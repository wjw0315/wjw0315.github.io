---
layout:     post
title:      SSM博客实战(2)–实现分页效果
subtitle:   MapleBlog_two
date:       2018-2-1
author:     wjw
header-img: img/home-bg-o.jpg
catalog: true
tags:
    - MapleBlog
---
## SSM博客实战(2)–实现分页效果


- 大部分网站最常用到的功能就是分页，网页上不实现分页的话就会使得一个网站页面中的信息太过于的冗长。

实现类似如下图所示的效果：

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018-2-2-MapleBlog_two/1.png)

## 分页实现方法一：

### 使用mybatis-pagehelper分页插件：

[mybatis-pagehelper](https://github.com/pagehelper/Mybatis-PageHelper)使用方法：

#### 1、引入分页插件，有两种方式：
1)直接引入相应的jar包：
- https://oss.sonatype.org/content/repositories/releases/com/github/pagehelper/pagehelper/
- http://repo1.maven.org/maven2/com/github/pagehelper/pagehelper/

由于使用了sql 解析工具，你还需要下载 jsqlparser.jar：
- http://repo1.maven.org/maven2/com/github/jsqlparser/jsqlparser/0.9.5/

2）使用Maven在pom.xml中引入相关的依赖：
```
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper</artifactId>
    <version>最新版本</version>
</dependency>
```
到maven re中查询最新的版本号。

#### 2、配置拦截器插件：

【注】新版拦截器是 com.github.pagehelper.PageInterceptor。 com.github.pagehelper.PageHelper 现在是一个特殊的 dialect 实现类，是分页插件的默认实现类，提供了和以前相同的用法。

1） 在 MyBatis 配置 xml 中配置拦截器插件
```
<!-- 
    plugins在配置文件中的位置必须符合要求，否则会报错，顺序如下:
    properties?, settings?, 
    typeAliases?, typeHandlers?, 
    objectFactory?,objectWrapperFactory?, 
    plugins?, 
    environments?, databaseIdProvider?, mappers?
-->
<plugins>
    <!-- com.github.pagehelper为PageHelper类所在包名 -->
    <plugin interceptor="com.github.pagehelper.PageInterceptor">
        <!-- 使用下面的方式配置参数，后面会有所有的参数介绍 -->
        <property name="param1" value="value1"/>
	</plugin>
</plugins>
```
2) 在 Spring 配置文件中配置拦截器插件

使用 spring 的属性配置方式，可以使用 plugins 属性像下面这样配置：
```
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
  <!-- 注意其他配置 -->
  <property name="plugins">
    <array>
      <bean class="com.github.pagehelper.PageInterceptor">
        <property name="properties">
          <!--使用下面的方式配置参数，一行配置一个 -->
          <value>
            params=value1
          </value>
        </property>
      </bean>
    </array>
  </property>
</bean>
```
#### 代码中实现

1、java类中：

```
public Msg getEmpsWithJson(@RequestParam(value="pageNum" ,defaultValue="1")Integer pageNum,Model model){
		//引入pagehelper分页插件
		PageHelper.startPage(pageNum, 5);
		//引入分页的后面紧跟查询的内容就是分页查询
		List<Employee>  list =employeeService.getAll();
		//使用pageInfo来包装查询的结果
		//封装分页的信息，包括查询出来的数据 并传入需要显示的页数  eg:5
		PageInfo page =new PageInfo(list, 5);
		
	//	model.addAttribute("pageinfo", page);
		
		return Msg.success().add("pageinfo", page);
	}
```
pageinfo中封装了分页信息，将分页查询的分页信息返回到查询的页面；
Msg类封装了通用返回类型：
其中用到的：
//用户要返回给浏览器的数据
`	private Map<String, Object> extend =new HashMap<String, Object>();`
//增加add方法：
```
public Msg add(String key,Object value){
		
		this.getExtend().put(key, value);
		return this;
		
	}
```
2、jsp页面：
```
function To_Page(pageNum){
			$.ajax({
				type: "GET",
			   url: "${APP_PATH}/emps",
			   data: "pageNum="+pageNum,
			   success: function(result){
			     //控制台测试结果数据
			     //console.log(result);
			   } 
			});
		}
```
通过result可以拿到分页的信息。

### 分页实现方法二：

#### 自定义page类：

1、java工具类page.java：

```
    package com.wujiawei.blog.util.others;
    /**
     * 分页
     */
    import java.io.Serializable;
    public class Page implements Serializable {
        private static final long serialVersionUID = 1L;
        private int pageNow = 1; // 当前页数
        private int pageSize = 10; // 每页显示记录的条数
        private int totalCount; // 总的记录条数
        private int totalPageCount; // 总的页数
        @SuppressWarnings("unused")
        private int startPos; // 开始位置，从0开始
        @SuppressWarnings("unused")
        private boolean hasFirst;// 是否有首页
        @SuppressWarnings("unused")
        private boolean hasPre;// 是否有前一页
        @SuppressWarnings("unused")
        private boolean hasNext;// 是否有下一页
        @SuppressWarnings("unused")
        private boolean hasLast;// 是否有最后一页
        /**
         * 通过构造函数 传入  总记录数  和  当前页
         * @param totalCount
         * @param pageNow
         */
        public Page(int totalCount, int pageNow) {
            this.totalCount = totalCount;
            this.pageNow = pageNow;
        }
        /**
         * 取得总页数，总页数=总记录数/总页数
         * @return
         */
        public int getTotalPageCount() {
            totalPageCount = getTotalCount() / getPageSize();
            return (totalCount % pageSize == 0) ? totalPageCount
                : totalPageCount + 1;
        }
        public void setTotalPageCount(int totalPageCount) {
            this.totalPageCount = totalPageCount;
        }
        public int getPageNow() {
            return pageNow;
        }
        public void setPageNow(int pageNow) {
            this.pageNow = pageNow;
        }
        public int getPageSize() {
            return pageSize;
        }
        public void setPageSize(int pageSize) {
            this.pageSize = pageSize;
        }
        public int getTotalCount() {
            return totalCount;
        }
        public void setTotalCount(int totalCount) {
            this.totalCount = totalCount;
        }
        /**
         * 取得选择记录的初始位置
         * @return
         */
        public int getStartPos() {
            return (pageNow - 1) * pageSize;
        }
        public void setStartPos(int startPos) {
            this.startPos = startPos;
        }
        /**
         * 是否是第一页
         * @return
         */
        public boolean isHasFirst() {
            return (pageNow == 1) ? false : true;
        }
        public void setHasFirst(boolean hasFirst) {
            this.hasFirst = hasFirst;
        }
        /**
         * 是否有首页
         * @return
         */
        public boolean isHasPre() {
            // 如果有首页就有前一页，因为有首页就不是第一页
            return isHasFirst() ? true : false;
        }
        public void setHasPre(boolean hasPre) {
            this.hasPre = hasPre;
        }
        /**
         * 是否有下一页
         * @return
         */
        public boolean isHasNext() {
            // 如果有尾页就有下一页，因为有尾页表明不是最后一页
            return isHasLast() ? true : false;
        }
        public void setHasNext(boolean hasNext) {
            this.hasNext = hasNext;
        }
        /**
         * 是否有尾页
         * @return
         */
        public boolean isHasLast() {
            // 如果不是最后一页就有尾页
            return (pageNow == getTotalCount()) ? false : true;
        }
        public void setHasLast(boolean hasLast) {
            this.hasLast = hasLast;
        }
    }
```

2、编辑数据访问层 Mapper.xml 和 Mapper 类

使用 Mapper 代理方式操作数据库，Mapper 代理需要类和xml文件在一起

当然大家也可以用 DAO 的方式

    **ArticleMapperCustom.xml**
```
    <!-- 查询文章记录总数 -->
    <select id="getArticleCount" resultType="int">
        select count(*) from article
    </select>
    <!--通过分页查询文章-->
    <select id="selectArticleByPage" resultType="com.wujiawei.blog.po.custom.ArticleCustom">
        select * from article limit #{startPos},#{pageSize}
    </select>
```
 

    **ArticleMapperCustom.java**
```
    //分页操作
    public List<ArticleCustom> selectArticleByPage(@Param(value="startPos") Integer startPos,@Param(value="pageSize") Integer pageSize) throws Exception;
```
 
3、编辑业务层  Service类 和 Service的实现类

    **ArticleService.java**  （接口）
```
    //分页显示
    public void showArticleByPage(HttpServletRequest request, Model model) throws Exception;
```
    **ArticleServiceImpl.java**  （实现类）
```
    @Override
        public void showArticleByPage(HttpServletRequest request, Model model) throws Exception {
            String pageNow = request.getParameter("pageNow");
            Page page = null;
            List<ArticleCustom> articleList = new ArrayList<ArticleCustom>();
            int totalCount = articleMapperCustom.getArticleCount();
            if (pageNow != null) {
                page = new Page(totalCount, Integer.parseInt(pageNow));
                articleList = this.articleMapperCustom.selectArticleByPage(page.getStartPos(), page.getPageSize());
            } else {
                page = new Page(totalCount, 1);
                articleList = this.articleMapperCustom.selectArticleByPage(page.getStartPos(), page.getPageSize());
            }
            model.addAttribute("articleList", articleList);
            model.addAttribute("page", page);
        }
```
 
4、编辑控制层  Controller 类

**IndexController.java**
```
    @Autowired
    private ArticleService articleService;
    //首页文章分页显示
    @RequestMapping("/")
    public String IndexView(HttpServletRequest request, Model model) throws Exception {
        //此处的articleService是注入的articleService接口的对象
        articleService.showArticleByPage(request, model);
        return "/WEB-INF/Home/Index/index.jsp";
    }
```
注意：

这里的 articleService 需要注入，在 spring-service 配置文件中添加
```
    <!-- 用户管理的service -->
    bean id="userService" class="com.wujiawei.blog.service.impl.UserServiceImpl"/>
```
 
5、编辑视图层  JSP 文件

这里只将分页部分的代码贴出
```
    <!-- 分页功能 start -->
               <div align="center">
                   <span>共 ${page.totalPageCount} 页</span> <span >第
                   ${page.pageNow} 页</span> <a href="?pageNow=1">首页</a>
                   <c:choose>
                       <c:when test="${page.pageNow - 1 > 0}">
                           <a href="?pageNow=${page.pageNow - 1}">上一页</a>
                       </c:when>
                       <c:when test="${page.pageNow - 1 <= 0}">
                           <a href="?pageNow=1">上一页</a>
                       </c:when>
                   </c:choose>
                   <c:choose>
                       <c:when test="${page.totalPageCount==0}">
                           <a href="?pageNow=${page.pageNow}">下一页</a>
                       </c:when>
                       <c:when test="${page.pageNow + 1 < page.totalPageCount}">
                           <a href="?pageNow=${page.pageNow + 1}">下一页</a>
                       </c:when>
                       <c:when test="${page.pageNow + 1 >= page.totalPageCount}">
                           <a href="?pageNow=${page.totalPageCount}">下一页</a>
                       </c:when>
                   </c:choose>
                   <c:choose>
                       <c:when test="${page.totalPageCount==0}">
                           <a href="?pageNow=${page.pageNow}">尾页</a>
                       </c:when>
                       <c:otherwise>
                           <a href="?pageNow=${page.totalPageCount}">尾页</a>
                       </c:otherwise>
                   </c:choose>
               </div>
               <!-- 分页功能 End -->
```
会有如下的结果：
![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018-2-2-MapleBlog_two/2.png)

6、美化显示效果，可以使用bootstrap，或者自己写css
```
    <div class="divBody">
               <div class="divContent">
                   <c:choose>
                       <c:when test="${page.totalPageCount <= 10 }">
                           <c:set var="begin" value="1"/>
                           <c:set var="end" value="${page.totalPageCount }"/>
                       </c:when>
                       <c:otherwise>
                           <c:set var="begin" value="${page.pageNow-4 }"/>
                           <c:set var="end" value="${page.pageNow + 4}"/>
                           <c:if test="${begin < 1 }">
                               <c:set var="begin" value="1"/>
                               <c:set var="end" value="10"/>
                           </c:if>
                           <c:if test="${end > page.totalPageCount }">
                               <c:set var="begin" value="${page.totalPageCount-5 }"/>
                               <c:set var="end" value="${page.totalPageCount }"/>
                           </c:if>
                       </c:otherwise>
                   </c:choose>
                   <%--上一页 --%>
                   <c:choose>
                       <c:when test="${page.pageNow eq 1 }">
                           <%--当前页为第一页，隐藏上一页按钮--%>
                       </c:when>
                       <c:otherwise>
                           <a href="?pageNow=${page.pageNow-1}" class="btn btn-default"><span class="fa fa-angle-left"></span></a>
                       </c:otherwise>
                   </c:choose>
                   <%--显示第一页的页码--%>
                   <c:if test="${begin >= 2 }">
                       <a href="?pageNow=1" class="btn btn-default">1</a>
                   </c:if>
                   <%--显示点点点--%>
                   <c:if test="${begin  > 2 }">
                       <button type="button" class="btn btn-default disabled" style="border: 0;">...</button>
                   </c:if>
                   <%--打印 页码--%>
                   <c:forEach begin="${begin }" end="${end }" var="i">
                       <c:choose>
                           <c:when test="${i eq page.pageNow }">
                               <button type="button" class="btn btn-primary active" >${i}</button>
                           </c:when>
                           <c:otherwise>
                               <a href="?pageNow=${i}" class="btn btn-default ">${i }</a>
                           </c:otherwise>
                      </c:choose>
                   </c:forEach>
                   <%-- 显示点点点 --%>
                   <c:if test="${end < page.totalPageCount-1 }">
                       <button type="button" class="btn btn-default disabled" style="border: 0;">...</button>
                   </c:if>
                   <%-- 显示最后一页的数字 --%>
                   <c:if test="${end < page.totalPageCount }">
                       <a href="?pageNow=${page.totalPageCount}" class="btn btn-default">${page.totalPageCount}</a>
                   </c:if>
                   <%--下一页 --%>
                   <c:choose>
                       <c:when test="${page.pageNow eq page.totalPageCount }">
                       <%--到了尾页隐藏，下一页按钮--%>
                       </c:when>
                       <c:otherwise>
                           <a href="?pageNow=${page.pageNow+1}" class="btn btn-default"><span class="fa fa-angle-right"></span></a>
                       </c:otherwise>
                   </c:choose>
               </div>
           </div>
```
css 代码
```
    /*分页*/
    .container .btn {
        border: 1px solid #ddd!important;
        border-radius: 2px!important;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.04)!important;
    }
    .container .btn-primary {
        background-color: #398898!important;
        border-color:#398898!important;
    }
    .container .btn-default:hover {
        background-color: #398898!important;
        border-color: #398898!important;
        color: #ffffff !important;
    }
    .container .disabled:hover {
        cursor:text !important;
        background-color: #ffffff!important;
        border: 1px solid #ddd!important;
        color: #333333!important;
    }
```

## Star
如果觉得这篇教程还有点用，请点播关注，给我的<a href="https://github.com/wjw0315/wjw0315.github.io" target="view_window">github仓库</a> 点个 **star** 吧，谢谢！

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/star.png)

点上面 **↑** 那个星星

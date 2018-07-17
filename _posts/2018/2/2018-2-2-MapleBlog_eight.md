---
layout:     post
title:      SSM博客实战(8)-文章搜索和分页实现
subtitle:   MapleBlog_eight
date:       2018-2-2
author:     wjw
header-img: img/home-bg-o.jpg
catalog: true
stickie: true
tags:
    - MapleBlog
---
## SSM博客实战(8)-文章搜索和分页实现

本文将介绍如何实现搜索功能和分页功能。其中分页功能在之前已经介绍了，这里还会贴出代码。

本文中的数据用于测试，包括分类和标签信息是随便填的。

先上效果，这个是以后台为例子

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018-2-2-MapleBlog_eight/1.png)


### 一、先看数据表中文章的标签和分类

 
### 二、实体类

ArticleSearchVo.java

```
    package com.wujiawei.blog.po.custom;
    import com.wujiawei.blog.util.others.Page;
    import java.util.List;
    /**
     * 用于封装搜索的文章列表，包括文章信息，作者信息，分类信息，标签信息，搜索信息
     */
    public class ArticleSearchVo extends ArticleCustom {
        //文章信息
        private ArticleCustom articleCustom;
        //文章对应的分类
        private List<CategoryCustom> categoryCustomList;
        //文章对应的标签
        private List<TagCustom> tagCustomList;
        //作者信息
        private UserCustom userCustom;
        //文章分页信息
        private Page page;
        //搜索关键词
        private String query;
        public String getQuery() {
            return query;
        }
        public UserCustom getUserCustom() {
            return userCustom;
        }
        public void setUserCustom(UserCustom userCustom) {
            this.userCustom = userCustom;
        }
        public void setQuery(String query) {
            this.query = query;
        }
        public ArticleCustom getArticleCustom() {
            return articleCustom;
        }
        public void setArticleCustom(ArticleCustom articleCustom) {
            this.articleCustom = articleCustom;
        }
        public List<CategoryCustom> getCategoryCustomList() {
            return categoryCustomList;
        }
        public void setCategoryCustomList(List<CategoryCustom> categoryCustomList) {
            this.categoryCustomList = categoryCustomList;
        }
        public List<TagCustom> getTagCustomList() {
            return tagCustomList;
        }
        public void setTagCustomList(List<TagCustom> tagCustomList) {
            this.tagCustomList = tagCustomList;
        }
        public Page getPage() {
            return page;
        }
        public void setPage(Page page) {
            this.page = page;
        }
    }
```
 

因为我们要输出文章列表，文章列表至少要包括 文章信息(标题，id 和发布时间)，分类信息(分类名称和 id )，标签信息(标签名称和 id )，作者信息(作者昵称和 id )。

对于每篇文章而言，其中分类信息标签信息，在 article 里是以逗号分隔的，也就是我们要用一个 List 集合存储；而文章信息，作者信息和分页信息，用对象存储即可；因为我们还要返回查询输入的关键词，所以还要有一个变量。

其中 ArticleCustom,UserCustom,TagCustom,CategoryCustom 分别是 po 的扩展。

 
### 三、分页 类

Page.java

```
    package com.wujiawei.blog.util.others;
    /**
     * 分页
     */
    import java.io.Serializable;
    public class Page implements Serializable {
        private static final long serialVersionUID = 1L;
        private int pageNow = 1; // 当前页数
        private int pageSize; // 每页显示记录的条数
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
        public Page(int totalCount, int pageNow,int pageSize) {
            this.totalCount = totalCount;
            this.pageNow = pageNow;
            this.pageSize = pageSize;
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

具体使用，见下

 
### 四、dao 层

ArticleCustomMapper.java

```
    //文章结果查询结果的数量
        public Integer getSearchResultCount(String s) throws Exception;
        //查询文章分页操作
        public List<ArticleCustom> listSearchResultByPage(@Param(value="queryContent") String queryContent,@Param(value="startPos") Integer startPos,@Param(value="pageSize") Integer pageSize) throws Exception;
```
 

ArticleCustomMapper.xml

```
    <!--查询结果统计-->
    <select id="getSearchResultCount" parameterType="String" resultType="Integer">
        SELECT count(*) FROM `article`
        <where>
            article_status > 0 AND
            article_title LIKE "%${value}%" OR
            article_content LIKE "%${value}%"
        </where>
    </select>
    <!--文章查询分页显示-->
    <select id="listSearchResultByPage"  resultType="com.wujiawei.blog.po.custom.ArticleCustom">
        SELECT
        <include refid="article_table_all_columns"/>
        FROM `article`
        <where>
            article_status > 0 AND
            article_title LIKE '%${queryContent}%' OR
            article_content LIKE '%${queryContent}%'
            limit #{startPos},#{pageSize}
        </where>
    </select>
```

注意字段名不要写错了，我这里的 article_status 是文章状态，0表示禁用不显示，1表示正常，2表示置顶

 
### 五、Service 层

ArticleServiceImpl.java

```
    //文章查询结果分页
        @Override
        public List<ArticleSearchVo> listSearchResultByPage(HttpServletRequest request, Model model,Integer pageNow,Integer pageSize,String query) throws Exception {
            Page page = null;
            List<ArticleCustom> articleCustomList = new ArrayList<ArticleCustom>();
            int totalCount = articleMapperCustom.getSearchResultCount(query);
            if (pageNow != null) {
                page = new Page(totalCount, pageNow, pageSize);
                articleCustomList = this.articleMapperCustom.listSearchResultByPage(query, page.getStartPos(), page.getPageSize());
            } else {
                page = new Page(totalCount, 1, pageSize);
                articleCustomList = this.articleMapperCustom.listSearchResultByPage(query, page.getStartPos(), page.getPageSize());
            }
            List<ArticleSearchVo> articleSearchVoList = new ArrayList<ArticleSearchVo>();
            //查询结果条数为0，下面的不执行，防止空指针
            if(totalCount!=0) {
                for (int i = 0; i < articleCustomList.size(); i++) {
                    ArticleSearchVo articleSearchVo = new ArticleSearchVo();
                    //1、将文章信息装到 articleListVoList 中
                    ArticleCustom articleCustom = articleCustomList.get(i);
                    articleSearchVo.setArticleCustom(articleCustom);
                    //2、将分类信息装到 articleListVoList 中
                    List<CategoryCustom> categoryCustomList = new ArrayList<CategoryCustom>();
                    String categoryIds = articleCustomList.get(i).getArticleCategoryIds();
                    String[] cateId = categoryIds.split(",");
                    for (int j = 0; j < cateId.length; j++) {
                        Category category = categoryMapper.selectByPrimaryKey(Integer.valueOf(cateId[j]));
                        CategoryCustom categoryCustom = new CategoryCustom();
                        BeanUtils.copyProperties(category, categoryCustom);
                        categoryCustomList.add(categoryCustom);
                    }
                    articleSearchVo.setCategoryCustomList(categoryCustomList);
                    //3、获得标签信息
                    List<TagCustom> tagCustomList = new ArrayList<TagCustom>();
                    String tagIds = articleCustomList.get(i).getArticleTagIds();
                    String[] tagId = tagIds.split(",");
                    for (int j = 0; j < tagId.length; j++) {
                        Tag tag = tagMapper.selectByPrimaryKey(Integer.valueOf(tagId[j]));
                        TagCustom tagCustom = new TagCustom();
                        BeanUtils.copyProperties(tag, tagCustom);
                        tagCustomList.add(tagCustom);
                    }
                    articleSearchVo.setTagCustomList(tagCustomList);
                    //4、获得作者信息
                    User user = userMapper.selectByPrimaryKey(articleCustom.getArticleUserId());
                    UserCustom userCustom = new UserCustom();
                    BeanUtils.copyProperties(user, userCustom);
                    articleSearchVo.setUserCustom(userCustom);
                    articleSearchVoList.add(articleSearchVo);
                }
            } else {
                //不执行的话，也要创建一个元素，存储分页信息和查询关键字
                ArticleSearchVo articleSearchVo = new ArticleSearchVo();
                articleSearchVoList.add(articleSearchVo);
            }
            //5、page信息存储在第一个元素中
            articleSearchVoList.get(0).setPage(page);
            //6、将查询的关键词存储到第一个元素
            articleSearchVoList.get(0).setQuery(query);
            return articleSearchVoList;
        }
    ```

这里的 service 调用了 DAO 层的两个方法，分别是获取查询结果的条数和查询结果分页显示。

 
### 六、Controller 层

ArticleController.java

```
    //搜索实现
      @RequestMapping("/admin/article/search")
      @ResponseBody
      public ModelAndView SearchPageView(HttpServletRequest request,Model model) throws Exception {
          ModelAndView modelAndView = new ModelAndView();
          //设置每页显示的数量
          int pageSize = 5;
          String query = request.getParameter("query");
          List<ArticleSearchVo> articleSearchVoList = articleService.listSearchResultByPage(request,model,null,pageSize,query);
          modelAndView.addObject("articleSearchVoList", articleSearchVoList);
          modelAndView.setViewName("Admin/Article/search");
          return modelAndView;
      }
      //搜索分页实现
      @RequestMapping("/admin/article/p/{pageNow}/search")
      @ResponseBody
      public  ModelAndView SearchPageByPageView(HttpServletRequest request, Model model,@PathVariable("pageNow") Integer pageNow) throws Exception {
          ModelAndView modelAndView = new ModelAndView();
          //设置每页显示的数量
          int pageSize = 5;
          String query = request.getParameter("query");
          List<ArticleSearchVo> articleSearchVoList = articleService.listSearchResultByPage(request,model,pageNow,pageSize,query);
          modelAndView.addObject("articleSearchVoList", articleSearchVoList);
          modelAndView.setViewName("/Admin/Article/search");
          return modelAndView;
      }
```
 

第一个方法是用户输入查询信息，点击查询按钮的时候，会提交表单到 /admin/article/search 这里。

因为我们设置的查询结果是按分页显示的，如果超过 10 条，会分页。点击分页按钮，会执行第二个方法。

 
### 七、视图层

index.jsp

```
    <form class="layui-form" action="${pageContext.request.contextPath}/admin/article/search">
            <div class="layui-form-item">
                <div class="layui-input-block">
                    <input type="text" name="query" required  lay-verify="required" placeholder="请输入关键词" autocomplete="off" class="layui-input" >
                    <button class="layui-btn" lay-submit lay-filter="formDemo" type="submit">搜索</button>
                </div>
            </div>
        </form>
```

这就出现如上图的搜索条， 首页，有一个这样的搜索框


search.jsp

```
    <blockquote class="layui-elem-quote">搜索 ${articleSearchVoList[0].query} 找到 ${articleSearchVoList[0].page.totalCount} 条数据</blockquote>
      <form class="layui-form" action="${pageContext.request.contextPath}/admin/article/search">
          <div class="layui-form-item">
              <div class="layui-input-block">
                  <input type="text" name="query" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input" value="${articleSearchVoList[0].query}" >
                  <button class="layui-btn" lay-submit lay-filter="formDemo" type="submit">搜索</button>
                  <button class="layui-btn" lay-submit lay-filter="formDemo" style="float: right;">批量删除</button>
              </div>
          </div>
      </form>
      <c:choose>
          <%--查询结果不为0--%>
          <c:when test="${articleSearchVoList[0].page.totalCount!=0}">
              <table class="layui-table">
                  <colgroup>
                      <col width="25">
                      <col width="25">
                      <col width="300">
                      <col width="200">
                      <col width="200">
                      <col width="200">
                      <col width="100">
                      <col width="200">
                  </colgroup>
                  <thead>
                  <tr>
                      <th><input type="checkbox" id="allSelect"  onclick="javascript:DoCheck()"></th>
                      <th>id</th>
                      <th>标题</th>
                      <th>所属分类</th>
                      <th>所带标签</th>
                      <th>发布时间</th>
                      <th>作者</th>
                      <th>操作</th>
                  </tr>
                  </thead>
                  <tbody>
                  <c:forEach items="${articleSearchVoList}" var="a">
                      <tr>
                          <td><input type="checkbox" name="select_id"></td>
                          <td>${a.articleCustom.articleId}</td>
                          <td><a href="${pageContext.request.contextPath}/article/${a.articleCustom.articleId}" target="_blank">
                                  ${fn:substring(a.articleCustom.articleTitle, 0,20 )}
                          </a></td>
                          <td>
                              <c:forEach items="${a.categoryCustomList}" var="c">
                                  <a href="${pageContext.request.contextPath}/category/${c.categoryId}" target="_blank">${c.categoryName}</a>
                                  &nbsp;
                              </c:forEach>
                          </td>
                          <td>
                              <c:forEach items="${a.tagCustomList}" var="t">
                                  <a href="${pageContext.request.contextPath}/tag/${t.tagId}" target="_blank">${t.tagName}</a>
                                  &nbsp;
                              </c:forEach>
                          </td>
                          <td>
                              <fmt:formatDate value="${a.articleCustom.articlePostTime}" pattern="yyyy-MM-dd HH:mm:ss"/>
                          </td>
                          <td>
                              <a href="${pageContext.request.contextPath}/admin/user/${a.userCustom.userId}">
                                      ${a.userCustom.userNickname}
                              </a>
                          </td>
                          <td>
                              <a href="editArticle">编辑</a>丨
                              <a href="">删除</a>
                          </td>
                      </tr>
                  </c:forEach>
                  </tbody>
              </table>
              <%--分页 start--%>
              <nav class="navigation pagination" role="navigation">
                  <div class="nav-links">
                      <c:choose>
                          <c:when test="${articleSearchVoList[0].page.totalPageCount <= 3 }">
                              <c:set var="begin" value="1"/>
                              <c:set var="end" value="${articleSearchVoList[0].page.totalPageCount }"/>
                          </c:when>
                          <c:otherwise>
                              <c:set var="begin" value="${articleSearchVoList[0].page.pageNow-1 }"/>
                              <c:set var="end" value="${articleSearchVoList[0].page.pageNow + 2}"/>
                              <c:if test="${begin < 2 }">
                                  <c:set var="begin" value="1"/>
                                  <c:set var="end" value="3"/>
                              </c:if>
                              <c:if test="${end > articleSearchVoList[0].page.totalPageCount }">
                                  <c:set var="begin" value="${articleSearchVoList[0].page.totalPageCount-2 }"/>
                                  <c:set var="end" value="${articleSearchVoList[0].page.totalPageCount }"/>
                              </c:if>
                          </c:otherwise>
                      </c:choose>
                          <%--上一页 --%>
                      <c:choose>
                          <c:when test="${articleSearchVoList[0].page.pageNow eq 1 }">
                              <%--当前页为第一页，隐藏上一页按钮--%>
                          </c:when>
                          <c:otherwise>
                              <a class="page-numbers" href="${pageContext.request.contextPath}/admin/article/p/${articleSearchVoList[0].page.pageNow-1}/search?query=${articleSearchVoList[0].query}" >
                                  <i class="layui-icon">&#xe603;</i>
                              </a>
                          </c:otherwise>
                      </c:choose>
                          <%--显示第一页的页码--%>
                      <c:if test="${begin >= 2 }">
                          <a class="page-numbers" href="${pageContext.request.contextPath}/admin/article/p/1/search?query=${articleSearchVoList[0].query}">1</a>
                      </c:if>
                          <%--显示点点点--%>
                      <c:if test="${begin  > 2 }">
                          <span class="page-numbers dots">…</span>
                      </c:if>
                          <%--打印 页码--%>
                      <c:forEach begin="${begin }" end="${end }" var="i">
                          <c:choose>
                              <c:when test="${i eq articleSearchVoList[0].page.pageNow }">
                                  <a class="page-numbers current" >${i}</a>
                              </c:when>
                              <c:otherwise>
                                  <a  class="page-numbers" href="${pageContext.request.contextPath}/admin/article/p/${i}/search?query=${articleSearchVoList[0].query}">${i }</a>
                              </c:otherwise>
                          </c:choose>
                      </c:forEach>
                          <%-- 显示点点点 --%>
                      <c:if test="${end < articleSearchVoList[0].page.totalPageCount-1 }">
                          <span class="page-numbers dots">…</span>
                      </c:if>
                          <%-- 显示最后一页的数字 --%>
                      <c:if test="${end < articleSearchVoList[0].page.totalPageCount }">
                          <a href="${pageContext.request.contextPath}/admin/article/p/${articleSearchVoList[0].page.totalPageCount}/search?query=${articleSearchVoList[0].query}">
                                  ${articleSearchVoList[0].page.totalPageCount}
                          </a>
                      </c:if>
                          <%--下一页 --%>
                      <c:choose>
                          <c:when test="${articleSearchVoList[0].page.pageNow eq articleSearchVoList[0].page.totalPageCount }">
                              <%--到了尾页隐藏，下一页按钮--%>
                          </c:when>
                          <c:otherwise>
                              <a class="page-numbers" href="${pageContext.request.contextPath}/admin/article/p/${articleSearchVoList[0].page.pageNow+1}/search?query=${articleSearchVoList[0].query}">
                                  <i class="layui-icon">&#xe602;</i>
                              </a>
                          </c:otherwise>
                      </c:choose>
                  </div>
              </nav>
              <%--分页 end--%>
          </c:when>
          <%--查询结果为0--%>
          <c:otherwise>
             <center><br>很遗憾，没有查询到带有 <font style="color: red;"> ${articleSearchVoList[0].query} </font> 的内容，换一个关键词再试试吧。</center>
          </c:otherwise>
      </c:choose>
```

## Star
如果觉得这篇教程还有点用，请点播关注，给我的<a href="https://github.com/wjw0315/wjw0315.github.io" target="view_window">github仓库</a> 点个 **star** 吧，谢谢！

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/star.png)

点上面 **↑** 那个星星

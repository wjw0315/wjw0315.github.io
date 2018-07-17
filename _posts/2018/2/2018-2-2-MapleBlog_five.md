---
layout:     post
title:      SSM博客实战(5)–获取文章的标签和分类的实现
subtitle:   MapleBlog_five
date:       2018-2-2
author:     wjw
header-img: img/home-bg-o.jpg
catalog: true
stickie: true
tags:
    - MapleBlog
---
## SSM博客实战(5)–获取文章的标签和分类的实现

>获取一篇文章的信息和其对应的 分类（可能是多个） 和 标签（可能是多个）。

### 一、效果如下

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018-2-2-MapleBlog_five/1.png)

### 二、数据表设计

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018-2-2-MapleBlog_five/2.png)

主要是关注 红色的部分，article表里的 article_category_ids 和 article_tag_ids 分别是 varchar 类型，用来存储 分类和标签的id。因为可能都存在多个，所以，准备以 逗号分隔，到时候，再从中取即可。

 

控制层 和 DAO层 这里就不贴代码了，相对随意。
### 三、业务层代码

这里主要关注业务层 代码，即 Service 部分的实现

```
    @Override
        public void showArticleDetailById(Model model,Integer id) throws Exception {
            Article article  = articleMapper.selectByPrimaryKey(id);
            ArticleCustom articleCustom = new ArticleCustom();
            BeanUtils.copyProperties(article,articleCustom);
            model.addAttribute("articleCustom",articleCustom);
            String category_ids = articleCustom.getArticleCategoryIds();
            if(category_ids!=null && category_ids!="") {
                String[] categorys = category_ids.split(",");
                int categoryLength = categorys.length;
                CategoryCustom[] categoryCustoms = new CategoryCustom[categoryLength];
                for(int i=0;i<categoryLength;i++) {
                    categoryCustoms[i] = categoryMapperCustom.selectCategoryById(Integer.valueOf(categorys[i]));
                }
                model.addAttribute("categoryCustoms",categoryCustoms);
            }
            String tag_ids = articleCustom.getArticleTagIds();
            if(tag_ids!=null && tag_ids!="") {
                String[] tags = tag_ids.split(",");
                int tagLength = tags.length;
                Tag[] tag = new Tag[tagLength];
                for(int i=0;i<tagLength;i++) {
                    tag[i] = tagMapper.selectByPrimaryKey(Integer.valueOf(tags[i]));
                }
                model.addAttribute("tag",tag);
            }
        }
```
 

主要思想是 先通过 id 获取文章信息，然后再从文章信息里获取其分类和标签的值，然后依次从中取出并查询，最后在 发送到视图层。

    我这里多加了 if 语句，防止某个文章没有标签或者分类导致 报异常。
    Article和ArticleCustom，Category和CategoryCustom其实没什么区别，后者是前者的扩展类。因为前者都是用 mybatis-generator 生成的，最好不要在里面改。而是写一个扩展类，继承前者就行。
    其中 分类是用的 其扩展类 CategoryCustom，因为我希望那个分类先显示父级分类，再显示子分类。就需要以 category 表的 pid 字段升序排序（父分类pid为0，子分类pid等于其父分类的id）。而标签只需要任意顺序显示就好啦，没关系的，所以直接用 Tag 对象存储。

 
### 四、视图层

面包屑的显示

```
    <%--面包屑导航 start--%>
    <nav class="breadcrumb">
        <a class="crumbs" href="${pageContext.request.contextPath}">
            <i class="fa fa-home"></i>首页
        </a>
        <c:forEach items="${categoryCustoms}" var="c">
            <i class="fa fa-angle-right"></i>
            <a href="${pageContext.request.contextPath/category/${c.categoryId}}">
                ${c.categoryName}
            </a>
        </c:forEach>
        <i class="fa fa-angle-right"></i>
        正文
    </nav>
```

标签的显示

```
    <%--所属标签 start--%>
        <div class="single-tag">
            <ul class="" >
                <c:forEach items="${tag}" var="t">
                <li>
                       <a href="${pageContext.request.contextPath}/tag/${t.tagId}" rel="tag">
                            ${t.tagName}
                       </a>
                </li>
                </c:forEach>
            </ul>
        </div>
        <%--所属标签 end--%>
```
 

 
### 五、补充

其实这个方法感觉很烂，暂时没想到其他方法。之前用的方法是 使用三表关联查询，Mapper.xml 是这样写的。

```
    <resultMap id="ArticleCategoryTagResultMap" type="com.wujiawei.blog.po.custom.ArticleCustom">
            <id column="article_id" property="articleId"></id>
            <result column="article_user_id" property="articleUserId"></result>
            <result column="article_title" property="articleTitle"></result>
            <result column="article_content" property="articleContent"></result>
            <result column="article_category_ids" property="articleCategoryIds"></result>
            <result column="article_tag_ids" property="articleTagIds"></result>
            <result column="article_view_count" property="articleViewCount"></result>
            <result column="article_comment_count" property="articleCommentCount"></result>
            <result column="article_like_count" property="articleLikeCount"></result>
            <result column="article_post_time" property="articlePostTime"></result>
            <result column="article_update_time" property="articleUpdateTime"></result>
            <result column="article_is_comment" property="articleIsComment"></result>
            <result column="article_status" property="articleStatus"></result>
            <collection property="categoryList" javaType="ArrayList" ofType="com.wujiawei.blog.po.Category">
                <id column="category_id" property="categoryId"></id>
                <result column="category_name" property="categoryName"></result>
            </collection>
            <collection property="tagList" ofType="com.wujiawei.blog.po.Tag">
                <id column="tag_id" property="tagId"></id>
                <result column="tag_name" property="tagName"></result>
            </collection>
        </resultMap>
        <select id="showArticleDetailById" parameterType="Integer" resultMap="ArticleCategoryTagResultMap">
            SELECT  *
            FROM
            article,category,tag
            WHERE
            article.article_category_ids=category.category_id   and
            article.article_tag_ids=tag.tag_id and
            article.article_id=#{value}
        </select>
```

但是这个方法会遇到一个问题，就是如果 文章没有标签或者分类（忘填了），则这篇文章会出现查询不到结果。


## Star
如果觉得这篇教程还有点用，请点播关注，给我的<a href="https://github.com/wjw0315/wjw0315.github.io" target="view_window">github仓库</a> 点个 **star** 吧，谢谢！

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/star.png)

点上面 **↑** 那个星星

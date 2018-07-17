---
layout:     post
title:      SSM博客实战(3)–实现 RESTful 风格
subtitle:   MapleBlog_three
date:       2018-2-2
author:     wjw
header-img: img/home-bg-o.jpg
catalog: true
stickie: true
tags:
    - MapleBlog
---
## SSM博客实战(3)–实现 RESTful 风格

>在实战2中，我们使用分页之后进入网页的连接是这样的：http://localhost:8080/MapleBlog/？nowPage=2
我们需要改成 RESTful 风格：http://localhost:8080/MapleBlog/p/2

### 一、业务层

1、ArticleService.java （接口）
```
    //分页显示
        public void showArticleByPage(HttpServletRequest request, Model model,Integer pageNow) throws Exception;
```
 
2、ArticleServiceImpl.java （实现类）
```
    @Override
        public void showArticleByPage(HttpServletRequest request, Model model,Integer pageNow) throws Exception {
        //  String pageNow = request.getParameter("pageNow");
            Page page = null;
            List<ArticleCustom> articleList = new ArrayList<ArticleCustom>();
            int totalCount = articleMapperCustom.getArticleCount();
            if (pageNow != null) {
            //  page = new Page(totalCount, Integer.parseInt(pageNow));
                page = new Page(totalCount, pageNow);
                articleList = this.articleMapperCustom.selectArticleByPage(page.getStartPos(), page.getPageSize());
            } else {
                page = new Page(totalCount, 1);
                articleList = this.articleMapperCustom.selectArticleByPage(page.getStartPos(), page.getPageSize());
            }
            model.addAttribute("articleList", articleList);
            model.addAttribute("page", page);
        }
```
注意：注释部分是原来的代码，这里加了一个 从控制器 传来的 页码（pageNow）参数。

 

 
### 二、控制层

IndexController.java
```
    @Autowired
    private  HttpServletRequest request;
    @Autowired
    private ArticleService articleService;
    //首页显示
    @RequestMapping("/")
    public String IndexView(HttpServletRequest request, Model model) throws Exception {
        //此处的articleService是注入的articleService接口的对象
        articleService.showArticleByPage(request, model,null);
        return "/Home/Index/index";
    }
    //分页显示
    @RequestMapping("/p/{pageNow}")
    @ResponseBody //适合RESTful
    public ModelAndView PageView(HttpServletRequest request, Model model, @PathVariable("pageNow") Integer pageNow) throws Exception{
        articleService.showArticleByPage(request,model,pageNow);
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("Home/Index/index");
        return modelAndView;//不会被解析为跳转路径，而是直接写入HTTP response body中
    }
```
 

注意：
articleService 是注入的@Responsebody 表示该方法的返回结果直接写入 HTTP response body 中
一般在异步获取数据时使用，在使用 @RequestMapping 后，返回值通常解析为跳转路径，
加上 @Responsebody 后返回结果不会被解析为跳转路径，而是直接写入 HTTP response body 中。
比如异步获取json数据，加上 @Responsebody 后，会直接返回json数据。
@RequestBody 将 HTTP 请求正文插入方法中,使用适合的 HttpMessageConverter 将请求体写入某个对象。

 
### 三、视图层
```
    之前的 jsp 分页链接

<a href="?pageNow=2" class="btn btn-default">2</a>
```
```
    现在的 jsp 分页链接

<a href="${pageContext.request.contextPath}/p/2" class="btn btn-default">2</a>
```

## Star
如果觉得这篇教程还有点用，请点播关注，给我的<a href="https://github.com/wjw0315/wjw0315.github.io" target="view_window">github仓库</a> 点个 **star** 吧，谢谢！

![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/star.png)

点上面 **↑** 那个星星

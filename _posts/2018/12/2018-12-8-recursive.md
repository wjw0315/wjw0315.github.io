---
layout:     post                  
title:      树形数据--递归的实际应用 
date:       2018-12-08             
author:     JiaweiWu        
header-img: img/post-bg-rwd.jpg  
category: 算法   
catalog: true  
tags:                             
- 算法 
---

> 将list数据改变成树形结构

# 1、实体`Category.java`

```
    private Integer categoryId;

    private Integer categoryPid;

    private String categoryName;

    private String categoryDescription;

    private Integer categoryOrder;

    private String categoryIcon;

    private Integer categoryStatus;

```

# 2、创建一个子类`CategoryTree`继承`Category`

```
public class CategoryTree extends Category {

    List<CategoryTree> childrens;

    public List<CategoryTree> getChildrens() {
        return childrens;
    }

    public void setChildrens(List<CategoryTree> childrens) {
        this.childrens = childrens;
    }

}
```
# 3、准备三个接口

一、原始全部数据的接口

```
  List<CategoryTree> selectAll();
```

二、查询父节点数据的接口

```
  List<CategoryTree> getParentTree(List<CategoryTree> categoryTreeList, int pId);
```
impl：
```
     /**
     *categoryTreeList 原始全部数据
     * pId 父节点ID
     */
  public List<CategoryTree> getParentTree(List<CategoryTree> categoryTreeList, int pId) {
        if (categoryTreeList == null) {
            return null;
        }
        List<CategoryTree> parentTreeList = new ArrayList<>();
        categoryTreeList.forEach(data -> {
            if (data.getCategoryPid() == pId) {
                parentTreeList.add(data);
            }
        });
        return parentTreeList;
    }
```

三、递归获取子节点数据接口

```
 List getChildrensTree(List<CategoryTree> categoryTreeList,List<CategoryTree> parentList);
```
impl:

```
    /**
     * 获取子节点菜单集合
     * categoryTreeList 全部数据
     * parentList 父节点数据List
     */
 public List getChildrensTree(List<CategoryTree> categoryTreeList, List<CategoryTree> parentList) {
        //递归遍历出子节点数据
        parentList.forEach(data->{
                data.setChildrens(getChildrensTree(categoryTreeList,getParentTree(categoryTreeList,data.getCategoryId())));
        });
        return parentList;
    }
```

# 4、最终获取树形结构

```
    public List<CategoryTree> getTree() {
        //原始全部数据
        List<CategoryTree> dataAll =selectAll();
        //根数据列
        List<CategoryTree> parentTreeList = getParentTree(dataAll,0);
        //递归子数据列
        getChildrensTree(dataAll,parentTreeList);
        return parentTreeList;
    }
```

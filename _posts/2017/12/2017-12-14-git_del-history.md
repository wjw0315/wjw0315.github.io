---
layout:     post
title:      git仓库删除所有提交历史记录，成为一个干净的新仓库(转)
subtitle:   git_del history
date:       2017-12-14
author:     yanchengyc
header-img: img/post-bg-ios9-web.jpg
catalog: true
stickie: true
tags:
    - Git
---
> 转自[yanchengyc](http://blog.csdn.net/yc1022/article/details/56487680)   
>一个干净的git仓库

把旧项目提交到git上，但是会有一些历史记录，这些历史记录中可能会有项目密码等敏感信息。如何删除这些历史记录，形成一个全新的仓库，并且保持代码不变呢？  
<br>
```
1.Checkout

   git checkout --orphan latest_branch

2. Add all the files

   git add -A

3. Commit the changes

   git commit -am "commit message"


4. Delete the branch

   git branch -D master

5.Rename the current branch to master

   git branch -m master

6.Finally, force update your repository

   git push -f origin master
```

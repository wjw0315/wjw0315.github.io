---
layout:     post                  
title:      Flutter实战-1    
date:       2018-12-1             
author:     JiaweiWu                   
header-img: img/post-bg-rwd.jpg  
category: Flutter   
catalog: true  
tags:                             
- Flutter 
---

# Dart包的引入

引入Http请求库组件：dio

1、添加依赖

`pubspec.yaml`配置文件

```
dependencies:
  flutter:
    sdk: flutter
# Http请求库
  dio:  1.0.9 
```

2、在代码文件中引用

```
//包的引入
import 'package:dio/dio.dart';

//自定义类的引用
import 'entity/Member.dart';

```


# 组件

两个基本类型的组件：

- Stateless: 仅依赖于自己的配置信息的组件，例如图像视图中的静态图像 ；
- Stateful: 需要维护动态信息的组件，并通过与状态对象交互来实现

不同之处： 在于有状态组件将其配置委托给状态对象

## 制作自己的组件：

在main.dart的底部创建一个自己的类：
```
class DemoFlutter extends StatefulWidget{
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    // ignore: expected_token
    return new DemoFlutterState();
  }
//   ignore: missing_method_parameters
//  createState => new DemoFlutterState();

}
```
你已经创建了一个StatefulWidget子类，并且你重写了createState()方法来创建它的状态对象。 

DemoFlutterState使用DemoFlutter的参数扩展状态

**制作新组件时的主要任务是重写在组件呈现在屏幕上时调用的build()方法。**

DemoFlutterState重写bulid方法：

```
class DemoFlutterState extends State<DemoFlutter> {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return null;
  }
}
```
写入组件，重写后最终如下：

```
class DemoFlutterState extends State<DemoFlutter> {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return new Scaffold (
        appBar: new AppBar(
        title: new Text("新的组件"),
      ),
      body: new Text("新的组件"),
    );
  }
}
```

`Scaffold` 是`material design`组件的容器。 它充当组件层次结构的根。 您已将`AppBar`和一个`body`添加到`scaffold`中，并且每个都包含一个`Text`组件

**最终**使用新创建的组件去替换FlutterApp中home的属性。

```
class FlutterApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: '任务页面标题',
      home: new DemoFlutter(),
//      home: new Scaffold(
//        appBar: new AppBar(
//          title: new Text('tabbar'),
//        ),
//        body: new Center(
//          child: new Text('内容'),
//        ),
//      ),
    );
  }
}
```

# 网络请求

首先需要引入文章最开头的dio工具包。

采用异步请求的方式去获取一组数据列，

## 在DemoFlutterState类中： 

在DemoFlutterState类中设置两个参数：

```
 var _list = [];
  //添加一个属性来保存文本的样式
  final _biggerFont = const TextStyle(fontSize: 18.0);
```

并写一个私有的异步请求方法：

```
_loadData() async {
    String dataURL = "https://api.github.com/users";
//    http.Response response = await http.get(dataURL);
    Dio dio = new Dio();
    Response response = await dio.get(dataURL);
    setState(() {
      _list = response.data;
    });
```
## 重写initSate方法

在组件初始化时调用_loadData方法

```
  @override
  void initState(){
    super.initState();
    _loadData();
  }
```

## ListView组件

- [**ListView组件的使用**]()

在重写的build方法中使用ListView组件去接收数据。

padding ：设置布局内边距

```
  body: new ListView.builder(
            padding: const EdgeInsets.all(16.0),
            itemCount: _list.length,
            itemBuilder: (BuildContext context, int position) {
              return _buiddList(position);
            }),
```

里面调用了一个私有的_bulidList方法：

```
Widget _buiddList(int i){
    //返回一个ListTile组件，该组件显示第iJSON成员的"login"值，
    // 还使用您之前创建的文本样式(_biggerFont)
      return new ListTile(
          title : new Text("${_list[i]["login"]}", style: _biggerFont)
      );
  }
```

效果如下：

<center>
<img src="https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/12/flutter/3.png" width="30%" height="30%" />

效果-1
</center>


## 添加分割线

```
Divider ： flutter分隔符组件 

odd ：int数据类型判断是否为奇数的方法

~/ ： dart运算符，返回一个整数值的除法
```

在列表中增加分割线，需要翻倍list的itemCount属性，然后list中的position为偶数时返回Divider组件。


如下处理bulid方法中的代码：

```
 body: new ListView.builder(
            padding: const EdgeInsets.all(16.0),
            itemCount: _list.length * 2,
            itemBuilder: (BuildContext context, int position) {
              if(position.isOdd)
                return new Divider();
              int index = position ~/ 2;
              return _buiddList(index);
            }),
```

在每一行中添加Padding

Padding也是一个基础组件，可以把`ListTilte`作为Padding的子widget

```
 return new Padding(
        padding: const EdgeInsets.all(16.0),
        child:  new ListTile(
            title : new Text("${_list[i]["login"]}", style: _biggerFont)
        )
      );
```

# 自定义类

创建一个Member的实体类：

```
class Member{
  String login;
  String avatarUrl;


  Member.login(this.login);

  Member(this.login, this.avatarUrl){
    if (avatarUrl == null) {
      throw new ArgumentError("avatarUrl of Member cannot be null. "
          "Received: '$avatarUrl'");
    }
  }
}
```

修改之前创建的_list，采用List<Member>去接收Member实体数据：

```
List<Member> _list2 = [];
```

并response中请求到的login个$avatar_url数据存放到_list2中：

```
 setState(() {
//      _list = response.data;
      for(var data in response.data){
//          Member member = new Member.login(data["login"]);
            Member member = new Member(data["login"], data["avatar_url"]);
          _list2.add(member);
      }
    });
```

最后修改_bulidList方法，把头像图片放在title之前：

```
child:  new ListTile(
//            title : new Text("${_list[i]["login"]}", style: _biggerFont)
            title : new Text("${_list2[i].login}", style: _biggerFont),
            leading: new CircleAvatar(
                backgroundColor: Colors.blue,
                //avatarUrl不能为空
                backgroundImage: new NetworkImage(_list2[i].avatarUrl)
            ),
        )
```

最终的效果如下：


<center>
<img src="https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/12/flutter/4.png" width="30%" height="30%" />

效果-2
</center>


- [**demo地址--Github**](https://github.com/wjw0315/wjw-flutter-app)

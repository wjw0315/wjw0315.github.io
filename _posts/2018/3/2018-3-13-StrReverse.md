---
layout:     post
title:      字符串反转
subtitle:   StrReverse     
date:       2018-3-13 
author:     wjw
header-img: img/post-bg-rwd.jpg 
catalog: true
stickie: true
tags:
    - java基础
--- 
> 字符串的反转

  ## 字符串反转输出
  
  ### 方法一：使用循环
  
 ```
 public class fanzhuan {

	public static String fz(){
		String s="asdfgghhj";
		char[] c=s.toCharArray();
		String result="";
		for(int i=c.length-1;i>=0;i--){
			result+=c[i];
			
		}
		System.out.println("原字符串为："+s);
		return result;
	}
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		System.out.println("结果为："+fz());
	}

}

 ```
 
 ### 方法二：使用API
 
 ```
 public static String fzapi(){
		String s="sasjdglhaslh";
		String c=new StringBuffer(s).reverse().toString();
		System.out.println("原字符串为："+s);
		return c;
		
	}
 ```

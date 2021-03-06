---
layout:     post                  
title:      Mybatis批量更新操作      
subtitle:   update_batch         
date:       2018-7-13             
author:     wjw                   
header-img: img/post-bg-rwd.jpg  
catalog: true    
stickie: true                      
tags:                             
- Mybatis 
- 数据库
---
  
 > 第一种用for循环通过循环传过来的参数集合，循环出N条sql，

>另一种用mysql的case when 条件判断变相的进行批量更新  

 **【注意】使用第一种方法要想成功，需要在db链接url后面带一个参数  &allowMultiQueries=true即：  jdbc:mysql://localhost:3306/mysqlTest?characterEncoding=utf-8&allowMultiQueries=true**
 
 ###  第一种
 
 ```
  <!-- 批量更新第一种方法，通过接收传进来的参数list进行循环着组装sql -->
    <update id="batchUpdate" parameterType="java.util.Map">
        <!-- 接收list参数，循环着组装sql语句，注意for循环的写法
             separator=";" 代表着每次循环完，在sql后面放一个分号
             item="cus" 循环List的每条的结果集
             collection="list" list 即为 map传过来的参数key -->
        <foreach collection="list" separator=";" item="cus">
            update t_customer set
            c_name = #{cus.name},
            c_age = #{cus.age},
            c_sex = #{cus.sex},
            c_ceroNo = #{cus.ceroNo},
            c_ceroType = #{cus.ceroType}
            where id = #{cus.id}
        </foreach>
    </update>

 ```
 
 ###  第二种
 
 ```
  <!-- 批量更新第二种方法，通过 case when语句变相的进行批量更新 -->
    <update id="batchUpdateCaseWhen" parameterType="java.util.Map">
        update t_customer
        <trim prefix="set" suffixOverrides=",">
            <!-- 拼接case when 这是一种写法 -->
            <!--<foreach collection="list" separator="" item="cus" open="c_age = case id" close="end, ">-->
            <!--when #{cus.id} then #{cus.age}-->
            <!--</foreach>-->
 
            <!-- 拼接case when 这是另一种写法，这种写着更专业的感觉 -->
            <trim prefix="c_name =case" suffix="end,">
                <foreach collection="list" item="cus">
                    <if test="cus.name!=null">
                        when id=#{cus.id} then #{cus.name}
                    </if>
                </foreach>
            </trim>
            <trim prefix="c_age =case" suffix="end,">
                <foreach collection="list" item="cus">
                    <if test="cus.age!=null">
                        when id=#{cus.id} then #{cus.age}
                    </if>
                </foreach>
            </trim>
            <trim prefix="c_sex =case" suffix="end,">
                <foreach collection="list" item="cus">
                    <if test="cus.sex!=null">
                        when id=#{cus.id} then #{cus.sex}
                    </if>
                </foreach>
            </trim>
            <trim prefix="c_ceroNo =case" suffix="end,">
                <foreach collection="list" item="cus">
                    <if test="cus.ceroNo!=null">
                        when id=#{cus.id} then #{cus.ceroNo}
                    </if>
                </foreach>
            </trim>
            <trim prefix="c_ceroType =case" suffix="end,">
                <foreach collection="list" item="cus">
                    <if test="cus.ceroType!=null">
                        when id=#{cus.id} then #{cus.ceroType}
                    </if>
                </foreach>
            </trim>
        </trim>
        <where>
            <foreach collection="list" separator="or" item="cus">
                id = #{cus.id}
            </foreach>
        </where>
    </update>

 ```
 
  **实例：**
 
 ![](https://gitee.com/wjw0215/blog_gitalk/raw/master/2018/8-9/1.png)
 
  ![](https://gitee.com/wjw0215/blog_gitalk/raw/master/2018/8-9/2.png)
  
   ![](https://gitee.com/wjw0215/blog_gitalk/raw/master/2018/8-9/3.png)

 
 

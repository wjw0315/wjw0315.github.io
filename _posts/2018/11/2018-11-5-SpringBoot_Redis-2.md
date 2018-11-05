---
layout:     post                  
title:      SpringBoot集成Redis的使用      
date:       2018-11-05             
author:     JiaweiWu        
header-img: img/post-bg-rwd.jpg  
category: springboot   
catalog: true  
tags:                             
- SpringBoot 
---


之前我们有一篇文章介绍了Redis的简单使用[http://wjwcloud.com/springboot/2018/10/10/SpringBoot_Redis-1/](http://wjwcloud.com/springboot/2018/10/10/SpringBoot_Redis-1/)

上面是如何通过自动配置的`StringRedisTemplate`对象进行Redis的读写操作，该对象从命名中就可注意到支持的是String类型。如果有使用过`spring-data-redis`的开发者一定熟悉`RedisTemplate<K, V>`接口，`StringRedisTemplate`就相当于`RedisTemplate<String, String>`的实现。

除了String类型，实战中我们还经常会在Redis中存储对象，这时候我们就会想是否可以使用类似`RedisTemplate<String, User>`来初始化并进行操作。但是Spring Boot并不支持直接使用，需要我们自己实现RedisSerializer<T>接口来对传入对象进行序列化和反序列化，下面我们通过一个实例来完成对象的读写操作。

# pom.xml依赖

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-redis</artifactId>
</dependency>
```

# 参数配置application.yml：

```
spring
    redis:
      open: true  # 是否开启redis缓存  true开启   false关闭
      database: 0
      host: localhost
      port: 6379
      password:       # 密码（默认为空）
      timeout: 6000  # 连接超时时长（毫秒）
      pool:
          max-active: 1000  # 连接池最大连接数（使用负值表示没有限制）
          max-wait: -1      # 连接池最大阻塞等待时间（使用负值表示没有限制）
          max-idle: 10      # 连接池中的最大空闲连接
          min-idle: 5       # 连接池中的最小空闲连接
```

# RedisConfig.java配置文件

```


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.*;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * @author Mr.W
 * @Description: TODO(Redis配置)
 * @date 2018-6-23 15:07
 */
@Configuration
public class RedisConfig {

    @Autowired
    private RedisConnectionFactory factory;

    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new StringRedisSerializer());
        redisTemplate.setConnectionFactory(factory);
        return redisTemplate;
    }

    @Bean
    public HashOperations<String, String, Object> hashOperations(RedisTemplate<String, Object> redisTemplate) {
        return redisTemplate.opsForHash();
    }

    @Bean
    public ValueOperations<String, String> valueOperations(RedisTemplate<String, String> redisTemplate) {
        return redisTemplate.opsForValue();
    }

    @Bean
    public ListOperations<String, Object> listOperations(RedisTemplate<String, Object> redisTemplate) {
        return redisTemplate.opsForList();
    }

    @Bean
    public SetOperations<String, Object> setOperations(RedisTemplate<String, Object> redisTemplate) {
        return redisTemplate.opsForSet();
    }

    @Bean
    public ZSetOperations<String, Object> zSetOperations(RedisTemplate<String, Object> redisTemplate) {
        return redisTemplate.opsForZSet();
    }

}

```

# RedisUtils.java （Redis的工具类）

```

import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.*;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * @author Mr.W
 * @Description: TODO(Redis工具类)
 * @date 2018-6-23 15:07
 */
@Component
public class RedisUtils {

    //是否开启redis缓存  true开启   false关闭
    @Value("${spring.redis.open: #{false}}")
    private boolean open;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    @Autowired
    private ValueOperations<String, String> valueOperations;
    @Autowired
    private HashOperations<String, String, Object> hashOperations;
    @Autowired
    private ListOperations<String, Object> listOperations;
    @Autowired
    private SetOperations<String, Object> setOperations;
    @Autowired
    private ZSetOperations<String, Object> zSetOperations;

    /**  默认过期时长，单位：秒 */
    public final static long DEFAULT_EXPIRE = 60 * 60 * 24;

    /**  不设置过期时长 */
    public final static long NOT_EXPIRE = -1;

    private final static Gson gson = new Gson();

    public boolean exists(String key) {
        if(!open){
            return false;
        }

        return redisTemplate.hasKey(key);
    }

    public void set(String key, Object value, long expire){
        if(!open){
            return;
        }

        valueOperations.set(key, toJson(value));
        if(expire != NOT_EXPIRE){
            redisTemplate.expire(key, expire, TimeUnit.SECONDS);
        }
    }

    public void set(String key, Object value){
        if(!open){
            return;
        }

        set(key, value, DEFAULT_EXPIRE);
    }

    public <T> T get(String key, Class<T> clazz, long expire) {
        if(!open){
            return null;
        }

        String value = valueOperations.get(key);
        if(expire != NOT_EXPIRE){
            redisTemplate.expire(key, expire, TimeUnit.SECONDS);
        }
        return value == null ? null : fromJson(value, clazz);
    }

    public <T> T get(String key, Class<T> clazz) {
        if(!open){
            return null;
        }

        return get(key, clazz, NOT_EXPIRE);
    }

    public String get(String key, long expire) {
        if(!open){
            return null;
        }

        String value = valueOperations.get(key);
        if(expire != NOT_EXPIRE){
            redisTemplate.expire(key, expire, TimeUnit.SECONDS);
        }
        return value;
    }

    public String get(String key) {
        if(!open){
            return null;
        }

        return get(key, NOT_EXPIRE);
    }

    public void delete(String key) {
        if(!open){
            return;
        }

        if(exists(key)){
            redisTemplate.delete(key);
        }
    }

    public void delete(String... keys) {
        if(!open){
            return;
        }

        for (String key : keys) {
            redisTemplate.delete(key);
        }
    }

    public void deletePattern(String pattern) {
        if(!open){
            return;
        }

        Set<String> keys = redisTemplate.keys(pattern);
        if (keys.size() > 0)
            redisTemplate.delete(keys);
    }

    /**
     * Object转成JSON数据
     */
    private String toJson(Object object){
        if(!open){
            return null;
        }

        if(object instanceof Integer || object instanceof Long || object instanceof Float ||
                object instanceof Double || object instanceof Boolean || object instanceof String){
            return String.valueOf(object);
        }
        return gson.toJson(object);
    }

    /**
     * JSON数据，转成Object
     */
    private <T> T fromJson(String json, Class<T> clazz){
        if(!open){
            return null;
        }

        return gson.fromJson(json, clazz);
    }

}

```

# 对象的使用，此处以User对象为例。

```
import cn.ecit319.common.cache.RedisUtils;
import cn.ecit319.model.SysUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author Mr.W
 * @Description: TODO()
 * @date 2018-7-27 16:11
 */
@Component
public class SysUserRedis {

    private static final String NAME="SysUser:";

    @Autowired
    private RedisUtils redisUtils;

    public void saveOrUpdate(SysUser user) {
        if(user==null){
            return ;
        }

        String id=NAME+user.getId();
        redisUtils.set(id, user);

        String username=NAME+user.getUsername();
        redisUtils.set(username, user);
    }

    public void delete(SysUser user) {
        if(user==null){
            return ;
        }

        redisUtils.delete(NAME+user.getId());
        redisUtils.delete(NAME+user.getUsername());
    }

    public SysUser get(Object key){
        return redisUtils.get(NAME+key, SysUser.class);
    }

}

```

然后就可直接使用了。


---
layout:     post                  
title:       JdbcTemplate     
date:       2019-7-31             
author:     JiaweiWu                   
header-img: img/post-bg-rwd.jpg  
category: JdbcTemplate   
catalog: true  
tags:                             
- JdbcTemplate
---

<a name="dBWpA"></a>
# 常规CRUD

```java
	//插入，增加
	public static void insert(User user) {
		String sql = "insert into user(name,birthday,money)values(?,?,?)";
		Object args[] = {user.getName(),user.getBirthday(),user.getMoney()};
		int temp = jdbc.update(sql, args);
		if (temp > 0) {
			System.out.println("插入成功！");
		}else{
			System.out.println("插入失败");
		}
	}
	
	//删除
	public static void delete(int id) {
		String sql = "delete from user where id = ?";
		Object args[] = new Object[]{id};
		int temp = jdbc.update(sql,args);
		if (temp > 0) {
			System.out.println("删除成功");
		}else {
			System.out.println("删除失败");
		}
	}
	
	//更新
	public static void update(User user) {
		String sql = "update user set name = ? where id = ?";
		Object args[] = new Object[]{user.getName(),user.getId()};
		int temp = jdbc.update(sql,args);
		if (temp > 0) {
			System.out.println("更新成功");
		}else {
			System.out.println("更新失败");
		}
		
	}
	
	//查询
	public static User query(int id) {
		String sql = "select * from user where id = ?";
		Object args[] = new Object[]{id};
		Object  user = jdbc.queryForObject(sql,args,new BeanPropertyRowMapper(User.class));
		return (User)user;
	}

```

<a name="KAqZW"></a>
# 使用KeyHolder 获取Spring JdbcTemplate插入记录ID

```java
 public NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    
    public void insert(){
            String insertSql = "insert into user(name,age) values (:name,:age)";
            User user = new User();
            user.setName("test");
            user.setAget(18);
            
            KeyHolder keyHolder = new GeneratedKeyHolder();
            int insertResult = namedParameterJdbcTemplate.update(insertSql, new BeanPropertySqlParameterSource(user), keyHolder);
            int userId = keyHolder.getKey().longValue();
   }

```

<a name="4o4aN"></a>
# 批量操作
<a name="AwK4E"></a>
## 批量插入

```java
 @Autowired
 private JdbcTemplate jdbcTemplate;

int batchInsert(final List<Stock> stockList)
    {
        logger.info("batchInsert() begin, stockList.size="+stockList.size());
        int[] updatedCountArray = jdbcTemplate.batchUpdate("insert into stock(id,code,name) value(?,?,?)", new BatchPreparedStatementSetter() {
            
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                // TODO Auto-generated method stub
                ps.setLong(1, stockList.get(i).getId());//下标从1开始
                ps.setString(2, stockList.get(i).getCode());
                ps.setString(3, stockList.get(i).getName());
            }
            
            public int getBatchSize() {
                return stockList.size();
            }
        });
        int sumInsertedCount = 0;
        for(int a: updatedCountArray)
        {
            sumInsertedCount+=a;
        }
        logger.info("batchInsert() end, stockList.size="+stockList.size()+",success inserted "+sumInsertedCount+" records");
        return sumInsertedCount;
    }
```
<a name="1XxnT"></a>
## 使用**NamedJdbcTemplate批量插入**

```java
@Autowired
private NamedJdbcTemplate namedJdbcTemplate;

int batchDelete(final List<Stock> stockList)
    {
        logger.info("batchDelete() begin, codeList.size="+stockList.size());
        SqlParameterSource[] batch = SqlParameterSourceUtils.createBatch(stockList.toArray());
        int[] updatedCountArray = namedJdbcTemplate.batchUpdate("delete from stock where code=:code", batch);
        int sumInsertedCount = 0;
        for(int a: updatedCountArray)
        {
            sumInsertedCount+=a;
        }
        logger.info("batchInsert() end, stockList.size="+stockList.size()+",success deleted "+sumInsertedCount+" records");
        return sumInsertedCount;
    }
```


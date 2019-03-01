---
layout:     post                  
title:      SpringBoot-AOP处理数据过滤   
date:       2019-03-01             
author:     JiaweiWu        
header-img: img/post-bg-rwd.jpg  
category: springboot   
catalog: true  
tags:                             
- SpringBoot 
---


近期在开发的过程中，碰到一个问题：在我们一个系统中，有时候存在需要控制登录用户所能过看到的数据。这就是所谓的数据权限。通常我们会有这样的一个思路，使用某一个字段去控制，从而在执行数据库语句的时候作为其中的条件去查询。然而我们重复的去增加不同条件语句，导致有时候接口不能复用，降低了程序的内聚。

因此就想到了使用AOP去处理这个问题。

下面就使用一个简单的示例去讲解我的整个思路：

###  前期准备：


采用部门去过滤数据，因此用户和部门存在一对一的关系。

另外我们有这张客户表`customer`，我们就使用这张表的数据进行过滤。

`Customer.java`
```
    private Long customerId;
	/** 公司全称 */
	private String companyFullName;
	/** 公司url */
	private String companyUrl;
	/** 公司地址 */
	private String companyAddress;
	/** 主要联系人 */
	private String primaryContactName;
	/** 年龄 */
	private Integer age;
	/** 职位 */
	private String position;
	/** 电话 */
	private String phone;

```

这个实体继承`BeseEntity.java`实体

```
    /** 创建者 */
    private String createBy;

    /** 创建时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    /** 更新者 */
    private String updateBy;

    /** 更新时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /** 备注 */
    private String remark;

    /** 请求参数 */
    private Map<String, Object> params;
    
    ...//get set 方法
    
    public Map<String, Object> getParams()
        {
            if (params == null)
            {
                params = new HashMap<>();
            }
            return params;
        }

    public void setParams(Map<String, Object> params)
        {
            this.params = params;
        }

```

此处就是请求参数`params`为关键。

接下来我们就通过切面编程给参数params进行set数据。

### 数据权限处理切面

#### 自定义数据权限注解

```
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface DataAuthority
{
    /**
     * 表的别名
     */
    public String tableAlias() default "";
}
```


#### 数据权限处理的切面

`DataAuthorityAspect.java`

```
@Aspect
@Component
public class DataAuthorityAspect
{
    /**
     * 全部数据权限
     */
    public static final String DATA_AUTHORITY_ALL = "1";

    /**
     * 自定数据权限
     */
    public static final String DATA_AUTHORITY_CUSTOM = "2";

    /**
     * 数据权限过滤关键字
     */
    public static final String DATA_AUTHORITY = "dataAuthority";

    // 配置织入点
    @Pointcut("@annotation(com.wjwcloud.common.annotation.DataAuthority)")
    public void dataAuthorityPointCut()
    {
    }

    @Before("dataAuthorityPointCut()")
    public void doBefore(JoinPoint point) throws Throwable
    {
        handleDataAuthority(point);
    }

    protected void handleDataAuthority(final JoinPoint joinPoint)
    {
        // 获得注解进行判断
        DataAuthority controllerDataAuthority = getAnnotationLog(joinPoint);
        if (controllerDataAuthority == null)
        {
            return;
        }
        // 获取当前的用户，系统集成Shiro,因此直接通过此工具类获取用户
        SysUser currentUser = ShiroUtils.getSysUser();
        if (currentUser != null)
        {
            // 如果是超级管理员，则不过滤数据
            if (!currentUser.isAdmin())
            {
                dataAuthorityFilter(joinPoint, currentUser, controllerDataAuthority.tableAlias());
            }
        }
    }

    /**
     * 数据范围过滤
     * @param joinPoint 切点
     * @param user 用户
     * @param alias 别名
     */
    public static void dataAuthorityFilter(JoinPoint joinPoint, SysUser user, String alias)
    {
        StringBuilder sqlString = new StringBuilder();

        for (SysRole role : user.getRoles())
        {
            //在角色的表中存在一个字段dataAuthority,该字段为数据范围（1：所有数据权限；2：自定数据权限）
            String dataAuthority = role.getDataAuthority();
            if (DATA_AUTHORITY_ALL.equals(dataAuthority))
            {
                sqlString = new StringBuilder();
                break;
            }
            else if (DATA_AUTHORITY_CUSTOM.equals(dataAuthority))
            {
                //此处就是进行sql查询添加的拼接
                sqlString.append(StringUtils.format(
                        " OR {}.dept_id IN ( SELECT dept_id FROM sys_role_dept WHERE role_id = {} ) ", alias,
                        role.getRoleId()));
            }
        }

        if (StringUtils.isNotBlank(sqlString.toString()))
        {
            //获取传入目标方法的参数对象
            BaseEntity baseEntity = (BaseEntity) joinPoint.getArgs()[0];
            //进行sql的拼接处理
            baseEntity.getParams().put(DATA_AUTHORITY, " AND (" + sqlString.substring(4) + ")");
        }
    }

    /**
     * 是否存在注解，如果存在就获取
     */
    private DataAuthority getAnnotationLog(JoinPoint joinPoint)
    {
        Signature signature = joinPoint.getSignature();
        MethodSignature methodSignature = (MethodSignature) signature;
        Method method = methodSignature.getMethod();

        if (method != null)
        {
            return method.getAnnotation(DataAuthority.class);
        }
        return null;
    }
}

```

### 该注解的使用

把该注解使用在需要限制过滤的查询数据的位置（service层实现类的查询方法处），并给与mapper相对应的数据表的别名

例如：

```
    @DataAuthority(tableAlias = "c")
	public List<Customer> selectCustomerList(Customer customer)
	{
	    return customerMapper.selectCustomerList(customer);
	}
```

并对相应的Mapper的xml进行处理：

```
  <sql id="selectCustomerVo">
        select c.customer_id, c.company_full_name, c.company_url, c.company_address,  c.primary_contact_name, c.sex, c.age, c.position, c.phone from crm_customer c
    </sql>
    <select id="selectCustomerList" parameterType="Customer" resultMap="CustomerResult">
        <include refid="selectCustomerVo"/>
        WHERE 1=1
        ......//此处省略其他判断的查询条件
        <!-- 数据过滤 -->
        ${params.dataAuthority}
    </select>
```

最终在执行查询的时候会出来如下类似的sql：

```
  select c.customer_id, c.company_full_name, c.company_url, c.company_address,  c.primary_contact_name, c.sex, c.age, c.position, c.phone from crm_customer c where 1=1 and c.dept_id IN ( SELECT dept_id FROM sys_role_dept WHERE role_id = ? )
```
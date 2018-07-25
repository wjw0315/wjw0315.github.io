---
layout:     post                  
title:      springboot����shiro-��¼��֤��Ȩ�޹���(1)
subtitle:   SpringBoot_shiro         
date:       2018-7-25             
author:     Mr.W                   
header-img: img/post-bg-rwd.jpg  
keywords_post:  "Shiro"
catalog: true                          
tags:                             
- SpringBoot 
- Shiro
---
  
��ƪ����������ѧϰ���ʹ��Spring Boot����Apache Shiro���������İ�ȫ����Ϊ��Ҫ����Java����һ����Spring Security��Apache Shiro�Ȱ�ȫ��ܣ���������Spring Security�����Ӵ�͸��ӣ��������˾��ѡ��Apache Shiro��ʹ�ã���ƪ���»��Ƚ���һ��Apache Shiro���ڽ��Spring Boot����ʹ�ð�����


## Apache Shiro

### ʲô�� Apache Shiro? 

Apache Shiro��һ������ǿ�����ģ���Դ�İ�ȫ��ܡ������Ըɾ�����ش��������֤����Ȩ����ҵ�Ự����ͼ��ܡ�

Apache Shiro����ҪĿ��������ʹ�ú���⡣��ȫͨ���ܸ��ӣ��������˸е���ʹ�࣬����Shiroȴ���������ӵġ�һ���õİ�ȫ���Ӧ�����θ����ԣ����Ⱪ¶�򵥡�ֱ�۵�API�����򻯿�����Աʵ��Ӧ�ó���ȫ�����ѵ�ʱ��;�����

Shiro����ʲô�أ�

* ��֤�û����
* �û�����Ȩ�޿��ƣ����磺1���ж��û��Ƿ������һ���İ�ȫ��ɫ��2���ж��û��Ƿ��������ĳ��������Ȩ��
* �ڷ� web �� EJB �����Ļ����¿�������ʹ��Session API
* ������Ӧ��֤�����ʿ��ƣ����� Session ���������з������¼�
* �ɽ�һ���������û���ȫ����Դ������ϳ�һ�����ϵ��û� "view"(��ͼ)
* ֧�ֵ����¼(SSO)����
* ֧���ṩ��Remember Me�����񣬻�ȡ�û�������Ϣ�������¼  
�� 

�ȵȡ��������ɵ�һ����������������ʹ�õ�API��

Shiro ����������Ӧ�û�����ʵ���������ܣ�С��������Ӧ�ó��򣬴���ҵӦ���У����Ҳ���Ҫ������������ܡ�������Ӧ�÷������ȡ���Ȼ Shiro ��Ŀ���Ǿ��������뵽������Ӧ�û�����ȥ����Ҳ����������֮����κλ����¿��伴�á�

### Apache Shiro Features ����

Apache Shiro��һ��ȫ��ġ��̺��ḻ���ܵİ�ȫ��ܡ���ͼΪ����Shiro���ܵĿ��ͼ��

 
![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/7-25/1.png)

Authentication����֤��, Authorization����Ȩ��, Session Management���Ự����, Cryptography�����ܣ��� Shiro ��ܵĿ����Ŷӳ�֮ΪӦ�ð�ȫ���Ĵ��ʯ����ô�����������������ǰɣ�

* **Authentication����֤����**�û����ʶ��ͨ������Ϊ�û�����¼��
* **Authorization����Ȩ����**���ʿ��ơ�����ĳ���û��Ƿ����ĳ��������ʹ��Ȩ�ޡ�
* **Session Management���Ự������**�ض����û��ĻỰ����,�����ڷ�web �� EJB Ӧ�ó���
* **Cryptography�����ܣ���**�ڶ�����Դʹ�ü����㷨���ܵ�ͬʱ����֤����ʹ�á�

���������Ĺ�����֧�ֺͼ�ǿ��Щ��ͬӦ�û����°�ȫ����Ĺ�ע�㡣�ر��Ƕ����µĹ���֧�֣�

* Web֧�֣�Shiro �ṩ�� web ֧�� api �����Ժ����ɵı��� web Ӧ�ó���İ�ȫ��
* ���棺������ Apache Shiro ��֤��ȫ�������١���Ч����Ҫ�ֶΡ�
* ������Apache Shiro ֧�ֶ��߳�Ӧ�ó���Ĳ������ԡ�
* ���ԣ�֧�ֵ�Ԫ���Ժͼ��ɲ��ԣ�ȷ�������Ԥ���һ����ȫ��
* "Run As"��������������û�������һ���û������(����ɵ�ǰ����)��
* "Remember Me"���� session ��¼�û�����ݣ�ֻ����ǿ����Ҫʱ����Ҫ��¼��


> ע�⣺ Shiro����ȥά���û���ά��Ȩ�ޣ���Щ��Ҫ�����Լ�ȥ���/�ṩ��Ȼ��ͨ����Ӧ�Ľӿ�ע���Shiro

### High-Level Overview �߼�����

�ڸ���㣬Shiro �ܹ�����������Ҫ�����Subject,SecurityManager�� Realm�������ͼչʾ����Щ�������໥���ã����ǽ����������ζ������������

 
![](https://raw.githubusercontent.com/wjw0315/blog_gitalk/master/2018/7-25/2.png)


- Subject����ǰ�û���Subject ������һ���ˣ���Ҳ�����ǵ����������ػ������ʻ���ʱ���ػ������������--��ǰ������������κ��¼���
- SecurityManager����������Subject��SecurityManager �� Shiro �ܹ��ĺ��ģ�����ڲ���ȫ�����ͬ��ɰ�ȫɡ��
- Realms�����ڽ���Ȩ����Ϣ����֤�������Լ�ʵ�֡�Realm ��������һ���ض��İ�ȫ DAO������װ������Դ���ӵ�ϸ�ڣ��õ�Shiro �������ص����ݡ������� Shiro ��ʱ�������ָ������һ��Realm ��ʵ����֤��authentication����/����Ȩ��authorization����

������Ҫʵ��Realms��Authentication �� Authorization������ Authentication ��������֤�û���ݣ�Authorization ����Ȩ���ʿ��ƣ����ڶ��û����еĲ�����Ȩ��֤�����û��Ƿ�������е�ǰ�����������ĳ�����ӣ�ĳ����Դ�ļ��ȡ�


## Demo


### ������Ϣ

**pom������**

``` xml
<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-thymeleaf</artifactId>
		</dependency>
		<dependency>
			<groupId>net.sourceforge.nekohtml</groupId>
			<artifactId>nekohtml</artifactId>
			<version>1.9.22</version>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		<dependency>
			<groupId>org.apache.shiro</groupId>
			<artifactId>shiro-spring</artifactId>
			<version>1.4.0</version>
		</dependency>
		<dependency>
			<groupId>mysql</groupId>
			<artifactId>mysql-connector-java</artifactId>
			<scope>runtime</scope>
		</dependency>
	</dependencies>
```

�ص��� shiro-spring��

**�����ļ�**

``` xml
spring:
    datasource:
      url: jdbc:mysql://localhost:3306/test
      username: root
      password: root
      driver-class-name: com.mysql.jdbc.Driver

    jpa:
      database: mysql
      show-sql: true
      hibernate:
        ddl-auto: update
        naming:
          strategy: org.hibernate.cfg.DefaultComponentSafeNamingStrategy
      properties:
         hibernate:
            dialect: org.hibernate.dialect.MySQL5Dialect

    thymeleaf:
       cache: false
       mode: LEGACYHTML5
```

thymeleaf��������Ϊ��ȥ��html��У��


**ҳ��**

�½�������ҳ���������ԣ�

- index.html ����ҳ
- login.html  ����¼ҳ
- userInfo.html �� �û���Ϣҳ��
- userInfoAdd.html ������û�ҳ��
- userInfoDel.html ��ɾ���û�ҳ��
- 403.html �� û��Ȩ�޵�ҳ��

������¼ҳ���������ܼ򵥣�������£�

``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<h1>index</h1>
</body>
</html>
```

### RBAC

RBAC �ǻ��ڽ�ɫ�ķ��ʿ��ƣ�Role-Based Access Control ���� RBAC �У�Ȩ�����ɫ��������û�ͨ����Ϊ�ʵ���ɫ�ĳ�Ա���õ���Щ��ɫ��Ȩ�ޡ���ͼ���ؼ���Ȩ�޵Ĺ������������ǲ㼶�໥�����ģ�Ȩ�޸������ɫ�����ѽ�ɫ�ָ����û���������Ȩ����ƺ���������������ܷ��㡣

����jpa�������Զ����ɻ�����񣬶�Ӧ��entity���£�

�û���Ϣ

``` java
@Entity
public class UserInfo implements Serializable {
    @Id
    @GeneratedValue
    private Integer uid;
    @Column(unique =true)
    private String username;//�ʺ�
    private String name;//���ƣ��ǳƻ�����ʵ��������ͬϵͳ��ͬ���壩
    private String password; //����;
    private String salt;//�����������
    private byte state;//�û�״̬,0:����δ��֤������û�м��û��������֤��ȵȣ�--�ȴ���֤���û� , 1:����״̬,2���û�������.
    @ManyToMany(fetch= FetchType.EAGER)//���������ݿ��н��м�������;
    @JoinTable(name = "SysUserRole", joinColumns = { @JoinColumn(name = "uid") }, inverseJoinColumns ={@JoinColumn(name = "roleId") })
    private List<SysRole> roleList;// һ���û����ж����ɫ

    // ʡ�� get set ����
 }
```


��ɫ��Ϣ

``` java
@Entity
public class SysRole {
    @Id@GeneratedValue
    private Integer id; // ���
    private String role; // ��ɫ��ʶ�������ж�ʹ��,��"admin",�����Ψһ��:
    private String description; // ��ɫ����,UI������ʾʹ��
    private Boolean available = Boolean.FALSE; // �Ƿ����,��������ý�������Ӹ��û�

    //��ɫ -- Ȩ�޹�ϵ����Զ��ϵ;
    @ManyToMany(fetch= FetchType.EAGER)
    @JoinTable(name="SysRolePermission",joinColumns={@JoinColumn(name="roleId")},inverseJoinColumns={@JoinColumn(name="permissionId")})
    private List<SysPermission> permissions;

    // �û� - ��ɫ��ϵ����;
    @ManyToMany
    @JoinTable(name="SysUserRole",joinColumns={@JoinColumn(name="roleId")},inverseJoinColumns={@JoinColumn(name="uid")})
    private List<UserInfo> userInfos;// һ����ɫ��Ӧ����û�

    // ʡ�� get set ����
 }
```


Ȩ����Ϣ

``` java
@Entity
public class SysPermission implements Serializable {
    @Id@GeneratedValue
    private Integer id;//����.
    private String name;//����.
    @Column(columnDefinition="enum('menu','button')")
    private String resourceType;//��Դ���ͣ�[menu|button]
    private String url;//��Դ·��.
    private String permission; //Ȩ���ַ���,menu���ӣ�role:*��button���ӣ�role:create,role:update,role:delete,role:view
    private Long parentId; //�����
    private String parentIds; //������б�
    private Boolean available = Boolean.FALSE;
    @ManyToMany
    @JoinTable(name="SysRolePermission",joinColumns={@JoinColumn(name="permissionId")},inverseJoinColumns={@JoinColumn(name="roleId")})
    private List<SysRole> roles;

    // ʡ�� get set ����
 }
```

�������ϵĴ�����Զ�����user_info���û���Ϣ����sys_role����ɫ����sys_permission��Ȩ�ޱ���sys_user_role���û���ɫ����sys_role_permission����ɫȨ�ޱ������ű�Ϊ�˷���������Ǹ������ű����һЩ��ʼ�����ݣ�

``` sql
INSERT INTO `user_info` (`uid`,`username`,`name`,`password`,`salt`,`state`) VALUES ('1', 'admin', '����Ա', 'd3c59d25033dbf980d29554025c23a75', '8d78869f470951332959580424d4bf4f', 0);
INSERT INTO `sys_permission` (`id`,`available`,`name`,`parent_id`,`parent_ids`,`permission`,`resource_type`,`url`) VALUES (1,0,'�û�����',0,'0/','userInfo:view','menu','userInfo/userList');
INSERT INTO `sys_permission` (`id`,`available`,`name`,`parent_id`,`parent_ids`,`permission`,`resource_type`,`url`) VALUES (2,0,'�û����',1,'0/1','userInfo:add','button','userInfo/userAdd');
INSERT INTO `sys_permission` (`id`,`available`,`name`,`parent_id`,`parent_ids`,`permission`,`resource_type`,`url`) VALUES (3,0,'�û�ɾ��',1,'0/1','userInfo:del','button','userInfo/userDel');
INSERT INTO `sys_role` (`id`,`available`,`description`,`role`) VALUES (1,0,'����Ա','admin');
INSERT INTO `sys_role` (`id`,`available`,`description`,`role`) VALUES (2,0,'VIP��Ա','vip');
INSERT INTO `sys_role` (`id`,`available`,`description`,`role`) VALUES (3,1,'test','test');
INSERT INTO `sys_role_permission` VALUES ('1', '1');
INSERT INTO `sys_role_permission` (`permission_id`,`role_id`) VALUES (1,1);
INSERT INTO `sys_role_permission` (`permission_id`,`role_id`) VALUES (2,1);
INSERT INTO `sys_role_permission` (`permission_id`,`role_id`) VALUES (3,2);
INSERT INTO `sys_user_role` (`role_id`,`uid`) VALUES (1,1);
```

### Shiro ����

����Ҫ���õ���ShiroConfig�࣬Apache Shiro ����ͨ�� Filter ��ʵ�֣��ͺ���SpringMvc ͨ��DispachServlet ��������һ����
��Ȼ��ʹ�� Filter һ��Ҳ���ܲµ�����ͨ��URL���������й��˺�Ȩ��У�飬����������Ҫ����һϵ�й���URL�Ĺ���ͷ���Ȩ�ޡ�


**ShiroConfig**

``` java
@Configuration
public class ShiroConfig {
	@Bean
	public ShiroFilterFactoryBean shirFilter(SecurityManager securityManager) {
		System.out.println("ShiroConfiguration.shirFilter()");
		ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
		shiroFilterFactoryBean.setSecurityManager(securityManager);
		//������.
		Map<String,String> filterChainDefinitionMap = new LinkedHashMap<String,String>();
		// ���ò��ᱻ���ص����� ˳���ж�
		filterChainDefinitionMap.put("/static/**", "anon");
		//�����˳� ������,���еľ�����˳�����Shiro�Ѿ�������ʵ����
		filterChainDefinitionMap.put("/logout", "logout");
		//<!-- ���������壬��������˳��ִ�У�һ�㽫/**������Ϊ�±� -->:����һ�����أ�һ��С�Ĵ���Ͳ���ʹ��;
		//<!-- authc:����url��������֤ͨ���ſ��Է���; anon:����url����������������-->
		filterChainDefinitionMap.put("/**", "authc");
		// ���������Ĭ�ϻ��Զ�Ѱ��Web���̸�Ŀ¼�µ�"/login.jsp"ҳ��
		shiroFilterFactoryBean.setLoginUrl("/login");
		// ��¼�ɹ���Ҫ��ת������
		shiroFilterFactoryBean.setSuccessUrl("/index");

		//δ��Ȩ����;
		shiroFilterFactoryBean.setUnauthorizedUrl("/403");
		shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
		return shiroFilterFactoryBean;
	}

	@Bean
	public MyShiroRealm myShiroRealm(){
		MyShiroRealm myShiroRealm = new MyShiroRealm();
		return myShiroRealm;
	}


	@Bean
	public SecurityManager securityManager(){
		DefaultWebSecurityManager securityManager =  new DefaultWebSecurityManager();
		securityManager.setRealm(myShiroRealm());
		return securityManager;
	}
}
```

Filter Chain����˵����

- 1��һ��URL�������ö��Filter��ʹ�ö��ŷָ�
- 2�������ö��������ʱ��ȫ����֤ͨ��������Ϊͨ��
- 3�����ֹ�������ָ����������perms��roles


Shiro���õ�FilterChain

Filter Name |  Class
---     |  ---      
anon |org.apache.shiro.web.filter.authc.AnonymousFilter
authc |org.apache.shiro.web.filter.authc.FormAuthenticationFilter
authcBasic |org.apache.shiro.web.filter.authc.BasicHttpAuthenticationFilter
perms | org.apache.shiro.web.filter.authz.PermissionsAuthorizationFilter
port |org.apache.shiro.web.filter.authz.PortFilter
rest | org.apache.shiro.web.filter.authz.HttpMethodPermissionFilter
roles | org.apache.shiro.web.filter.authz.RolesAuthorizationFilter
ssl | org.apache.shiro.web.filter.authz.SslFilter
user | org.apache.shiro.web.filter.authc.UserFilter

- anon:����url���������������� 
- authc: ��Ҫ��֤���ܽ��з��� 
- user:���ü�ס�һ���֤ͨ�����Է��� 


**��¼��֤ʵ��**

����֤����Ȩ�ڲ�ʵ�ֻ����ж����ᵽ�����մ���������Real���д�����Ϊ��Shiro�У�������ͨ��Realm����ȡӦ�ó����е��û�����ɫ��Ȩ����Ϣ�ġ�ͨ������£���Realm�л�ֱ�Ӵ����ǵ�����Դ�л�ȡShiro��Ҫ����֤��Ϣ������˵��Realm��ר���ڰ�ȫ��ܵ�DAO.
Shiro����֤�������ջύ��Realmִ�У���ʱ�����Realm��```getAuthenticationInfo(token)```������

�÷�����Ҫִ�����²���:  

- 1������ύ�Ľ�����֤��������Ϣ  
- 2������������Ϣ������Դ(ͨ��Ϊ���ݿ�)�л�ȡ�û���Ϣ  
- 3�����û���Ϣ����ƥ����֤��   
- 4����֤ͨ��������һ����װ���û���Ϣ��```AuthenticationInfo```ʵ����  
- 5����֤ʧ�����׳�```AuthenticationException```�쳣��Ϣ��  

�������ǵ�Ӧ�ó�����Ҫ���ľ����Զ���һ��Realm�࣬�̳�AuthorizingRealm�����࣬����doGetAuthenticationInfo()����д��ȡ�û���Ϣ�ķ�����

doGetAuthenticationInfo����д

``` java
@Override
protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token)
        throws AuthenticationException {
    System.out.println("MyShiroRealm.doGetAuthenticationInfo()");
    //��ȡ�û���������˺�.
    String username = (String)token.getPrincipal();
    System.out.println(token.getCredentials());
    //ͨ��username�����ݿ��в��� User��������ҵ���û�ҵ�.
    //ʵ����Ŀ�У�������Ը���ʵ����������棬���������Shiro�Լ�Ҳ����ʱ�������ƣ�2�����ڲ����ظ�ִ�и÷���
    UserInfo userInfo = userInfoService.findByUsername(username);
    System.out.println("----->>userInfo="+userInfo);
    if(userInfo == null){
        return null;
    }
    SimpleAuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo(
            userInfo, //�û���
            userInfo.getPassword(), //����
            ByteSource.Util.bytes(userInfo.getCredentialsSalt()),//salt=username+salt
            getName()  //realm name
    );
    return authenticationInfo;
}
```

**����Ȩ�޵�ʵ��**

shiro��Ȩ����Ȩ��ͨ���̳�```AuthorizingRealm```�����࣬����```doGetAuthorizationInfo();```�����ʵ�ҳ���ʱ��������������Ӧ��Ȩ�޻���shiro��ǩ�Ż�ִ�д˷������򲻻�ִ�У��������ֻ�Ǽ򵥵������֤û��Ȩ�޵Ŀ��ƵĻ�����ô����������Բ�����ʵ�֣�ֱ�ӷ���null���ɡ��������������Ҫ��ʹ���ࣺ```SimpleAuthorizationInfo```���н�ɫ����Ӻ�Ȩ�޵���ӡ�

``` java
@Override
protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
    System.out.println("Ȩ������-->MyShiroRealm.doGetAuthorizationInfo()");
    SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
    UserInfo userInfo  = (UserInfo)principals.getPrimaryPrincipal();
    for(SysRole role:userInfo.getRoleList()){
        authorizationInfo.addRole(role.getRole());
        for(SysPermission p:role.getPermissions()){
            authorizationInfo.addStringPermission(p.getPermission());
        }
    }
    return authorizationInfo;
}
```

��ȻҲ�������set���ϣ�roles�Ǵ����ݿ��ѯ�ĵ�ǰ�û��Ľ�ɫ��stringPermissions�Ǵ����ݿ��ѯ�ĵ�ǰ�û���Ӧ��Ȩ��

``` java
authorizationInfo.setRoles(roles);
authorizationInfo.setStringPermissions(stringPermissions);
```

����˵�����shiro�����ļ��������```filterChainDefinitionMap.put(��/add��, ��perms[Ȩ�����]��);```��˵������/add������ӱ���Ҫ�С�Ȩ����ӡ����Ȩ�޲ſ��Է��ʣ������shiro�����ļ��������```filterChainDefinitionMap.put(��/add��, ��roles[100002]��perms[Ȩ�����]��);```��˵������```/add```������ӱ���Ҫ�С�Ȩ����ӡ����Ȩ�޺;��С�100002�������ɫ�ſ��Է��ʡ�


**��¼ʵ��**

��¼������ʵֻ�Ǵ����쳣�������Ϣ������ĵ�¼��֤����shiro������

``` java
@RequestMapping("/login")
public String login(HttpServletRequest request, Map<String, Object> map) throws Exception{
    System.out.println("HomeController.login()");
    // ��¼ʧ�ܴ�request�л�ȡshiro������쳣��Ϣ��
    // shiroLoginFailure:����shiro�쳣���ȫ����.
    String exception = (String) request.getAttribute("shiroLoginFailure");
    System.out.println("exception=" + exception);
    String msg = "";
    if (exception != null) {
        if (UnknownAccountException.class.getName().equals(exception)) {
            System.out.println("UnknownAccountException -- > �˺Ų����ڣ�");
            msg = "UnknownAccountException -- > �˺Ų����ڣ�";
        } else if (IncorrectCredentialsException.class.getName().equals(exception)) {
            System.out.println("IncorrectCredentialsException -- > ���벻��ȷ��");
            msg = "IncorrectCredentialsException -- > ���벻��ȷ��";
        } else if ("kaptchaValidateFailed".equals(exception)) {
            System.out.println("kaptchaValidateFailed -- > ��֤�����");
            msg = "kaptchaValidateFailed -- > ��֤�����";
        } else {
            msg = "else >> "+exception;
            System.out.println("else -- >" + exception);
        }
    }
    map.put("msg", msg);
    // �˷����������¼�ɹ�,��shiro���д���
    return "/login";
}
```

����dao���service�Ĵ���Ͳ��������˴��ֱ�ӿ����롣


### ����

1����д�ú�Ϳ����������򣬷���`http://localhost:8080/userInfo/userList`ҳ�棬����û�е�¼�ͻ���ת��`http://localhost:8080/login`ҳ�档��¼֮��ͻ���ת��indexҳ�棬��¼��ֱ���������������`http://localhost:8080/userInfo/userList`���ʾͻῴ���û���Ϣ��������Щ����ʱ�򴥷�```MyShiroRealm.doGetAuthenticationInfo()```���������Ҳ���ǵ�¼��֤�ķ�����

2����¼admin�˻������ʣ�```http://127.0.0.1:8080/userInfo/userAdd```��ʾ```�û���ӽ���```������```http://127.0.0.1:8080/userInfo/userDel```��ʾ```403û��Ȩ��```��������Щ����ʱ�򴥷�```MyShiroRealm.doGetAuthorizationInfo()```������棬Ҳ����Ȩ��У��ķ�����

3���޸�admin��ͬ��Ȩ�޽��в���

shiro��ǿ�������������˵�¼��֤��Ȩ�޹������������ܣ����������Ժ���ʱ������̽�֡�

**[ʾ������-github--���ڲ���]()**




�ο���

[Apache Shiro�����ֲ�](https://waylau.gitbooks.io/apache-shiro-1-2-x-reference/content/)   
[Spring Boot ShiroȨ�޹������㿪ʼѧSpring Boot��](http://412887952-qq-com.iteye.com/blog/2299777)  
[SpringBoot+shiro����ѧϰ֮��¼��֤��Ȩ�޿���](http://z77z.oschina.io/2017/02/13/SpringBoot+shiro%E6%95%B4%E5%90%88%E5%AD%A6%E4%B9%A0%E4%B9%8B%E7%99%BB%E5%BD%95%E8%AE%A4%E8%AF%81%E5%92%8C%E6%9D%83%E9%99%90%E6%8E%A7%E5%88%B6/)

---
layout:     post                  
title:      SpringBoot-邮件服务      
date:       2018-10-17             
author:     JiaweiWu        
header-img: img/post-bg-rwd.jpg  
category: springboot   
catalog: true  
tags:                             
- SpringBoot 
---


> 邮件服务也是网站必备的功能之一，像网站的注册验证，在忘记密码的时候进行取回密码之类的。spring推出了JavaMailSender更加简化了邮件发送的过程。现在SpringBoot封装了spring-boot-starter-mail来使用，方便快捷。

# 一、开始简单的使用

#### 1、pom.xml引入包

```
<dependencies>
	<dependency> 
	    <groupId>org.springframework.boot</groupId>
	    <artifactId>spring-boot-starter-mail</artifactId>
	</dependency> 
</dependencies>
```

#### 2、在application.properties中添加邮箱配置

```
spring.mail.host=smtp.163.com //邮箱服务器地址
spring.mail.username=***@163.com //用户名
spring.mail.password=*** //密码
spring.mail.default-encoding=UTF-8

mail.fromMail.addr=***@163.com  //以谁来发送邮件
```

#### 3、编写mailService实现

```
@Component
public class MailServiceImpl implements MailService{

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private JavaMailSender mailSender;

    @Value("${mail.fromMail.addr}")
    private String from;

    @Override
    public void sendSimpleMail(String to, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content);

        try {
            mailSender.send(message);
            logger.info("简单邮件已经发送。");
        } catch (Exception e) {
            logger.error("发送简单邮件时发生异常！", e);
        }

    }
}
```

#### 4、进行test测试

```
@RunWith(SpringRunner.class)
@SpringBootTest
public class MailServiceTest {

    @Autowired
    private MailService MailService;

    @Test
    public void testSimpleMail() throws Exception {
        MailService.sendSimpleMail("***@163.com","test simple mail"," hello this is simple mail");
    }
}
```

一个简单的文本邮件发送结束。

**如果我们想发送HTML格式的邮件、附件文件、或者是模本邮件应该怎么做呢？**

# 二、HTML格式的邮件

在MailService的实现中添加sendHtmlMail（）方法

```
public void sendHtmlMail(String to, String subject, String content) {
    MimeMessage message = mailSender.createMimeMessage();

    try {
        //true表示需要创建一个multipart message
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(content, true);

        mailSender.send(message);
        logger.info("html邮件发送成功");
    } catch (MessagingException e) {
        logger.error("发送html邮件时发生异常！", e);
    }
}
```

在test中测试发送

```
@Test
public void testHtmlMail() throws Exception {
    String content="<html>\n" +
            "<body>\n" +
            "    <h3>hello world ! 这是一封Html邮件!</h3>\n" +
            "</body>\n" +
            "</html>";
    MailService.sendHtmlMail("***@163.com","test simple mail",content);
}
```

# 三、发送附件的邮件

在MailService的实现中添加sendAttachmentsMail（）方法

```
public void sendAttachmentsMail(String to, String subject, String content, String filePath){
    MimeMessage message = mailSender.createMimeMessage();

    try {
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(content, true);

        FileSystemResource file = new FileSystemResource(new File(filePath));
        String fileName = filePath.substring(filePath.lastIndexOf(File.separator));
        helper.addAttachment(fileName, file);

        mailSender.send(message);
        logger.info("带附件的邮件已经发送。");
    } catch (MessagingException e) {
        logger.error("发送带附件的邮件时发生异常！", e);
    }
}
```

**添加多个附件可以使用多条 helper.addAttachment(fileName, file)**

在test中测试发送

```
@Test
public void sendAttachmentsMail() {
    String filePath="e:\\tmp\\application.log";
    mailService.sendAttachmentsMail("***@163.com", "主题：带附件的邮件", "有附件，请查收！", filePath);
}
```


# 四、发送带静态资源的文件

在MailService的实现中添加sendInlineResourceMail（）方法
```
public void sendInlineResourceMail(String to, String subject, String content, String rscPath, String rscId){
    MimeMessage message = mailSender.createMimeMessage();

    try {
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(content, true);

        FileSystemResource res = new FileSystemResource(new File(rscPath));
        helper.addInline(rscId, res);

        mailSender.send(message);
        logger.info("嵌入静态资源的邮件已经发送。");
    } catch (MessagingException e) {
        logger.error("发送嵌入静态资源的邮件时发生异常！", e);
    }
}
```

在test中进行测试

```
@Test
public void sendInlineResourceMail() {
    String rscId = "006";
    String content="<html><body>这是有图片的邮件：<img src=\'cid:" + rscId + "\' ></body></html>";
    String imgPath = "C:\\Users\\down\\Pictures\\favicon.png";

    mailService.sendInlineResourceMail("***@163.com", "主题：这是有图片的邮件", content, imgPath, rscId);
}
```
**添加多个图片可以使用多条 `<img src='cid:" + rscId + "' >` 和 `helper.addInline(rscId, res) `来实现**

# 五、邮件系统


上面的都是基础服务，平时我们接收到的邮件都是有模板的，，只要替换其中的一些参数。

模板的本质很简单，就是在模板中替换变化的参数，转换为html字符串即可，这里以thymeleaf为例来演示。

**1、pom中导入thymeleaf的包**
```
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```
**2、在resorces/templates下创建emailTemplate.html**
```
<!DOCTYPE html>
<html lang="zh" xmlns:th="http://www.thymeleaf.org">
    <head>
        <meta charset="UTF-8"/>
        <title>Title</title>
    </head>
    <body>
        您好,这是验证邮件,请点击下面的链接完成验证,<br/>
        <a href="#" th:href="@{ http://www.***.com/n/{id}(id=${id}) }">激活账号</a>
    </body>
</html>
```
**3、解析模板并发送**
```
@Test
public void sendTemplateMail() {
    //创建邮件正文
    Context context = new Context();
    context.setVariable("id", "006");
    String emailContent = templateEngine.process("emailTemplate", context);

    mailService.sendHtmlMail("***@163.com","主题：这是模板邮件",emailContent);
}
```

**发送失败**

因为各种原因，总会有邮件发送失败的情况，比如：邮件发送过于频繁、网络异常等。在出现这种情况的时候，我们一般会考虑重新重试发送邮件，会分为以下几个步骤来实现：

- 1、接收到发送邮件请求，首先记录请求并且入库。
- 2、调用邮件发送接口发送邮件，并且将发送结果记录入库。
- 3、启动定时系统扫描时间段内，未发送成功并且重试次数小于3次的邮件，进行再次发送
- 4、重新发送邮件的时间，建议以 2 的次方间隔时间，比如：2、4、8、16 ...

**常见的错误返回码：**

- 421 HL:ICC 该IP同时并发连接数过大，超过了网易的限制，被临时禁止连接。
- 451 Requested mail action not taken: too much fail authentication 登录失败次数过多，被临时禁止登录。请检查密码与帐号验证设置
- 553 authentication is required，密码配置不正确
- 554 DT:SPM 发送的邮件内容包含了未被许可的信息，或被系统识别为垃圾邮件。请检查是否有用户发送病毒或者垃圾邮件；
- 550 Invalid User 请求的用户不存在
- 554 MI:STC 发件人当天内累计邮件数量超过限制，当天不再接受该发件人的投信。

如果使用一个邮箱频繁发送相同内容邮件，也会被认定为垃圾邮件，报 554 DT:SPM 错误

如果使用网易邮箱可以查看这里的提示：企业退信的常见问题？

**异步发送**

很多时候邮件发送并不是我们主业务必须关注的结果，比如通知类、提醒类的业务可以允许延时或者失败。这个时候可以采用异步的方式来发送邮件，加快主交易执行速度，在实际项目中可以采用MQ发送邮件相关参数，监听到消息队列之后启动发送邮件。


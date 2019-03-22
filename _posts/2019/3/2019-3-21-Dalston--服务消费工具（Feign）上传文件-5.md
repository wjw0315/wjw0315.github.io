---
layout:     post                  
title:      Dalston--服务消费工具（Feign）上传文件-5  
date:       2019-3-21             
author:     JiaweiWu        
header-img: img/post-bg-rwd.jpg  
category: SpringCloud   
catalog: true  
tags:                             
- SpringCloud
- Dalston
---

> 文件的上传需要引入Feign的扩展包来进行实现。

### 服务提供方

- 提供上传文件的服务接口。
- 直接在之前服务提供方`eureka-client`工程中添加一个`UploadController`类编写请求接口。

```
@RestController
public class UploadController {

    @PostMapping(value = "/uploadFile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String handleFileUpload(@RequestPart(value = "file") MultipartFile file) {
        System.out.println("----------------"+file.getName());
        return file.getName();
    }
}
```

### 服务消费

- 复制使用之前服务消费方的工程`eureka-consumer-feign`重命名为`eureka-consumer-feign-upload`
- `pom.xml`引入相关的依赖

```
		<dependency>
			<groupId>io.github.openfeign.form</groupId>
			<artifactId>feign-form</artifactId>
			<version>3.0.3</version>
		</dependency>
		<dependency>
			<groupId>io.github.openfeign.form</groupId>
			<artifactId>feign-form-spring</artifactId>
			<version>3.0.3</version>
		</dependency>
		<dependency>
			<groupId>commons-fileupload</groupId>
			<artifactId>commons-fileupload</artifactId>
			<version>1.3.3</version>
		</dependency>
		<!--Slf4j日志-->
		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
		</dependency>
```

- 创建一个form表单的编码配置器

```
@Configuration
public class FormSupportConfig {

    // new一个form编码器，实现支持form表单提交
    @Bean
    public Encoder feignFormEncoder() {
        return new SpringFormEncoder();
    }
}
```

- 使用Feign创建接口来调用服务提供方的接口

```
@FeignClient(value = "eureka-client", configuration = FormSupportConfig.class)
public interface DcService {

        @PostMapping(value = "/uploadFile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        String handleFileUpload(@RequestPart(value = "file") MultipartFile file);

}

```

- 编写测试类进行测试

```

@Slf4j
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class FeignUploadTest {

    private  final Logger logger = LoggerFactory.getLogger(FeignUploadTest.class);

    @Autowired
    DcService dcService;

    @Test
    @SneakyThrows
    public void testHandleFileUpload() {

        File file = new File("upload.txt");
        DiskFileItem fileItem = (DiskFileItem) new DiskFileItemFactory().createItem("file",
                MediaType.TEXT_PLAIN_VALUE, true, file.getName());

        try (InputStream input = new FileInputStream(file); OutputStream os = fileItem.getOutputStream()) {
            IOUtils.copy(input, os);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid file: " + e, e);
        }

        MultipartFile multi = new CommonsMultipartFile(fileItem);
        String s = dcService.handleFileUpload(multi);
        System.out.println("+++++++++++++++++++"+s);
//        logger.info(s);
    }

}

```

### 源码地址
 **GitHub:**[https://github.com/wjw0315/SpringCloud-Dalston-Demo](https://github.com/wjw0315/SpringCloud-Dalston-Demo)
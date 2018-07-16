---
layout:     post                  
title:      Java��˽���ǰ�˴���Json      
subtitle:   update_batch         
date:       2018-7-13             
author:     wjw                   
header-img: img/post-bg-rwd.jpg  
catalog: true                          
tags:                             
- Json 
- Java
---
  
>ʹ��Json��

### һ��

ǰ�˴�ֵ��


```

     $.ajax({
     	type:"post",
     	url:"***/***",
     	data:{
     		formdata: JSON.stringify(formdata),
     		
     	},
     	success:function(data){
     		alert("****");
     	},
     	error:function(data){
     		alert("***");
     	}

```

��˽�����

```
public void ***(){
		String formdata = getPara("formdata");
	        JSONObject jo = JSONObject.fromObject(formdata);
		//��json�ַ���ת��json����������ֵ��
		 Map<String, Object> map =jo;
		 Record r = new Record();
                for (Entry<String, Object> entry : map.entrySet()) {  
        	r.set(entry.getKey(), entry.getValue());
                } 
	}

```

### ����

ǰ��formdata�е�json���ݣ�

```
 "[{\"rect\":{\"left\":\"372\",\"top\":\"28\",\"width\":\"67\",\"height\":\"56\"},\"word\":\"N\"},{\"rect\":{\"left\":\"335\",\"top\":\"87\",\"width\":\"144\",\"height\":\"21\"},\"word\":\"\\u7f51\\u9f99\\u7f51\\u7edc\\u6709\\u9650\\u516c\\u53f8\"},{\"rect\":{\"left\":\"334\",\"top\":\"106\",\"width\":\"145\",\"height\":\"18\"},\"word\":\" Netdragon Websoft in,\"}]";
```

��̨������

```
String jsons=request.getParameter("formdata");
JSONArray js = new JSONArray(jsons);
        for (int i = 0; i < js.length(); i++) {
            JSONObject ob = js.getJSONObject(i);
            System.out.println(ob.get("word"));
        }
```

### ����

ǰ�˴�ֵ��

```
url: http://localhost:8080/xxx/***!addOrder
json:{"addOrder":xxx}
```

��˽�����

```
public class OrderAction{
    public void addOrder(){
        JSONObject parameters = ParameterUtil.getParameters(request);
        JSONObject fromObject = JSONObject.fromObject(parameters.get("addOrder"));
    }
}
```

ParameterUtil��:

```
public class ParameterUtil {
    public static JSONObject getParameters(HttpServletRequest request)
            throws UnsupportedEncodingException, IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(
                (ServletInputStream) request.getInputStream(), "utf-8"));
        StringBuffer sb = new StringBuffer("");
        String temp;
        while ((temp = br.readLine()) != null) {
            sb.append(temp);
        }
        br.close();
        String acceptjson = sb.toString();
        JSONObject jo = null;
        if (acceptjson != "") {
            jo = JSONObject.fromObject(acceptjson);
        }
        return jo;
    }
}
```
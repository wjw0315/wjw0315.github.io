  ---
  layout:     post                  
  title:      �ַ�����ת      
  subtitle:   StrReverse         
  date:       2018-3-13             
  author:     wjw                   
  header-img: img/post-bg-rwd.jpg  
  catalog: true                          
  tags:                             
      - Java����
  ---
  
  ## �ַ�����ת���
  
  ### ����һ��ʹ��ѭ��
  
 ```
 public class fanzhuan {

	public static String fz(){
		String s="asdfgghhj";
		char[] c=s.toCharArray();
		String result="";
		for(int i=c.length-1;i>=0;i--){
			result+=c[i];
			
		}
		System.out.println("ԭ�ַ���Ϊ��"+s);
		return result;
	}
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		System.out.println("���Ϊ��"+fz());
	}

}

 ```
 
 ### ��������ʹ��API
 
 ```
 public static String fzapi(){
		String s="sasjdglhaslh";
		String c=new StringBuffer(s).reverse().toString();
		System.out.println("ԭ�ַ���Ϊ��"+s);
		return c;
		
	}
 ```
---
layout:     post                  
title:      �߳����ȼ�      
subtitle:   �߳����ȼ�����          
date:       2018-7-22             
author:     Mr.W                   
header-img: img/post-bg-rwd.jpg  
keywords_post:  "���� ���߳�"
catalog: true                          
tags:                             
- Java����
- ���߳�
---
  
>ÿ���̶߳���һ��"���ȼ�"�����ȼ�������������ʾ��ȡֵ��ΧΪ0~10��0Ϊ������ȼ���10λ������ȼ����������ĸ��߳���Ҫ����ʱ�����Ȳ鿴�Ƿ�������ȼ��ߵĿɵ����̣߳�������ڣ��ʹ���ѡ����е��ȡ��������ĸ��߳���Ҫ����ʱ�����Ȳ鿴�Ƿ�������ȼ��ߵĿɵ����̣߳�������ڣ��ʹ���ѡ����е��ȡ������̵߳�ʱ��Ƭ����֮��ϵͳ�鿴�Ƿ������һ�����ȼ��ȽϸߵĿɵ����̣߳�������ھ͵��ȡ��������ν����жϵ����̡߳�

>�������з�ʽʵ���߳����ȼ�����--1����̬������ʾ��2�������ֱ�ʾ

# �߳����ȼ�ʵ�֣�

(1)Thread�����������ȼ���̬������MAX_PRIORITYΪ10��Ϊ�߳�������ȼ���MIN_PRIORITYȡֵΪ1��Ϊ�߳�������ȼ���NORM_PRIORITYȡֵΪ5��Ϊ�߳��м�λ�õ����ȼ���Ĭ������£��̵߳����ȼ�ΪNORM_PRIORITY��

(2)Java�е��߳���ͬ������£���������ͬʱ�������̣߳����ȼ��ߵ��߳��Ȼ�ȡCPU��Դ���ȱ��������У����ȼ��͵��̺߳��ȡCPU��Դ����ִ�С���������������ڼ�������Ƕ�˶��̵߳����ã��п������ȼ��͵��̱߳����ȼ��ߵ��߳������У����ȼ��ߵ��߳̿��ܱ����ȼ��͵��̺߳����У��̵߳�ִ���Ⱥ�����Java��������Ⱦ����ġ�

```
class firstFamilyThread implements Runnable {
	Thread thread;// ����һ���߳�
	public firstFamilyThread() {
	}
 
	public firstFamilyThread(String name) {// ���췽����ʼ��һ���߳�
		thread = new Thread(this, name); // ����1 ��Ҫ���õ��߳�thread�� ����2
											// ��Ҫ���õ��߳�thread������
	}
 
	@Override
	public void run() {
		System.out.println("��һ�飺" + thread.getName());// ����̵߳�����
	}
 
	public void startThreadByLevel() {// �÷�������5���̣߳��������費ͬ�����ȼ�
		// ʵ����5��������ڵ��õ�һ�ι������д����߳�
		firstFamilyThread f1 = new firstFamilyThread("5");
		firstFamilyThread f2 = new firstFamilyThread("4");
		firstFamilyThread f3 = new firstFamilyThread("3");
		firstFamilyThread f4 = new firstFamilyThread("2");
		firstFamilyThread f5 = new firstFamilyThread("1");
		// �����߳����ȼ�-����ȫ�ֱ���thread��Ȼ���������ȼ�
		f1.thread.setPriority(Thread.MAX_PRIORITY);//MAX_PRIORITY 10
		f2.thread.setPriority(Thread.MAX_PRIORITY-1);//9
		f3.thread.setPriority(Thread.NORM_PRIORITY);//NORM_PRIORITY 5
		f4.thread.setPriority(Thread.NORM_PRIORITY-1);//4
		f5.thread.setPriority(Thread.MIN_PRIORITY);//MIN_PRIORITY 1
		f1.thread.start();
		f2.thread.start();
		f3.thread.start();
		f4.thread.start();
		f5.thread.start();
		try {
			f5.thread.join();
		} catch (InterruptedException e) {
			System.out.println("�ȴ��߳̽������� "+e.getMessage());
		}
	}
 
}
class secondFamilyThread implements Runnable {
	Thread thread;// ����һ���߳�
	public secondFamilyThread() {
	}
 
	public secondFamilyThread(String name) {// ���췽����ʼ��һ���߳�
		thread = new Thread(this, name); // ����1 ��Ҫ���õ��߳�thread�� ����2
											// ��Ҫ���õ��߳�thread������
	}
 
	@Override
	public void run() {
		System.out.println("�ڶ���Ա��" + thread.getName());// ����̵߳�����
	}
 
	public void startThreadByLevel() {// �÷�������5���̣߳��������費ͬ�����ȼ�
		// ʵ����5��������ڵ��õ�һ�ι������д����߳�
		secondFamilyThread s1 = new secondFamilyThread("5");
		secondFamilyThread s2 = new secondFamilyThread("4");
		secondFamilyThread s3 = new secondFamilyThread("3");
		secondFamilyThread s4 = new secondFamilyThread("2");
		secondFamilyThread s5 = new secondFamilyThread("1");
		// �����߳����ȼ�-����ȫ�ֱ���thread��Ȼ���������ȼ�
		s1.thread.setPriority(10);//MAX_PRIORITY 10
		s2.thread.setPriority(9);//9
		s3.thread.setPriority(5);//NORM_PRIORITY 5
		s4.thread.setPriority(4);//4
		s5.thread.setPriority(1);//MIN_PRIORITY 1
		s1.thread.start();
		s2.thread.start();
		s3.thread.start();
		s4.thread.start();
		s5.thread.start();
		try {
			s5.thread.join();
		} catch (InterruptedException e) {
			System.out.println("�ȴ��߳̽������� "+e.getMessage());
		}
	}
 
}
public class TextPriorityLevel extends Thread {// �����������ȼ�ʵ��
	public static void main(String[] args) {
		System.out.println("ʵ��Runnable�ӿڣ����ݾ�̬�ȼ�����ʵ���߳����ȼ�");
		new firstFamilyThread().startThreadByLevel();
		System.out.println("ʵ��Runnable�ӿڣ��������ִӸߵ���ʵ���߳����ȼ�");
		new secondFamilyThread().startThreadByLevel();
	}
}
```

������ܻ����һЩƫ����Ǵ��¶�����ѭ���̵߳����ȼ�
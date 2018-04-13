package com.ls.EmailRegistration.Controller;

import com.ls.EmailRegistration.Service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.mail.*;
import javax.mail.internet.MimeMessage;

import java.util.Properties;
import java.util.Random;


/**
 * @author chenqiang
 */
@Controller
@RequestMapping("/EmailController")
public class EmailController {

    @Autowired
    EmailService emailService;

    /**
     *
     * @param email  发送邮箱验证码(注册)
     * @return 验证码给前段
     */
    @RequestMapping(value = "/verifyEmail",method= RequestMethod.POST)
    @ResponseBody
    public String verifyEmail(@RequestParam("email") String email){
        Properties prop = new Properties();
        // 开启debug调试，以便在控制台查看
        prop.setProperty("mail.debug", "true");
        // 设置邮件服务器主机名
        prop.setProperty("mail.host", "smtp.qq.com");
        // 发送服务器需要身份验证
        prop.setProperty("mail.smtp.auth", "true");
        // 发送邮件协议名称
        prop.setProperty("mail.transport.protocol", "smtp");

        prop.put("mail.smtp.ssl.enable", "true");

        // 创建session
        Session session = Session.getInstance(prop);
        // 通过session得到transport对象
        Transport ts = null;
        try {
            ts = session.getTransport();
        } catch (NoSuchProviderException e) {
            e.printStackTrace();
        }
        // 连接邮件服务器：邮箱类型，帐号，授权码代替密码（更安全）
        try {
            ts.connect("smtp.qq.com", "554824942", "hpifogzyvixdbfbh");// 后面的字符是授权码
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        //随机生成四位数字
        String str="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder stringBuilder=new StringBuilder(4);
        for(int i=0;i<4;i++)
        {
            char ch=str.charAt(new Random().nextInt(str.length()));
            stringBuilder.append(ch);
        }
        MimeMessage message=null;
        // 创建邮件
        try {
            message=emailService.createSimpleMail(session,email,stringBuilder.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 发送邮件
        try {
            ts.sendMessage(message, message.getAllRecipients());
            session.setDebug(true);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        try {
            ts.close();
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        String cunt=stringBuilder.toString();
        return cunt;
    }

    /**
     * 找回密码
     * @param email
     * @return
     */
    @RequestMapping(value = "/retrieve",method= RequestMethod.POST)
    @ResponseBody
    public String retrievePassword(@RequestParam("email") String email){
        Properties prop = new Properties();
        // 开启debug调试，以便在控制台查看
        prop.setProperty("mail.debug", "true");
        // 设置邮件服务器主机名
        prop.setProperty("mail.host", "smtp.qq.com");
        // 发送服务器需要身份验证
        prop.setProperty("mail.smtp.auth", "true");
        // 发送邮件协议名称
        prop.setProperty("mail.transport.protocol", "smtp");

        prop.put("mail.smtp.ssl.enable", "true");

        // 创建session
        Session session = Session.getInstance(prop);
        // 通过session得到transport对象
        Transport ts = null;
        try {
            ts = session.getTransport();
        } catch (NoSuchProviderException e) {
            e.printStackTrace();
        }
        // 连接邮件服务器：邮箱类型，帐号，授权码代替密码（更安全）
        try {
            ts.connect("smtp.qq.com", "554824942", "hpifogzyvixdbfbh");// 后面的字符是授权码
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        //随机生成四位数字
        String str="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder stringBuilder=new StringBuilder(4);
        for(int i=0;i<4;i++)
        {
            char ch=str.charAt(new Random().nextInt(str.length()));
            stringBuilder.append(ch);
        }
        MimeMessage message=null;
        try {
            message=emailService.retrievePassword(session,email,stringBuilder.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 发送邮件
        try {
            ts.sendMessage(message, message.getAllRecipients());
            session.setDebug(true);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        try {
            ts.close();
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        String cunt=stringBuilder.toString();
        return cunt;
    }

}

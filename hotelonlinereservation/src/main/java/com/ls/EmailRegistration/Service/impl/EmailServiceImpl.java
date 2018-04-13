package com.ls.EmailRegistration.Service.impl;

import com.ls.EmailRegistration.Service.EmailService;
import org.springframework.stereotype.Service;

import javax.mail.Message;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

/**
 * @author chenqiang
 */
@Service
public class EmailServiceImpl implements EmailService {

    /**
     * 注册
     * @Method: createSimpleMail
     * @Description: 创建一封只包含文本的邮件
     */
    public  MimeMessage createSimpleMail(Session session, String email,String stringBuilder) throws Exception  {
        // 创建邮件对象
        MimeMessage message = new MimeMessage(session);
        // 指明邮件的发件人
        message.setFrom(new InternetAddress("554824942@qq.com"));
        // 指明邮件的收件人
        message.setRecipient(Message.RecipientType.TO, new InternetAddress(email));
        // 邮件的标题
        message.setSubject("sea View 账号注册");
        // 邮件的文本内容
        message.setContent("欢迎您注册sea View,账号注册验证码为(一分钟有效):"+stringBuilder+",请勿回复此邮箱", "text/html;charset=UTF-8");
        // 返回创建好的邮件对象
        return message;
    }

    /**
     * 找回密码
     * @param session
     * @param email
     * @param stringBuilder 验证码
     * @return
     * @throws Exception
     */
    public MimeMessage retrievePassword(Session session, String email, String stringBuilder) throws Exception {
        // 创建邮件对象
        MimeMessage message = new MimeMessage(session);
        // 指明邮件的发件人
        message.setFrom(new InternetAddress("554824942@qq.com"));
        // 指明邮件的收件人
        message.setRecipient(Message.RecipientType.TO, new InternetAddress(email));
        // 邮件的标题
        message.setSubject("sea View 密码找回");
        // 邮件的文本内容
        message.setContent("您找回sea View的密码,验证码为(一分钟有效，如非本人操作，请赶快修改密码):"+stringBuilder+",请勿回复此邮箱", "text/html;charset=UTF-8");
        return message;
    }

}

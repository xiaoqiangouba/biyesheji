package com.ls.EmailRegistration.Service;

import javax.mail.Session;
import javax.mail.internet.MimeMessage;

/**
 * @author chenqiang
 */
public interface EmailService {
    /**
     * 创建邮箱(注册)
     * @param session
     * @param email
     * @param stringBuilder 验证码
     * @return
     */
    MimeMessage createSimpleMail(Session session, String email, String stringBuilder)throws Exception;

    /**
     * 创建邮箱(找回密码)
     * @param session
     * @param email
     * @param stringBuilder 验证码
     * @return
     * @throws Exception
     */
    MimeMessage retrievePassword(Session session, String email, String stringBuilder)throws Exception;
}

package com.ls.UserRegistration.Controller;

import com.ls.UserRegistration.pojo.ShiroKit;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.DisabledAccountException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 测试
 */
@Controller
@RequestMapping(value = "/testController")
public class testController {

    @ResponseBody
    @RequestMapping(value = "/test",method= RequestMethod.POST)
    public String init(String userName, String passWord){
        System.out.println(userName);
        System.out.println(passWord);
        UsernamePasswordToken token =   new UsernamePasswordToken(userName, passWord);
        token.setRememberMe(true);
        //System.out.println(token.getPassword()+"-----------");
        try {
            Subject currentUser = SecurityUtils.getSubject();
            currentUser.login(token);
            Session session = ShiroKit.getSession();

            if(token.getUsername().equals("123")&&token.getPassword().equals("123")) {
                return "success";
            }
        } catch (UnknownAccountException e) {

            return "账号不存在1";
        } catch (DisabledAccountException e) {

            return "账号未启用2";
        } catch (IncorrectCredentialsException e) {

            return "密码错误3";
        } catch (RuntimeException e) {

            return "未知错误,请联系管理员4";
        }
        return "";
    }
}

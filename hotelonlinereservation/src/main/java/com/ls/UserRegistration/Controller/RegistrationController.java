package com.ls.UserRegistration.Controller;

import com.ls.UserRegistration.Service.UserService;
import com.ls.UserRegistration.pojo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * @author chenqiang
 * 用户注册控制器
 */
@Controller
@RequestMapping("/RegistrationController")
public class RegistrationController {

    @Autowired
    UserService userService;
    /**
     * @param userName 用户名
     * @return
     * @verifyUserName 检验用户名
     */
    @ResponseBody
    @RequestMapping(value = "/verifyUserName",method= RequestMethod.POST)
    public boolean verifyUserName(@RequestParam("userName") String userName){
        boolean cunt=userService.verifyUserName(userName);
        return cunt;
    }

    /**
     *
     * @param email 邮箱
     * @return 检验邮箱
     */
    @ResponseBody
    @RequestMapping(value = "/verifyEmail",method= RequestMethod.POST)
    public boolean verifyEmail(@RequestParam("email") String email){
        boolean cunt=userService.verifyEmail(email);
        return cunt;
    }

    /**
     * 用户注册
     * @param user 用户实体类
     * @return 注册结果
     */
    @ResponseBody
    @RequestMapping(value = "/registrationUser",method= RequestMethod.POST)
    public boolean registrationUser(User user){
        //生成id
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        user.setId(uuid);
        String salt = ShiroKit.getRandomSalt(5);
        String pwdMd5 = ShiroKit.md5(user.getPassword(), salt);
        user.setPassword(pwdMd5);
        user.setSalt(salt);
       int cunt= userService.saveUser(user);
       if(cunt==1){
           return true;
       }else{
           return false;
       }

    }

    /**
     * 用户登录
     * @param user
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/userLogin",method= RequestMethod.POST)
    public Msg userLogin(User user){
        boolean cout=userService.userLogin(user);
        if(cout==true){
            String id=userService.getId(user);
            Map<String, Object> loginInfo = new HashMap<String,Object>();
            loginInfo.put("userId",id);
            String sessionId = JavaWebToken.createJavaWebToken(loginInfo);
            return Msg.success().add("id", sessionId);
        }
      return Msg.fail();
    }

    /**
     * 根据id查询用户姓名
     * @param id
     * @return
     */
    @ResponseBody
    @RequestMapping(value ="/getName",method = {RequestMethod.GET,RequestMethod.POST})
    public Msg getName(HttpServletRequest request, @RequestParam("id") String id){
        //System.out.println(id);
        //从session拿到token，再解密得到userid
        try {
            String userId = AuthUtil.getUserId(id);
            User list= userService.getName(userId);
            return Msg.success().add("list",list);
        } catch (Exception e) {
            e.printStackTrace();
        }
     return null;
    }

    /**
     * 跟据邮箱改密码
     * @param user
     * @return
     */
    @ResponseBody
    @RequestMapping(value ="/updataPassword",method = RequestMethod.POST)
    public int updataPassword(User user){
       int n= userService.updataPassword(user);
        return n;
    }
}

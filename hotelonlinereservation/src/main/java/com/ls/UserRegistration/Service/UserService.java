package com.ls.UserRegistration.Service;


import com.ls.UserRegistration.pojo.User;

import java.util.List;

/**
 * @author chenqing
 * 用户接口
 */
public interface UserService {
    /**
     * 检验用户名是否存在
     * @param userName
     * @return
     */
    public boolean verifyUserName(String userName);

    /**
     * 检验邮箱是否存在
     * @param email
     * @return
     */
    public boolean verifyEmail(String email);

    /**
     * 用户注册
     * @param user
     * @return
     */
    public int saveUser(User user);

    /**
     * 用户登录
     * @param user
     * @return
     */
    public boolean userLogin(User user);

    /**
     * 根据id查询用户姓名
     * @param id
     */
    public User getName(String id);

    /**
     * 查询id
     * @param user
     */
    public  String getId(User user);

    /**
     * 根据邮箱改密码
     * @param user
     */
    public int updataPassword(User user);
}

package com.ls.UserRegistration.Service.impl;

import com.ls.UserRegistration.Service.UserService;
import com.ls.UserRegistration.dao.UserMapper;
import com.ls.UserRegistration.pojo.ShiroKit;
import com.ls.UserRegistration.pojo.User;
import com.ls.UserRegistration.pojo.UserExample;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author chenqiang
 * 实现用户接口
 */
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;

    /**
     *
     * @param userName 用户名
     * @return  true : 代表可用，false : 代表不可用
     * cunt==0 为true
     */
    public boolean verifyUserName(String userName){
        //构造查询条件
        UserExample userExample=new UserExample();
        UserExample.Criteria criteria=userExample.createCriteria();
        criteria.andUsernameEqualTo(userName);
        //条件查询
        long cunt=userMapper.countByExample(userExample);
        return cunt==0;
    }

    /**
     *
     * @param email  邮箱
     * @return true : 代表可用，false : 代表不可用
     * cunt==0 为true
     */
    public boolean verifyEmail(String email){
        //构造查询条件
        UserExample userExample=new UserExample();
        UserExample.Criteria criteria=userExample.createCriteria();
        criteria.andEamilEqualTo(email);
        //条件查询
        long cunt=userMapper.countByExample(userExample);
        return cunt==0;
    }

    /**
     * 保存用户信息
     * @param user
     * @return
     */
    public int saveUser(User user){
        return userMapper.insert(user);
    }

    /**
     * 用户登录
     * @param user
     * @return
     */
    public boolean userLogin(User user){
     String salt= userMapper.selectSaltByName(user.getUsername());
     if(salt==null){
         return false;
     }
     String pwdMd5 = ShiroKit.md5(user.getPassword(), salt);
      List<User> listUser= userMapper.selectByExample(null);
        for (User listuser:listUser
             ) {
            if(listuser.getUsername().equals(user.getUsername())&&listuser.getPassword().equals(pwdMd5)){
                  return true;
            }
        }
        return false;
    }

    /**
     * 根据id查询用户名
     * @param id
     * @return
     */
    public User getName(String id){
       User listUser=  userMapper.selectByPrimaryKey(id);
        return listUser;
    }

    /**
     * 查询用户id
     * @param user
     */
    public  String getId(User user){
        return   userMapper.selectIdByName(user.getUsername());
    }

    /**
     * 根据邮箱改密码
     * @param user
     * @return
     */
    public int updataPassword(User user) {
        String name= userMapper.selectByPrimaryEmail(user.getEamil());
        user.setPassword(ShiroKit.md5(user.getPassword(),  userMapper.selectSaltByName(name)));
        return userMapper.updatePasswordByEmail(user);
    }
}

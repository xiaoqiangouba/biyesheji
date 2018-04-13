package com.ls.UserRegistration.dao;

import com.ls.UserRegistration.pojo.User;
import com.ls.UserRegistration.pojo.UserExample;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserMapper {
    int countByExample(UserExample example);

    int deleteByExample(UserExample example);

    int deleteByPrimaryKey(String id);

    int insert(User record);

    int insertSelective(User record);

    List<User> selectByExample(UserExample example);

    User selectByPrimaryKey(String id);

    //根据邮箱查询姓名
    String selectByPrimaryEmail(String email);
    //根据姓名查询盐码
    String selectSaltByName(String username);

    //根据姓名查询id
    String selectIdByName(String username);
    //根据邮箱改密码
    int updatePasswordByEmail(User record);

    int updateByExampleSelective(@Param("record") User record, @Param("example") UserExample example);

    int updateByExample(@Param("record") User record, @Param("example") UserExample example);

    int updateByPrimaryKeySelective(User record);

    int updateByPrimaryKey(User record);
}
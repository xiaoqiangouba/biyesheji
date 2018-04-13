package com.ls.Order.dao;

import com.ls.Order.pojo.Order;
import com.ls.Order.pojo.OrderExample;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface OrderMapper {
    int countByExample(OrderExample example);

    int deleteByExample(OrderExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(Order record);

    int insertSelective(Order record);

    //查看统计
    List<Order> selectRopment();

    //查看个人钱
    List<Order> selectOne(String username);

    List<Order> selectByExample(OrderExample example);

    List<Order> selectOrderByuserName(String name);

    Order selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") Order record, @Param("example") OrderExample example);

    int updateByExample(@Param("record") Order record, @Param("example") OrderExample example);

    int updateByPrimaryKeySelective(Order record);

    int updateByPrimaryKey(Order record);
}
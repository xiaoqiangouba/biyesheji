package com.ls.Order.Service;

import com.ls.Order.pojo.Order;

import java.util.List;

public interface OrderService {
    /**
     * 保存订单
     *
     * @param username
     * @param start_Time
     *@param end_Time
     * @param order   @return
     */
    public int saveOrder(String username, String start_Time, String end_Time, Order order,int pn);

    /**
     * 查询订单(个人)
     * @param username
     * @return
     */
    public List<Order> selectOrder(String username);

    /**
     * 退订房间
     * @param id
     * @return
     */
    public int deleteOrder(Integer id);

    /**
     * 查询订单(全部)
     * @return
     */
    public List<Order> selectAll();

    /**
     * 查看统计
     * @return
     */
    public List<Order> selectRopment();

    /**
     * 查看个人钱
     * @return
     */
    public List<Order> selectOne(String username);
}

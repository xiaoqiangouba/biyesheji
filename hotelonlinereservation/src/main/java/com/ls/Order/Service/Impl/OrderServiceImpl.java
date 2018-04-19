package com.ls.Order.Service.Impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.ls.Order.Service.OrderService;
import com.ls.Order.dao.OrderMapper;
import com.ls.Order.pojo.Order;
import com.ls.Order.pojo.OrderExample;
import com.ls.Room.pojo.Room;
import com.ls.RoomManagement.Service.Impl.MangementServiceImpl;
import com.ls.RoomManagement.dao.JesisDao;
import net.sf.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

@Service
public class OrderServiceImpl implements OrderService{

    private  static  PageInfo pageInfo = null;
    @Autowired
    OrderMapper orderMapper;
    @Autowired
    MangementServiceImpl mangementService;
    /**
     * 保存订单
     *
     * @param username
     * @param start_Time
     *@param end_Time
     * @param order   @return
     */
    public int saveOrder(String username, String start_Time, String end_Time, Order order,int pn) {
        JesisDao jesisDao=new JesisDao();
        //获取连接池
        Jedis jedis= jesisDao.getJedis();

        order.setUsername(username);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            order.setEndTime(sdf.parse(end_Time));
            order.setStartTime(sdf.parse(start_Time));
        } catch (ParseException e) {
            e.printStackTrace();
        }

        order.setState(1);
        int n=  orderMapper.insert(order);
        //更新新缓存
        PageHelper.startPage(pn, 4);
        List<Room> list= mangementService.selectRoom();
        //出入连续显示de页数
        pageInfo=new PageInfo(list,6);
        //转成标准的json字符串
        JSONArray jsonarray = JSONArray.fromObject(pageInfo);
        String json = jsonarray.toString();
        //存放在redis数据
        jedis.set("room_com"+pn, json);
        jedis.close();
        return  n;
    }

    /**
     * 查询订单
     * @param username
     * @return
     */
    public List<Order> selectOrder(String username) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        List<Order> list = null;
        list= orderMapper.selectOrderByuserName(username);

        return list;
    }

    /**
     * 退订房间
     * @param id
     * @return
     */
    public int deleteOrder(Integer id) {
      int n=  orderMapper.deleteByPrimaryKey(id);
        JesisDao jesisDao=new JesisDao();
        //获取连接池
        Jedis jedis= jesisDao.getJedis();
        //更新新缓存
        Set<String> set = jedis.keys( "room_com*");
        Iterator<String> it = set.iterator();
        while(it.hasNext()){
            String keyStr = it.next();
            jedis.del(keyStr);
        }
        jedis.close();
        return n;
    }

    /**
     * 查询订单(全部)
     * @return
     */
    public List<Order> selectAll() {
        OrderExample orderExample=new OrderExample();

        return  orderMapper.selectByExample(orderExample);
    }

    /**
     * 查看统计
     * @return
     */
    public List<Order> selectRopment() {
        return orderMapper.selectRopment();
    }

    /**
     * 查看个人钱
     * @return
     */
    public List<Order> selectOne(String username) {

        return orderMapper.selectOne(username);
    }

    /**
     * 根据房间号查询状态
     * @param number
     * @return
     */
    public Order selectOrderByNmuber(String number) {
        return   orderMapper.selectOrderByNmuber(number);
    }

}

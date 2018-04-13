package com.ls.Order.Controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.ls.Order.Service.OrderService;
import com.ls.Order.pojo.Order;
import com.ls.UserRegistration.Service.UserService;
import com.ls.UserRegistration.pojo.AuthUtil;
import com.ls.UserRegistration.pojo.Msg;
import com.ls.UserRegistration.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author chenqiang
 */
@Controller
@RequestMapping("/OrderController")
public class OrderController {

    @Autowired
    OrderService service;

    @Autowired
    UserService userService;
    /**
     * 保存订单信息
     * @return end_Time
     */
    @RequestMapping(value = "/saveOrder",method = RequestMethod.POST)
    @ResponseBody
    public int saveOrder(@RequestParam(value="userid")String userid,@RequestParam(value="end_Time")String end_Time,@RequestParam(value="start_Time")String start_Time, Order order,@RequestParam(value="pn")int pn){
        User user = null;
        try {
            String userId = AuthUtil.getUserId(userid);
            user= userService.getName(userId);

        } catch (Exception e) {
            e.printStackTrace();
        }

        return  service.saveOrder(user.getUsername(),start_Time,end_Time,order,pn);
    }

    /**
     * 查询订单(个人)
     * @return
     */
    @RequestMapping(value = "/selectOrder",method = RequestMethod.GET)
    @ResponseBody
    public Msg selectOrder(@RequestParam(value="userid")String userid,@RequestParam(value="pn")Integer pn){

        User user=null;
        try {
            String userId = AuthUtil.getUserId(userid);
            user= userService.getName(userId);
            PageHelper.startPage(pn,5);
        } catch (Exception e) {
            e.printStackTrace();
        }
        List<Order> list=service.selectOrder(user.getUsername());
        PageInfo pageInfo=new PageInfo(list,6);
        return Msg.success().add("pageInfo",pageInfo);
    }

    /**
     * 退订房间
     * @return
     */
    @RequestMapping(value = "/deleteOrder/{id}",method = RequestMethod.DELETE)
    @ResponseBody
    public int deleteOrder(@PathVariable("id")Integer id){
        return service.deleteOrder(id);
    }

    /**
     * 查询订单(全部)
     * @return
     */
    @RequestMapping(value = "/selectAll",method = RequestMethod.GET)
    @ResponseBody
    public Msg selectAll(@RequestParam(value="pn")Integer pn){

        PageHelper.startPage(pn,5);
        List<Order> list=service.selectAll();
        PageInfo pageInfo=new PageInfo(list,6);
        return Msg.success().add("pageInfo",pageInfo);
    }

    /**
     * 个人订单统计
     */
    @RequestMapping("/selectRopment")
    @ResponseBody
    public Msg ropment(){
        return Msg.success().add("list",service.selectRopment());
    }

    /**
     * 查看个人钱
     */
    @RequestMapping("/selectOne")
    @ResponseBody
     public Msg selectOne(@RequestParam(value="username")String username){

        return  Msg.success().add("list",service.selectOne(username));
     }


}

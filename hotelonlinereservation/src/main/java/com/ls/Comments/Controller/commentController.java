package com.ls.Comments.Controller;

import com.ls.Comments.Service.CommentService;
import com.ls.Comments.Service.GiveService;
import com.ls.Comments.pojo.Comments;
import com.ls.Comments.pojo.Give;
import com.ls.RoomManagement.dao.JesisDao;
import com.ls.UserRegistration.Service.UserService;
import com.ls.UserRegistration.pojo.AuthUtil;
import com.ls.UserRegistration.pojo.Msg;
import com.ls.UserRegistration.pojo.User;
import net.sf.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import redis.clients.jedis.Jedis;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * @author chenqiang
 */
@Controller
@RequestMapping("/commentController")
public class commentController {

    @Autowired
    CommentService commentService;

    @Autowired
    GiveService giveService;

    @Autowired
    UserService userService;

    /*private static  JesisDao jesisDao;
    private static   Jedis jedis;*/
    /**
     * 查询评论和房间
     * @return
     */
    @RequestMapping("/selectRoonAndCom")
    @ResponseBody
    public Msg selectRoonAndCom(@RequestParam(value="pn")Integer pn,@RequestParam(value="roomId")String roomId){

           JesisDao jesisDao=new JesisDao();
            //获取连接池
            Jedis jedis= jesisDao.getJedis();
            if(jedis.get("comment"+roomId)!=null){
                //如果redis缓存,则返回数据
                String name=jedis.get("comment"+roomId);
                jedis.close();
                return Msg.success().add("list",name);
            }else{
            List<Comments> list=commentService.selectRoonAndCom(roomId);
            //转成标准的json字符串
            JSONArray jsonarray = JSONArray.fromObject(list);
            String json = jsonarray.toString();
            //存放在redis数据
            jedis.set("comment"+roomId, json);
            String name=jedis.get("comment"+roomId);
            jedis.close();
            return Msg.success().add("list",name);
        }

    }

    /**
     * 保存评论
     * @return
     */
    @RequestMapping(value = "/saveComment",method = RequestMethod.POST)
    @ResponseBody
    public int saveComment(@RequestParam(value="roomId")String roomId,@RequestParam(value="userId")String userId,@RequestParam(value="context")String context){
        Date now = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        String time = dateFormat.format(now);
        User user = null;
        try {
            String userid = AuthUtil.getUserId(userId);
            if(userid=="404"){
               return 404;
            }
            user= userService.getName(userid);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return  commentService.saveComment(roomId,user.getUsername(),context,time);
    }

    /**
     *保存点赞
     * @return
     */
    @RequestMapping(value = "/saveGive",method = RequestMethod.GET)
    @ResponseBody
    public Msg saveGive(@RequestParam(value="id")Integer id,@RequestParam(value="user")String user,@RequestParam(value="roomid")String roomid){

        User uu=null;
        try {
            String userid = AuthUtil.getUserId(user);
            uu=userService.getName(userid);
        } catch (Exception e) {
            e.printStackTrace();
        }
        Comments comments=commentService.selectStateBykey(id,uu.getUsername());
         if(comments==null){
             Give give=new Give();
             give.setId(id);
             give.setUsername(uu.getUsername());
             give.setState(1);
             int n=giveService.savaGive(give);
             if(n==0){
                 //更新数据
                 commentService.updataNumber(id,roomid);
             }

            return Msg.success().add("comments",n);
         }
        return Msg.success().add("comments",comments);
    }

    /**
     * 删除评论
     * @return
     */
    @RequestMapping(value = "/deleteCom/{id}/{roomId}",method = RequestMethod.DELETE)
    @ResponseBody
    public int deleteCom(@PathVariable("id")Integer id,@PathVariable("roomId")String roomId){

        return commentService.deleteCom(id,roomId);
    }


}

package com.ls.Comments.Service.Impl;

import com.ls.Comments.Service.CommentService;
import com.ls.Comments.dao.CommentsMapper;
import com.ls.Comments.pojo.Comments;
import com.ls.RoomManagement.dao.JesisDao;
import net.sf.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * @author chenqiang
 */
@Service
public class CommentServiceImpl implements CommentService{
    @Autowired
    private  CommentsMapper commentsMapper;
    @Autowired
    CommentService commentService;
    /**
     * 查询房间和评论
     * @return
     */
    public List<Comments> selectRoonAndCom(String roomid) {

        return  commentsMapper.selectByExampleWithRoom(roomid);
    }

    /**
     * 保存评论
     * @param roomId
     * @param userId
     * @param context
     * @param time
     * @return
     */
    public int saveComment(String roomId, String userId, String context, String time) {
        JesisDao jesisDao=new JesisDao();
        //获取连接池
        Jedis jedis= jesisDao.getJedis();
        Comments comments=new Comments();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date =new Date();
        try {

            date=format.parse(time);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        comments.setTime(date);
        comments.setState(0);
        comments.setGreatnumber(0);
        comments.setCommentsId(roomId);
        comments.setContext(context);
        comments.setUsername(userId);
        int n=commentsMapper.insert(comments);
        //跟新缓存
        List<Comments> list=commentService.selectRoonAndCom(roomId);
        //转成标准的json字符串
        JSONArray jsonarray = JSONArray.fromObject(list);
        String json = jsonarray.toString();
        //存放在redis数据
        jedis.set("comment"+roomId, json);
        jedis.close();
        return  n;
    }

    /**
     * 根据id查询状态
     * @param id
     * @return
     *
     */
    public Comments selectStateBykey(Integer id ,String name) {

        return commentsMapper.selectStateBykey(id,name);
    }

    /**
     * 更新个数
     * @param id
     * @return
     */
    public int updataNumber(Integer id,String roomid) {
        Comments comments=new Comments();
        comments.setId(id);
        commentsMapper.updateByKey(comments);
        //更新缓存
        JesisDao jesisDao=new JesisDao();
        //获取连接池
        Jedis jedis= jesisDao.getJedis();
        List<Comments> list=commentService.selectRoonAndCom(roomid);
        //转成标准的json字符串
        JSONArray jsonarray = JSONArray.fromObject(list);
        String json = jsonarray.toString();
        //存放在redis数据
        jedis.set("comment"+roomid, json);
        jedis.close();
        return 0;
    }

    /**
     * 删除评论
     * @param id
     * @return
     */
    public int deleteCom(Integer id ,String roomId) {
        commentsMapper.deleteByPrimaryKey(id);
        //更新缓存
        JesisDao jesisDao=new JesisDao();
        //获取连接池
        Jedis jedis= jesisDao.getJedis();
        List<Comments> list=commentService.selectRoonAndCom(roomId);
        //转成标准的json字符串
        JSONArray jsonarray = JSONArray.fromObject(list);
        String json = jsonarray.toString();
        //存放在redis数据
        jedis.set("comment"+roomId, json);
        jedis.close();
        return 0;
    }
}

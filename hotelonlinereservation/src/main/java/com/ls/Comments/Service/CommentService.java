package com.ls.Comments.Service;

import com.ls.Comments.pojo.Comments;

import java.util.List;

public interface CommentService {
    /**
     * 查询房间和评论
     * @return
     */
    public List<Comments> selectRoonAndCom(String roomid);

    /**
     * 保存评论
     * @param uuid
     * @param userId
     * @param context
     * @param time
     * @return
     */
    public int saveComment(String uuid, String userId, String context, String time);

    /**
     * 根据姓名查询状态
     * @param id
     * @return
     */
    public Comments selectStateBykey(Integer id,String name);

    /**
     * 更新数据
     * @param id
     * @return
     */
    public int updataNumber(Integer id,String roomid);

    /**
     * 删除评论
     * @param id
     * @return
     */
    public int deleteCom(Integer id,String roomId);


}

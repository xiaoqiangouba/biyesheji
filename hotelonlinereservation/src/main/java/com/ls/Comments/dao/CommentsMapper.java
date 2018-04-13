package com.ls.Comments.dao;

import com.ls.Comments.pojo.Comments;
import com.ls.Comments.pojo.CommentsExample;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface CommentsMapper {
    int countByExample(CommentsExample example);

    int deleteByExample(CommentsExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(Comments record);

    int insertSelective(Comments record);

    List<Comments> selectByExample(CommentsExample example);

    //查询评论和房间
    List<Comments> selectByExampleWithRoom(String roomId);

    //根据id查询状态
    Comments selectStateBykey(Integer id,String name);

    Comments selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") Comments record, @Param("example") CommentsExample example);

    int updateByExample(@Param("record") Comments record, @Param("example") CommentsExample example);

    int updateByPrimaryKeySelective(Comments record);

    //根据id添加数量
    int updateByKey(Comments record);

    int updateByPrimaryKey(Comments record);
}
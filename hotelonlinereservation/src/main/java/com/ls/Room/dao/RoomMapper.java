package com.ls.Room.dao;


import com.ls.Room.pojo.Room;
import com.ls.Room.pojo.RoomExample;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface RoomMapper {
    int countByExample(RoomExample example);

    int deleteByExample(RoomExample example);

    int deleteByPrimaryKey(String roomId);

    int insert(Room record);

    int insertSelective(Room record);

    List<Room> selectByExample(RoomExample example);

    Room selectByPrimaryKey(String roomId);

    int updateByExampleSelective(@Param("record") Room record, @Param("example") RoomExample example);

    //根据楼层查找房间信息
    List<Room> selectByFloor(String floor);

    //根据楼层查找房间信息(正序)
    List<Room> selectRoom();

    //根据价格查询
    List<Room> selectRoomByPrice(String price);

    int updateByExample(@Param("record") Room record, @Param("example") RoomExample example);

    int updateByPrimaryKeySelective(Room record);

    int updateByPrimaryKey(Room record);
}
package com.ls.Room.Service;

import com.ls.Room.pojo.Room;

import java.util.List;

/**
 * @author chengqiang
 */
public interface RoomService {
    /**
     * 保存房间信息
     */
    public int saveRoom(Room room);

    /**
     * 查询1楼信息
     * @return
     */
    public List<Room> selectOne(String floor);
}

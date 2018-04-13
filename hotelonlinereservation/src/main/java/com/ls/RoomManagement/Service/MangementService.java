package com.ls.RoomManagement.Service;

import com.ls.Room.pojo.Room;

import java.util.List;

/**
 * @author chenqiang
 */
public interface MangementService {
    /**
     * 查询所有房间(按楼层获取)
     * @return
     */
    public List<Room> selectRoom();

    /**
     * 检查房间名是否存在
     * @param number
     * @return
     */
    public boolean selectNumber(String number);

    /**
     * 批量删除房间
     * @param del_ids
     * @return
     */
    public void deleteAll(List<String> del_ids);

    /**
     * 单个删除
     * @param roomIds
     */
    public int deleteRoomById(String roomIds);

    /***
     * 根据id获取单个信息
     * @param id
     * @return
     */
    public Room getRoom(String id);

    /**
     * 根据id 更新房间
     * @param room
     * @return
     */
    public int updateRoom(Room room);

    /**
     * 根据价格查询
     * @return
     */
    public List<Room> selectRoomByPrice(String price);
}

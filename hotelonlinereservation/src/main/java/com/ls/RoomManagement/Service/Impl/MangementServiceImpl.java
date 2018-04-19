package com.ls.RoomManagement.Service.Impl;

import com.ls.Room.dao.RoomMapper;
import com.ls.Room.pojo.Room;
import com.ls.Room.pojo.RoomExample;
import com.ls.RoomManagement.Service.MangementService;
import com.ls.RoomManagement.dao.JesisDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;

import java.util.Iterator;
import java.util.List;
import java.util.Set;

/**
 * @author chenqiang
 */
@Service
public class MangementServiceImpl implements MangementService{

    @Autowired
    private   RoomMapper roomMapper;
    /**
     * 查询所有房间(按楼层获取)
     * @return
     */
    public List<Room> selectRoom() {
        return  roomMapper.selectRoom();
    }

    /**
     * 检查房间名是否存在
     * @param number
     * @return cunt=0 trun 可用
     */
    public boolean selectNumber(String number) {
        RoomExample roomExample=new RoomExample();
        RoomExample.Criteria criteria= roomExample.createCriteria();
        criteria.andNumberEqualTo(number);
        long cunt=roomMapper.countByExample(roomExample);
        return cunt==0;
    }

    /**
     * 批量删除房间
     * @param del_ids
     * @return
     */
    public void deleteAll(List<String> del_ids) {
        //构造删除条件
        RoomExample roomExample=new RoomExample();
        RoomExample.Criteria criteria=roomExample.createCriteria();
        criteria.andRoomIdIn(del_ids);
       roomMapper.deleteByExample(roomExample);
       //更新缓存
        JesisDao jesisDao=new JesisDao();
        //获取连接池
        Jedis jedis= jesisDao.getJedis();
        //删除新缓存
        Set<String> set = jedis.keys( "selectRoom*");
        Iterator<String> it = set.iterator();
        while(it.hasNext()){
            String keyStr = it.next();
            System.out.println("--房间信息缓存--------------------------"+keyStr+"--------------------");
            jedis.del(keyStr);
        }
        Set<String> indexRoom= jedis.keys( "indexRoom*");
        Iterator<String> itt = indexRoom.iterator();
        while(itt.hasNext()){
            String keyStr = itt.next();
            System.out.println("--首页缓存--------------------------"+keyStr+"--------------------");
            jedis.del(keyStr);
        }
        Set<String> room_com = jedis.keys( "room_com*");
        Iterator<String> room_com_t = room_com.iterator();
        while(room_com_t.hasNext()){
            String keyStr = room_com_t.next();
            System.out.println("--房间和评论缓存---------------------------"+keyStr+"--------------------");
            jedis.del(keyStr);
        }

        jedis.close();

    }

    /**
     * 单个删除
     * @param roomIds
     */
    public int deleteRoomById(String roomIds) {
    int n= roomMapper.deleteByPrimaryKey(roomIds);
        //更新缓存
        JesisDao jesisDao=new JesisDao();
        //获取连接池
        Jedis jedis= jesisDao.getJedis();
        //删除新缓存
        Set<String> set = jedis.keys( "selectRoom*");
        Iterator<String> it = set.iterator();
        while(it.hasNext()){
            String keyStr = it.next();
            System.out.println("--房间信息缓存--------------------------"+keyStr+"--------------------");
            jedis.del(keyStr);
        }
        Set<String> indexRoom= jedis.keys( "indexRoom*");
        Iterator<String> itt = indexRoom.iterator();
        while(itt.hasNext()){
            String keyStr = itt.next();
            System.out.println("--首页缓存--------------------------"+keyStr+"--------------------");
            jedis.del(keyStr);
        }
        Set<String> room_com = jedis.keys( "room_com*");
        Iterator<String> room_com_t = room_com.iterator();
        while(room_com_t.hasNext()){
            String keyStr = room_com_t.next();
            System.out.println("--房间和评论缓存---------------------------"+keyStr+"--------------------");
            jedis.del(keyStr);
        }

        jedis.close();
        return  n;
    }

    /**
     * 根据id获取单个信息
     * @param id
     * @return
     */
    public Room getRoom(String id) {
        return   roomMapper.selectByPrimaryKey(id);
    }

    /**
     * 根据id更新房间
     * @param room
     * @return
     */
    public int updateRoom(Room room) {
        //更新缓存
        JesisDao jesisDao=new JesisDao();
        //获取连接池
        Jedis jedis= jesisDao.getJedis();
        //删除新缓存
        Set<String> set = jedis.keys( "selectRoom*");
        Iterator<String> it = set.iterator();
        while(it.hasNext()){
            String keyStr = it.next();
            System.out.println("--房间信息缓存--------------------------"+keyStr+"--------------------");
            jedis.del(keyStr);
        }
        Set<String> indexRoom= jedis.keys( "indexRoom*");
        Iterator<String> itt = indexRoom.iterator();
        while(itt.hasNext()){
            String keyStr = itt.next();
            System.out.println("--首页缓存--------------------------"+keyStr+"--------------------");
            jedis.del(keyStr);
        }
        Set<String> room_com = jedis.keys( "room_com*");
        Iterator<String> room_com_t = room_com.iterator();
        while(room_com_t.hasNext()){
            String keyStr = room_com_t.next();
            System.out.println("--房间和评论缓存---------------------------"+keyStr+"--------------------");
            jedis.del(keyStr);
        }

        jedis.close();
        return roomMapper.updateByPrimaryKey(room);
    }

    /**
     * 根据价格查询
     * @return
     */
    public List<Room> selectRoomByPrice(String price) {

        return  roomMapper.selectRoomByPrice(price);
    }
}

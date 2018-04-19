package com.ls.Room.Service.impl;

import com.ls.Room.Service.RoomService;
import com.ls.Room.dao.RoomMapper;
import com.ls.Room.pojo.Room;
import com.ls.RoomManagement.dao.JesisDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;

import java.util.Iterator;
import java.util.List;
import java.util.Set;

/*
 *房间管理实现接口
 *
 */
@Service
public class RoomServiceImpl implements RoomService {
    @Autowired
    private RoomMapper roomMapper;
    /**
     * 保存房间信息
     * @param room
     * @return
     */
    public int saveRoom(Room room) {
        int n=roomMapper.insert(room);
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
        return n;
    }
    /**
     * 查询1楼信息
     * @return
     */
    public List<Room> selectOne(String floor){
        List<Room> list=  roomMapper.selectByFloor(floor);
        return list;
    }
}

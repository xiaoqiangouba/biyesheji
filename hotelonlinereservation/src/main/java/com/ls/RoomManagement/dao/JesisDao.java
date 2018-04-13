package com.ls.RoomManagement.dao;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

/**
 * 工具类
 */
public class JesisDao {
    //定义一个连接池对象
    private static JedisPool POOL =null;
    //Redis服务器IP
    private static String ADDR = "192.168.243.128";
    //Redis的端口号
    private static int PORT = 6379;
    //设置池中最大连接数
    private static int TOTAL = 1000;
    //设置空闲时池中保有的最大连接数
    private static int MAX_IDIE= 100;
    static {
        JedisPoolConfig config = new JedisPoolConfig();
        config.setMaxTotal(TOTAL);
        config.setMaxIdle(MAX_IDIE);
        POOL = new JedisPool(config, ADDR, PORT);
       /* //初始化操作
        //设置链接池的配置对象
        JedisPoolConfig config=new JedisPoolConfig();
        //设置池中最大连接数
        config.setMaxTotal(1000);
        //设置空闲时池中保有的最大连接数
        config.setMaxIdle(100);
        //设置连接池对象
        POOL=new JedisPool(config,"192.168.243.128",6379);*/
    }

    /**
     * 从池中获取对象
     */
    public synchronized static Jedis getJedis(){
            try {
                if (POOL != null) {
                    Jedis resource = POOL.getResource();
                    return resource;
                } else {
                    return null;
                }
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }


    /**
     * 释放jedis资源
     * @param jedis
     */
    public static void returnResource(final Jedis jedis) {
        if (jedis != null) {
            POOL.returnResource(jedis);
        }
    }



    }


package com.ls.RoomManagement.Controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.ls.Room.Controller.UpdateFtpController;
import com.ls.Room.pojo.Room;
import com.ls.RoomManagement.Service.Impl.MangementServiceImpl;
import com.ls.RoomManagement.dao.JesisDao;
import com.ls.UserRegistration.pojo.Msg;
import net.sf.json.JSONArray;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisSentinelPool;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

/**
 * @author chenqiang
 */
@Controller
@RequestMapping("/ManagementController")
public class ManagementController{
    private static final JedisPool POOL = null;
    /**
     * 查询所有信息(楼层升序)
     */
    @Autowired
    MangementServiceImpl mangementService;
    @RequestMapping(value = "/selectRoom",method = RequestMethod.GET)
    @ResponseBody
    public Msg selectRoom(@RequestParam(value="pn",defaultValue="1")Integer pn){
        JesisDao jesisDao=new JesisDao();
        //获取连接池
        Jedis jedis= jesisDao.getJedis();
        if(jedis.get("selectRoom"+pn)!=null){
            //如果redis缓存,则返回数据
            String name=jedis.get("selectRoom"+pn);
            jedis.close();
            return Msg.success().add("pageInfo",name);
        }else{
            PageInfo pageInfo = null;
            PageHelper.startPage(pn, 5);
            List<Room> list= mangementService.selectRoom();
            //出入连续显示de页数
            pageInfo=new PageInfo(list,6);
            JSONArray jsonarray = JSONArray.fromObject(pageInfo);
            String json = jsonarray.toString();
            //存放在redis数据
            jedis.set("selectRoom"+pn, json);
            String name=jedis.get("selectRoom"+pn);
            jedis.close();
            return Msg.success().add("pageInfo", name);
        }

    }

    /**
     * 查询房间
     * @param pn
     * @return
     */
    @RequestMapping(value = "/selectRoomTo",method = RequestMethod.GET)
    @ResponseBody
    public Msg selectRoomTo(@RequestParam(value="pn",defaultValue="1")Integer pn){
        JesisDao jesisDao=new JesisDao();
        //获取连接池
        Jedis jedis= jesisDao.getJedis();
        PageInfo pageInfo = null;
        if(jedis.get("room_com"+pn)!=null){
            //如果redis缓存,则返回数据
            String name=jedis.get("room_com"+pn);
            jedis.close();
            return Msg.success().add("pageInfo",name);
        }else{
            PageHelper.startPage(pn, 4);
            List<Room> list= mangementService.selectRoom();
            //出入连续显示de页数
            pageInfo=new PageInfo(list,6);
            //转成标准的json字符串
            JSONArray jsonarray = JSONArray.fromObject(pageInfo);
            String json = jsonarray.toString();
            //存放在redis数据
            jedis.set("room_com"+pn, json);
            String name=jedis.get("room_com"+pn);
            jedis.close();
            return Msg.success().add("pageInfo",name);
        }
       

    }
    /**
     * 判断房间名称是否存在
     * @param number
     * @return
     */
    @RequestMapping(value = "/selectNumber",method = RequestMethod.GET)
    @ResponseBody
    public boolean selectNumber(@RequestParam(value="number")String number){
        boolean cunt= mangementService.selectNumber(number);
        return cunt;
    }

    /**
     * 批量删除
     * 如果只选择一个就单个删除
     * @param roomIds
     * @return
     */
    @RequestMapping(value = "/deleteAll/{roomIds}",method = RequestMethod.DELETE)
    @ResponseBody
    public Msg  deleteAll(@PathVariable(value="roomIds") String roomIds){
        List<String> del_ids=new ArrayList<String>();
        //将多个id分割成id数组
          if(roomIds.contains("-")){
              String[] str_ids= roomIds.split("-");
              //便利每一个id
              for(String ids :str_ids){
                  del_ids.add(ids);
              }
              mangementService.deleteAll(del_ids);
          }else{
              mangementService.deleteRoomById(roomIds);
          }
        return Msg.success();
    }

    /**
     * 根据id查询房间信息
     * @return
     */
    @RequestMapping(value = "/getRoom/{id}",method = RequestMethod.GET)
    @ResponseBody
    public Msg getRoom(@PathVariable(value="id") String id){
       Room room= mangementService.getRoom(id);
        return   Msg.success().add("room",room);
    }

    /**
     * 根据id更新房间信息
     * @param file
     * @param room
     * @return
     */
    @RequestMapping(value = "/updateRoom/{id}/{number}",method = RequestMethod.POST)
    @ResponseBody
    public String updateRoom(@RequestParam(value = "file", required = false) MultipartFile file,@PathVariable(value="id") String id, Room room,@PathVariable(value="number") String number){
        Calendar date= Calendar.getInstance();
        if(file==null||file.equals("")){
            return "file-error";
        }
        String filename = file.getOriginalFilename();
        SimpleDateFormat format1=new SimpleDateFormat( "yyyy ");
        SimpleDateFormat format2=new SimpleDateFormat( "MM ");
        SimpleDateFormat format3=new SimpleDateFormat( "dd ");
        String yy=format1.format(date.getTime());
        String mm=format2.format(date.getTime());
        String dd=format3.format(date.getTime());
        String path=yy+mm+dd;
        String url="";

        //获取日期命名   20180105
        path=path.replace(" ", "");
        //String paths="img/"+path;;
        InputStream input = null;
        try {
            input = file.getInputStream();
        } catch (IOException e) {
            e.printStackTrace();
        }
        UpdateFtpController updateFtp = new UpdateFtpController();
        FTPClient ftpClient = updateFtp.getConnectionFTP("192.168.243.128", 21, "ftpuser", "12345678");
        try {
           // ftpClient.changeWorkingDirectory("");
            ftpClient.changeWorkingDirectory("/");
            ftpClient.makeDirectory(path);
           // ftpClient.changeWorkingDirectory("img/");

            FTPFile[] fs = ftpClient.listFiles();
            for (FTPFile ff:fs
                    ) {
                if(ff.getName().equals(path)){
                    url=ff.getName();
                }
            }

            filename=updateFtp.changeName(filename);
            filename = new String(filename.getBytes("GBK"),"ISO-8859-1");
           // paths = new String(path.getBytes("GBK"), "ISO-8859-1");
            url = new String(path.getBytes("GBK"), "ISO-8859-1");
        } catch (IOException e) {
            e.printStackTrace();
        }
        boolean success=updateFtp.uploadFile(ftpClient, url, filename, input);
        room.setPath("/hotelonlinereservation/RoomController/"+"view/"+url+"/"+filename+"/img");
        if(success){
            room.setRoomId(id);
            room.setNumber(number);
            int n= mangementService.updateRoom(room);
            if(n==1){
                return "success";
            }
        }else {
            return "ftp--error";
        }
        return "error";

    }

    /**
     * 根据价格查房间
     * @param price
     * @return
     */
    @RequestMapping(value = "/selectRoomByPrice",method = RequestMethod.GET)
    @ResponseBody
    public Msg selectRoomByPrice(@RequestParam(value="price")String price,@RequestParam(value="pn",defaultValue="1")Integer pn){
        PageHelper.startPage(pn, 6);
        List<Room> list= mangementService.selectRoomByPrice(price);
        //出入连续显示de页数
        PageInfo pageInfo=new PageInfo(list,6);
        return Msg.success().add("pageInfo", pageInfo);

    }
}

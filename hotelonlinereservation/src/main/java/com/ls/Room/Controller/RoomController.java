package com.ls.Room.Controller;


import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.ls.RoomManagement.dao.JesisDao;
import com.ls.UserRegistration.pojo.Msg;
import com.ls.Room.Service.RoomService;
import com.ls.Room.pojo.Room;
import net.sf.json.JSONArray;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import redis.clients.jedis.Jedis;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.UUID;

/**
 * @author chenqiang
 */
@Controller
@RequestMapping("/RoomController")
public class RoomController {
    @Autowired
    RoomService roomService;
    /**
     * 保存房间信息
     * @return
     */
    @ResponseBody
    @RequestMapping("/saveRoom")
    public String saveRoom(@RequestParam(value = "file", required = false) MultipartFile file, Room room){
        Calendar date= Calendar.getInstance();
        String filename = file.getOriginalFilename(); //获得原始的文件名
        String format= filename.substring(filename.lastIndexOf(".") + 1);
        if(file==null||file.equals("")){
            return "file-error";
        }
        //格式校验
        if (!format.matches("^[(jpg)|(gif)|(png)|(bmp)|(jpeg)|(JPG)|(JPEG)|(PNG)]+$")) {
            return "file-geshi";
        }


        //获取当前日期并命名成文件夹名称
        //String filename = file.getOriginalFilename();
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
        String paths="img/"+path;;
        InputStream input = null;
        try {
            input = file.getInputStream();
        } catch (IOException e) {
            e.printStackTrace();
        }
        UpdateFtpController updateFtp = new UpdateFtpController();
        FTPClient ftpClient = updateFtp.getConnectionFTP("192.168.243.128", 21, "ftpuser", "12345678");
       // FTPClient ftpClient = updateFtp.getConnectionFTP("127.0.0.1", 21, "root", "123456");
        try {
            ftpClient.changeWorkingDirectory("/");
            ftpClient.makeDirectory(path);
            FTPFile[] fs = ftpClient.listFiles();
            for (FTPFile ff:fs
                    ) {
                if(ff.getName().equals(path)){
                    url=ff.getName();

                }
            }

            filename=updateFtp.changeName(filename);
            filename = new String(filename.getBytes("GBK"),"ISO-8859-1");
            paths = new String(path.getBytes("GBK"), "ISO-8859-1");
        } catch (IOException e) {
            e.printStackTrace();
        }
        boolean success=updateFtp.uploadFile(ftpClient, url, filename, input);
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        room.setRoomId(uuid);
        room.setPath("/hotelonlinereservation/RoomController/"+"view/"+url+"/"+filename+"/img");
        if(success){
              int n= roomService.saveRoom(room);
              if(n==1){
                  return "success";
              }
        }else {
            return "ftp--error";
        }
        return "error";
    }

    /**
     * (首页)根据楼层获取房间信息
     * @param floor
     * @return
     */
    @RequestMapping(value ="/selectOne",method = RequestMethod.POST)
    @ResponseBody
    public Msg selectOne(@RequestParam(value="pn",defaultValue="1")Integer pn, String floor){
        JesisDao jesisDao=new JesisDao();
        //获取连接池
        Jedis jedis= jesisDao.getJedis();
        if(jedis.get("indexRoom"+floor+"/"+pn)!=null){
            //如果redis缓存,则返回数据
            String name=jedis.get("indexRoom"+floor+"/"+pn);
            jedis.close();
            return Msg.success().add("pageInfo",name);
        }else {
            PageHelper.startPage(pn, 6);
            List<Room> list = roomService.selectOne(floor);
            //连续显示de页数
            PageInfo pageInfo = new PageInfo(list, 5);
            //转成标准的json字符串
            JSONArray jsonarray = JSONArray.fromObject(pageInfo);
            String json = jsonarray.toString();
            //存放在redis数据
            jedis.set("indexRoom" + floor+"/"+pn, json);
            String name = jedis.get("indexRoom" + floor+"/"+pn);
            jedis.close();
            return Msg.success().add("pageInfo", name);
        }
    }

    /**
     * 获取图片
     * @param request
     * @param resp
     * @param url
     * @param fileName
     */
    @RequestMapping(value = "/view/{url}/{fileName}/img",method = RequestMethod.GET)
    public void readFile(HttpServletRequest request, HttpServletResponse resp, @PathVariable String url, @PathVariable String fileName){
        ServletOutputStream outputStream = null;
        InputStream inputStream=null;
        FTPClient ftpClient=null;
        UpdateFtpController updateFtp = null;
        try {
            updateFtp = new UpdateFtpController();
             ftpClient = updateFtp.getConnectionFTP("192.168.243.128", 21, "ftpuser", "12345678");
             //ftpClient = updateFtp.getConnectionFTP("127.0.0.1", 21, "root", "123456");
            //ftpClient.enterRemotePassiveMode();
             //ftpClient.enterLocalPassiveMode();

            //ftpClient = updateFtp.getConnectionFTP("106.14.16.221", 21, "xiaomazhineng", "xmznFTP@2017");

          //  System.out.println(  ftpClient.changeWorkingDirectory("/")+"------------------------------2");

           // System.out.println(url+"-----------url");
          //  System.out.println(  ftpClient.changeWorkingDirectory("img/img/"+url+"/")+"-------------7");
            ftpClient.changeWorkingDirectory(url+"/");//转移到FTP服务器目录
            inputStream = ftpClient.retrieveFileStream(fileName);

            outputStream = resp.getOutputStream();
            resp.setContentType("image/*");
            int count = 0;

            byte[] buffer = new byte[1024*8];
            while ((count = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer,0,count);
            }
            //必须清除流，否则图片不能正常显示
            resp.getOutputStream().flush();

        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            if(inputStream!=null){
                try {
                    inputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if(outputStream!=null){
                try {
                    outputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            try {
                resp.getOutputStream().close();
            } catch (IOException e) {
                e.printStackTrace();
            }finally {
                   updateFtp.closeFTP(ftpClient);
            }
        }
    }
}

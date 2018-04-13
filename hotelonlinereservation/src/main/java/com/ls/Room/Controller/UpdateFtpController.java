package com.ls.Room.Controller;

import org.apache.commons.net.ftp.*;

import java.io.*;
import java.util.Random;

/**
 * @author chenqiang
 */
public class UpdateFtpController {
    /**
     * 获得连接FTP方式
     * @param hostName FTP服务器地址
     * @param port FTP服务器端口
     * @param userName FTP登录用户名
     * @param passWord FTP登录密码
     * @return FTPClient
     */
    public FTPClient getConnectionFTP(String hostName, int port, String userName, String passWord) {
        //创建FTPClient对象
        FTPClient ftp = new FTPClient();
        try {
            //连接FTP服务器
            ftp.connect(hostName, port);
            //下面三行代码必须要，而且不能改变编码格式，否则不能正确下载中文文件
            ftp.setControlEncoding("GBK");
            FTPClientConfig conf = new FTPClientConfig(FTPClientConfig.SYST_NT);
            conf.setServerLanguageCode("zh");
            //登录ftp
            ftp.login(userName, passWord);
            if (!FTPReply.isPositiveCompletion(ftp.getReplyCode())) {
                ftp.disconnect();
                return ftp;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return ftp;
    }

    /**
     * 关闭连接FTP方式
     * @param ftp FTPClient对象
     * @return boolean
     */
    public boolean closeFTP(FTPClient ftp) {
        if (ftp.isConnected()) {
            try {
                ftp.disconnect();
                return true;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return false;
    }

    /**
     * 上传文件FTP方式
     * @param ftp FTPClient对象
     * @param path FTP服务器上传地址
     * @param fileName 本地文件路径
     * @param inputStream 输入流
     * @return boolean
     */
    public boolean uploadFile(FTPClient ftp, String paths, String fileName, InputStream inputStream) {
        boolean success = false;
        try {
            boolean cunt= ftp.changeWorkingDirectory(paths);
        if(cunt){
            //将上传文件存储到指定目录
            ftp.setFileType(FTP.BINARY_FILE_TYPE);
           // System.out.println( ftp.setFileType(FTP.BINARY_FILE_TYPE)+"......");
            //如果缺省该句 传输txt正常 但图片和其他格式的文件传输出现乱码
            ftp.storeFile(fileName,inputStream);
            //关闭输入流
            success=true;
            if(inputStream!=null){
                inputStream.close();
            }
            //退出ftp
            ftp.logout();
        }else {
            //关闭输入流
            if(inputStream!=null){
                inputStream.close();
            }
            //退出ftp
            ftp.logout();
        }

    } catch (Exception e) {
        e.printStackTrace();
    }
        return success;
    }

    /**
     * 删除文件FTP方式
     * @param ftp FTPClient对象
     * @param path FTP服务器上传地址
     * @param fileName FTP服务器上要删除的文件名
     * @return
     */
    public boolean deleteFile(FTPClient ftp, String path, String fileName) {
        boolean success = false;
        try {
            ftp.changeWorkingDirectory(path);//转移到指定FTP服务器目录
            fileName = new String(fileName.getBytes("GBK"), "ISO-8859-1");
            path = new String(path.getBytes("GBK"), "ISO-8859-1");
            ftp.deleteFile(fileName);
            ftp.logout();
            success = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return success;
    }
    /**
     * 下载文件FTP方式
     * @param ftp FTPClient对象
     * @param path FTP服务器上传地址
     * @param fileName 本地文件路径
     * @param localPath 本里存储路径
     * @return boolean
     */
    public boolean downFile(FTPClient ftp, String path, String fileName, String localPath) {
        boolean success = false;
                try {
                    ftp.changeWorkingDirectory(path);//转移到FTP服务器目录
                    FTPFile[] fs = ftp.listFiles(); //得到目录的相应文件列表
                    for (FTPFile ff : fs) {
                            if (ff.getName().equals(fileName)) {
                                File localFile = new File(localPath + "\\" + ff.getName());
                             //   System.out.println(localFile+"------------------");
                                OutputStream outputStream = new FileOutputStream(localFile);
                                //将文件保存到输出流outputStream中
                                ftp.retrieveFile(new String(ff.getName().getBytes("GBK"), "ISO-8859-1"),outputStream);
                                outputStream.flush();
                                outputStream.close();
                        //        System.out.println("下载成功");
                            }
            }
            ftp.logout();
            success = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return success;
    }

    /**
     * 判断是否有重名文件
     * @param fileName
     * @param fs
     * @return
     */
    public static boolean isFileExist(String fileName, FTPFile[] fs) {
        for (int i = 0; i < fs.length; i++) {
            FTPFile ff = fs[i];
            if (ff.getName().equals(fileName)) {
                return true; //如果存在返回 正确信号
            }
        }
        return false; //如果不存在返回错误信号
    }

    /**
     * 根据重名判断的结果 生成新的文件的名称
     * @param fileName
     * @return fileName
     */
    public static String changeName(String fileName){
        Random random = new Random();
        // 获取当前时间到毫秒
        random.nextInt(100000);
        // 给图片命名
        fileName = fileName.substring(fileName.indexOf("."), fileName.length());
        fileName= String.valueOf(System.currentTimeMillis() + random.nextInt(100000)) + fileName;
        return fileName;
    }

}

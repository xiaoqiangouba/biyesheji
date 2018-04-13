package com.ls.UserRegistration.pojo;

import java.util.HashMap;
import java.util.Map;

import static com.ls.UserRegistration.pojo.JavaWebToken.verifyJavaWebToken;

public class AuthUtil {
    private static Map<String, Object> getClientLoginInfo(String id) throws Exception {
        Map<String, Object> r = new HashMap<String,Object>();

        String sessionId = id;
        if (sessionId != null) {
            r = decodeSession(sessionId);
            return r;
        }
        throw new Exception("session解析错误");
    }

    public static String getUserId(String id) throws Exception {
        if(String.valueOf((String)getClientLoginInfo(id).get("userId"))==null){
           return "404";
        }
        return  String.valueOf((String)getClientLoginInfo(id).get("userId"));

    }

    /**
     * session解密
     */
    public static Map<String, Object> decodeSession(String sessionId) {
        try {
            return verifyJavaWebToken(sessionId);
        } catch (Exception e) {
            System.err.println("-----------------------------");
            return null;
        }
    }
}

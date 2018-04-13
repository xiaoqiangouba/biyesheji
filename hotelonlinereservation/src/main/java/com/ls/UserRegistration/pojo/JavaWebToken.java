package com.ls.UserRegistration.pojo;




import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.apache.log4j.Logger;


import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;
import java.util.Map;

/**
 * @author chenqiang
 * 一个生成token的工具类
 */
public class JavaWebToken {
    private static Logger log = Logger.getLogger(JavaWebToken.class);

    private static Key getKeyInstance() {
//        return MacProvider.generateKey();
        //We will sign our JavaWebToken with our ApiKey secret
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
        byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary("index");
        Key signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());

        return  signingKey;
    }

    public static String createJavaWebToken(Map<String, Object> claims) {

        return Jwts.builder().setClaims(claims).signWith(SignatureAlgorithm.HS256, (Key) getKeyInstance()).compact();
    }

    public static Map<String, Object> verifyJavaWebToken(String jwt) {
        try {

            Map<String, Object> jwtClaims =
                    Jwts.parser().setSigningKey( getKeyInstance()).parseClaimsJws(jwt).getBody();
            return jwtClaims;
        } catch (Exception e) {
            log.error("json web token verify failed");
            return null;
        }
    }

}

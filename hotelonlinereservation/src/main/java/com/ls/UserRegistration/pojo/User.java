package com.ls.UserRegistration.pojo;

public class User {
    private String id;

    private String username;

    private String password;

    private String eamil;

    private String salt;

    private Integer sta;

    public User(String id, String username, String password, String eamil, String salt, Integer sta) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.eamil = eamil;
        this.salt = salt;
        this.sta = sta;
    }

    public User() {
        super();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id == null ? null : id.trim();
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username == null ? null : username.trim();
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password == null ? null : password.trim();
    }

    public String getEamil() {
        return eamil;
    }

    public void setEamil(String eamil) {
        this.eamil = eamil == null ? null : eamil.trim();
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt == null ? null : salt.trim();
    }

    public Integer getSta() {
        return sta;
    }

    public void setSta(Integer sta) {
        this.sta = sta;
    }
}
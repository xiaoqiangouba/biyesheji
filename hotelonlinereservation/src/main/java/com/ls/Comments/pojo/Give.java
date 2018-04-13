package com.ls.Comments.pojo;

public class Give {
    private Integer giveId;

    private String username;

    private Integer state;

    private Integer id;

    public Give(Integer giveId, String username, Integer state, Integer id) {
        this.giveId = giveId;
        this.username = username;
        this.state = state;
        this.id = id;
    }

    public Give() {
        super();
    }

    public Integer getGiveId() {
        return giveId;
    }

    public void setGiveId(Integer giveId) {
        this.giveId = giveId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username == null ? null : username.trim();
    }

    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        this.state = state;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}
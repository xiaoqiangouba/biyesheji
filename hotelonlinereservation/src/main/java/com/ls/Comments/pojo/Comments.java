package com.ls.Comments.pojo;

import com.ls.Room.pojo.Room;

import java.util.Date;

public class Comments {
    private Integer id;

    private String commentsId;

    private String username;

    private Date time;

    private Integer greatnumber;

    private Integer state;

    private String context;

    private Room room;

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }
    public Comments(Integer id, String commentsId, String username, Date time, Integer greatnumber, Integer state, String context) {
        this.id = id;
        this.commentsId = commentsId;
        this.username = username;
        this.time = time;
        this.greatnumber = greatnumber;
        this.state = state;
        this.context = context;
    }

    public Comments() {
        super();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCommentsId() {
        return commentsId;
    }

    public void setCommentsId(String commentsId) {
        this.commentsId = commentsId == null ? null : commentsId.trim();
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username == null ? null : username.trim();
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public Integer getGreatnumber() {
        return greatnumber;
    }

    public void setGreatnumber(Integer greatnumber) {
        this.greatnumber = greatnumber;
    }

    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        this.state = state;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context == null ? null : context.trim();
    }
}
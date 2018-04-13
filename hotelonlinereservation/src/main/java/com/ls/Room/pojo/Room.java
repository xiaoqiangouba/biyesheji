package com.ls.Room.pojo;

import com.ls.Order.pojo.Order;



public class Room {
    private String roomId;

    private String number;

    private String floor;

    private String price;

    private String introduce;

    private String path;

    private String commentsId;

    private Order order;

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }
    public Room(String roomId, String number, String floor, String price, String introduce, String path, String commentsId) {
        this.roomId = roomId;
        this.number = number;
        this.floor = floor;
        this.price = price;
        this.introduce = introduce;
        this.path = path;
        this.commentsId = commentsId;
    }


    public Room() {
        super();
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId == null ? null : roomId.trim();
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number == null ? null : number.trim();
    }

    public String getFloor() {
        return floor;
    }

    public void setFloor(String floor) {
        this.floor = floor == null ? null : floor.trim();
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price == null ? null : price.trim();
    }

    public String getIntroduce() {
        return introduce;
    }

    public void setIntroduce(String introduce) {
        this.introduce = introduce == null ? null : introduce.trim();
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path == null ? null : path.trim();
    }

    public String getCommentsId() {
        return commentsId;
    }

    public void setCommentsId(String commentsId) {
        this.commentsId = commentsId == null ? null : commentsId.trim();
    }
}
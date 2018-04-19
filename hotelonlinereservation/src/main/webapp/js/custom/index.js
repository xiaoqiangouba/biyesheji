window.onload = function(){

    var totalNmbuer;
    var currentPage;

    var id = $.cookie('id');
    if(id!=null){
        getName(id);
    }

    //菜单栏
    $("#li-1").click(function () {
        $("#div-1").css("display", "block");
        $("#div-2").css("display", "none");
        $("#div-3").css("display", "none");
        $("#div-4").css("display", "none");
        $("#div-5").css("display", "none");
        selectone(1,currentPage);
    });
    $("#li-2").click(function () {
        $("#div-1").css("display", "none");
        $("#div-2").css("display", "block");
        $("#div-3").css("display", "none");
        $("#div-4").css("display", "none");
        $("#div-5").css("display", "none");
        selectone(2,currentPage);
    });
    $("#li-3").click(function () {
        $("#div-1").css("display", "none");
        $("#div-2").css("display", "none");
        $("#div-3").css("display", "block");
        $("#div-4").css("display", "none");
        $("#div-5").css("display", "none");
        selectone(3,currentPage);
    });
    $("#li-4").click(function () {
        $("#div-1").css("display", "none");
        $("#div-2").css("display", "none");
        $("#div-3").css("display", "none");
        $("#div-4").css("display", "block");
        $("#div-5").css("display", "none");
        selectone(4,currentPage);
    });
    $("#li-5").click(function () {
        $("#div-1").css("display", "none");
        $("#div-2").css("display", "none");
        $("#div-3").css("display", "none");
        $("#div-4").css("display", "none");
        $("#div-5").css("display", "block");
        selectone(5,currentPage);
    });

    //获取1楼的信息
    selectone(1,currentPage);

    //鼠标悬浮事件

    $("#div-1").on("mouseover mouseout","div",function(event){
        if(event.type == "mouseover"){
            //鼠标悬浮
            $(this).css("border","1px red solid");
        }else if(event.type == "mouseout"){
            //鼠标离开
            $(this).css("border","1px #fff solid");
            $(this).css("border-bottom","1px red solid");
        }
    });
    $("#div-2").on("mouseover mouseout","div",function(event){
        if(event.type == "mouseover"){
            //鼠标悬浮
            $(this).css("border","1px red solid");
        }else if(event.type == "mouseout"){
            //鼠标离开
            $(this).css("border","1px #fff solid");
            $(this).css("border-bottom","1px red solid");
        }
    });
    $("#div-3").on("mouseover mouseout","div",function(event){
        if(event.type == "mouseover"){
            //鼠标悬浮
            $(this).css("border","1px red solid");
        }else if(event.type == "mouseout"){
            //鼠标离开
            $(this).css("border","1px #fff solid");
            $(this).css("border-bottom","1px red solid");
        }
    });
    $("#div-4").on("mouseover mouseout","div",function(event){
        if(event.type == "mouseover"){
            //鼠标悬浮
            $(this).css("border","1px red solid");
        }else if(event.type == "mouseout"){
            //鼠标离开
            $(this).css("border","1px #fff solid");
            $(this).css("border-bottom","1px red solid");
        }
    });
    $("#div-5").on("mouseover mouseout","div",function(event){
        if(event.type == "mouseover"){
            //鼠标悬浮
            $(this).css("border","1px red solid");
        }else if(event.type == "mouseout"){
            //鼠标离开
            $(this).css("border","1px #fff solid");
            $(this).css("border-bottom","1px red solid");
        }
    });

    //跳转管理页面
    $("#a_href").click(function () {
        data=data.trim();
        if(data != "undefined"){
            window.location.href="management.html?"+data;
        }else{
            window.location.href="management.html";
        }
    });


    //退出登录
    $("#tuichu").click(function () {
        $.cookie("id", '',{ expires: -1, path: '/'});
        $(".nav_rgiht").css("display", "block");
            $("#tuichu").css("display", "none");
            $("#p_login").text("");
        /*   //清除浏览器所有的cookie
        var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;) {
                document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString();
            }
        }*/
        });


    function selectone(floor,n) {
        //记录没有房间信息
        var cont;
        if(floor==1){
            $("#div-1").empty();
        }
        if(floor==2){
            $("#div-2").empty();
        }
        if(floor==3){
            $("#div-3").empty();
        }
        if(floor==4){
            $("#div-4").empty();
        }
        if(floor==5){
            $("#div-5").empty();
        }
        $.ajax({
            url: "/hotelonlinereservation/RoomController/selectOne",
            type: "POST",
            data: {"floor":floor,"pn":n},
            dataType: "json",
            success: function (data) {

                var room = JSON.parse(data.extend.pageInfo);
                if(room.length==0){
                    $("#page_info").empty();
                    $("#page_nav").empty();
                    cont=$("<span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\" style='font-size: 25px;color: red;display: block;margin-top: 10%;margin-left: 35%;width: 280px;'>" +
                        "<p style='float: right;display: block;margin-top: -3px;'>当前楼层没有房间信息</p>"+
                        "</span>");
                    if(floor==1){
                        $("#div-1").append(cont);
                    }
                    if(floor==2){
                        $("#div-2").append(cont);
                    }
                    if(floor==3){
                        $("#div-3").append(cont);
                    }
                    if(floor==4){
                        $("#div-4").append(cont);
                    }
                    if(floor==5){
                        $("#div-5").append(cont);
                    }
                }else{
                    //显示房间信息

                   roomajax(room);
                    page(room);
                    build_pag_nav(floor,room);
                }
            },
            error: function () {
                layer_alert('获取失败服务器异常', "error");
            },
        });
    };
    //解析房间信息
    function roomajax(room) {
        //  $.each(room,function(index,item){
        for(var i=0;i<room[0].list.length;i++){
            var img=$("<span class='img_d"+i+"' style='border: 0px;'><img width='100%' height='165px' class='img"+i+"'/></span>");
            var div=$("<div class='div_m' style=\"padding:2px;border: 1px #fff solid; border-bottom:1px red solid ;cursor:pointer;width:170px;height:270px;float: left;margin-left: 2%;\">\n" +
                "</div>");
            var p=$("<p style='font-size: 15px;color: #3c3c3c;font-family: 微软雅黑;display: block'></p>");
            var p1=$("<p style='font-size: 15px;color: #3c3c3c;font-family: 微软雅黑;display: block'></p>");
            var p2=$("<p style='font-size: 20px;color: red;font-family: 微软雅黑;display: block'></p>");
            var a=$("<a href='javascript:void(0);'></a>");
            img.find("img").attr("src",room[0].list[i].path);
            p.text("介绍:"+room[0].list[i].introduce);
            p1.text("房间号:"+room[0].list[i].number);
            p2.text("￥"+room[0].list[i].price+"元");
            img.appendTo(div);
            p.appendTo(div);
            p1.appendTo(div);
            p2.appendTo(div);
            div.appendTo(a);
            if(room[0].list[i].floor==1){
                a.appendTo($("#div-1"));
            }
            if(room[0].list[i].floor==2){
                a.appendTo($("#div-2"));
            }
            if(room[0].list[i].floor==3){
                a.appendTo($("#div-3"));
            }
            if(room[0].list[i].floor==4){
                a.appendTo($("#div-4"));
            }
            if(room[0].list[i].floor==5){
                a.appendTo($("#div-5"));
            }
            //图片加载完成
            loadImg($(".img_d"+i+""));

        }
    };

    //图片加载完成
    function loadImg(img_d) {
        img_d.find("img").hide();
        img_d.append("<p style='display: block;position: relative;width: 100px;top: 25px;left: 35px;'><svg ><path fill=\"#0000FF\" d=\"M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50\">\n" +
            "                    <animateTransform\n" +
            "                            attributeName=\"transform\"\n" +
            "                            attributeType=\"XML\"\n" +
            "                            type=\"rotate\"\n" +
            "                            dur=\"1s\"\n" +
            "                            from=\"0 50 50\"\n" +
            "                            to=\"360 50 50\"\n" +
            "                            repeatCount=\"indefinite\" />\n" +
            "                </path>\n" +
            "            </svg></p>");

        img_d.find("img").load(function(e){
            img_d.find("p").empty();
            img_d.find("img").show();
        });
    }


    //解析分页条
    function build_pag_nav(floor,room){
        //清空数据
        $("#page_nav").empty();
        //page_nav
        var ul=$("<ul></ul>").addClass("pagination");
        //构造控件
        var firstPage=$("<li></li>").append($("<a></a>").append("首页").attr("href","javascript:void(0);"));
        var perPage=$("<li></li>").append($("<a></a>").append("&laquo;"));
        //当前为第一页，那首页和上一页无法点击
        //alert(result.extend.pageInfo.hasPreviousPage);
        //是否有上一页
        if(room[0].hasPreviousPage==false){
            firstPage.addClass("disabled");
            perPage.addClass("disabled");
        }else{
            //为控件添加点击事件（点击首页跳转第一页）
            firstPage.click(function(){
                selectone(floor,1);
            });
            //  点击上一页，跳转到当前页面减一
            perPage.click(function(){
                selectone(floor,room[0].pageNum-1)
            });
        }

        //构造控件（下一页）
        var nextPage=$("<li></li>").append($("<a></a>").append("&raquo;"));
        //尾页
        var lastPage=$("<li></li>").append($("<a></a>").append("尾页").attr("href","javascript:void(0);"));
        //如果当前是最后一页，就无法点击下一页后尾页
        if(room[0].hasNextPage==false){

            nextPage.addClass("disabled");
            lastPage.addClass("disabled");
        }else{
            //为控件添加点击事件（当前页面加一）
            nextPage.click(function(){
                selectone(floor,room[0].pageNum+1)
            });
            lastPage.click(function(){
                //跳到最后一页
                selectone(floor,room[0].pages)
            });

        }

        //添加首页跟前一页
        ul.append(firstPage).append(perPage);
        //便利页码号result.extend.pageInfo.navigatepageNums==1,2,3.4,5
        //所有页码
        //alert(result.extend.pageInfo.navigatepageNums);
        $.each(room[0].navigatepageNums,function(index,item){
            //item是依次被便利出来的1，2，3，4，5页码
            var numli=$("<li></li>").append($("<a></a>").append(item));
            //如果当前被便利出来的页码等于被点击页数，加一个蓝色标记
            if(room[0].pageNum==item){
                numli.addClass("active");
            }

            numli.click(function(){
                selectone(floor,item)
            });
            ul.append(numli);
        });
        //便利完了添加下一页和尾页
        ul.append(nextPage).append(lastPage);
        //将ul添加到nav中
        var nav=$("<nav></nav>").append(ul);
        //将nav添加到id为page_nav的div中
        nav.appendTo("#page_nav");
    }

    //解析分页
    function page(room) {
        //清空数据
        $("#page_info").empty();
        $("#page_info").append("当前"+room[0].pageNum +"页,总"+room[0].pages +"共页,总"+room[0].total+"记录");
        //记录总数
      /*  totalNmbuer=room[0].pages;
        //记录当前页数
        currentPage=room[0].pageNum;*/
    };



    //查询用户姓名
    function getName(id) {

        //登陆后的页面
        $(".nav_rgiht").css("display", "none");
        $("#tuichu").css("display", "block");
        $.ajax({
            url: "/hotelonlinereservation/RegistrationController/getName",
            type: "GET",
            data: {"id": id},
            dataType: "json",
            success: function (data) {
                var user = data.extend.list;
                $.each(user, function (index, item) {
                    // alert(user.sta);
                    if(user.sta==1){
                        $("#p_login").text("欢迎"+ user.username + "管理员登录");
                        $("#p_login").css("font-size", "20px");
                    }else {
                        $("#p_login").text("欢迎" + user.username + "登录");
                        $("#p_login").css("font-size", "20px");
                    }

                });
            },
            error: function () {
                layer_alert('服务器异常', "error");
            },
        });
    };

    /**                  弹出层                                  **/

    function layer_alert(msg, type) {
        if (type == "success") {
            layer.alert(msg, {
                icon : 1
            });
            return;
        }
        if (type == "error") {
            layer.alert(msg, {
                icon : 2
            });
            return;
        }
        if (type == "ask") {
            layer.alert(msg, {
                icon : 3
            });
            return;
        }
        if (type == "warn") {
            layer.alert(msg, {
                icon : 7
            });
            return;
        }
    }

    function layer_post(data) {
        if (data.code === 0) {
            layer.alert(data.message, {
                icon : 1
            });
            return;
        }
        if (data.code === 1 || data.code === 999) {
            layer.alert(data.message, {
                icon : 2
            });
            return;
        }
        if (data.code === 2) {
            layer.alert(data.message, {
                icon : 7
            });
            return;
        }
        if (data.code === 3) {
            layer.alert(data.message, {
                icon : 7
            });
            return;
        }
    }

    function appLoading() {
        return layer.load(1, {
            shade : false
        });
    }

    function clearLoading(index) {
        layer.close(index);
    }

};


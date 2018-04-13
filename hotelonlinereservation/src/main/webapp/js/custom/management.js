window.onload = function(){

    var id = $.cookie('id');
    var totalNmbuer,currentPage,sta;
        //权限判断
        if(id==null){
            $("#room_add").css("display","none");
            $("#room_delete_all").css("display","none");
            $("#room_daochu_all").css("display","none");
            selectRoom(id,1,sta);
        }else {
            selectSat(id);
        }

    //记录价格
    var price;

    //导出数据
    $("#room_daochu_all").click(function () {
        $(".table2excel").table2excel({
            exclude: ".noExl",
            name: "Excel Document Name",
            filename: "房间信息管理",
            exclude_img: true,
            exclude_links: true,
            exclude_inputs: true
        });
    });


    //跳转管理页面
    $("#a_href").click(function () {
        if(data != "undefined"){
            window.location.href="index.html?"+data;
        }else{
            window.location.href="index.html";
        }
    });

    //重置信息
    $("#chongzhi_but").click(function () {
        $("#page_nav").empty();
        $("#room_table tbody").empty();
        $("#page_info").empty();
        $("#selectPrice").val("");
        $("#price_but").attr("disabled","disabled");
        $("#baobiao").empty();
        $("#baobiao").css("display","block");
        $("#p_but").text("");
        $("#selectPrice").parent().removeClass("has-error");
        selectRoom(id,1,sta);
    });

    //点击新增按钮弹出框
    $("#room_add").click(function(){
        $("#number_input").val("");
        $("#introduce_input").val("");
        $("#floor_input").val("");
        $("#price_input").val("");
        $("#price_input").val("");
        $("#path_input").val("");
        $("#p_input").text("");
        $("#path_input").parent().removeClass("has-error");
        $("#p1_input").text("");
        $("#img_input").attr("src","img/mangement/img.jpg");
        $("#addRoom").modal({
            backdrop:"static"
        });
    });

    //检查房间名是否存在
    $("#number_input").change(function () {
        $("#number_input").parent().removeClass("has-success has-error");
        $("#number_span").text("");
        var number=$(this).val();
        number=number.trim();
        if(number==""||number==null){
            savaBut( $("#save_room_but"));
            return false;
        }
        $.ajax({
          url:"/hotelonlinereservation/ManagementController/selectNumber",
          data:"number="+number,
          dataType:"json",
          type:"GET",
          success:function (data) {
             if(data==false){
                 $("#number_input").parent().addClass("has-error");
                 $("#number_span").text("房间名已存在");
                 $("#number_span").css("color","red");
                 $("#save_room_but").attr("msg","error");
                 savaBut( $("#save_room_but"));
             }else{
                 $("#save_room_but").attr("msg","success");
                 savaBut( $("#save_room_but"));
             }
          },
          error:function () {
                alert("error");
          },
        });
    });

    //介绍
    $("#introduce_input").change(function(){

        $(this).parent().removeClass("has-error");
        $("#introduce_span").text("");
        var introduce=$(this).val();
        introduce=introduce.trim();
        if(introduce==""||introduce==null){
            savaBut( $("#save_room_but"));
            return false;
        }
        if(introduce.length>5){
            $(this).parent().addClass("has-error");
            $("#introduce_span").text("介绍不要超过5个字");
            $("#introduce_span").css("color","red");
            $("#save_room_but").attr("msg-1","error");
            savaBut( $("#save_room_but"));
            return false;
        }else{;
            $("#save_room_but").attr("msg-1","success");
            savaBut( $("#save_room_but"));
        }
    });

    //完成全选/全不选
    $("#check_all").click(function(){
        //prop(选中复选框就是ture 没选中就是false)
        $(".check_item").prop("checked",$(this).prop("checked"));
    });

    //.check_item为单个全选添加点击事件
    $(document).on("click",".check_item",function(){
        //判断当前元素是否选择完成,全部选满是ture 否则是fals
        var flag=$(".check_item:checked").length==$(".check_item").length;
        //alert($(".check_item:checked").length);
        $("#check_all").prop("checked",flag);
    });

    //多选删除  批量删除
    $("#room_delete_all").click(function(){
        var number="";
        var dele_idstr="";
        //便利选中的单选框
        $.each($(".check_item:checked"),function(){
            //获取其父元素tr下边的第三个td元素的值（员工的姓名）
            number+=$(this).parents("tr").find("td:eq(1)").text()+",";
            //组装员工的id
            dele_idstr+=$(this).parents("tr").find("td:eq(6)").find(".delete_btn").attr("room-id")+"-";

        });
        if(!$.trim(number)){
            alert("请勾选删除的房间信息");
        }else{
            //去除多余的逗号
            number=number.substring(0, number.length-1);
            //去除多余的-
            dele_idstr=dele_idstr.substring(0, dele_idstr.length-1);
            if(confirm("确认删除"+number+"这些房间吗?")){
                //发送ajax请求
                $.ajax({
                    url:"/hotelonlinereservation/ManagementController/deleteAll/"+dele_idstr,
                    type:"DELETE",
                    dataType:"json",
                    success:function(result){
                        alert(result.msg);
                        //回到当前页面
                        selectRoom(id,currentPage,sta);
                    },
                    error:function () {
                        alert("删除失败");
                    }
                });
            }

        }
    });

    //点击编辑按钮弹出模态框
    $(document).on("click",".update_btn",function(){
        //在模态框弹出之前查出房间信息
        getRoom($(this).attr("room-id"));
        $("#p_update").text("");
        $("#update_room_but").attr("disabled",false);
        $("#update_room_but").attr("room-id",$(this).attr("room-id"));
        $("#span1_update").text("");
        $("#path_update").parent().removeClass("has-error");
        //弹出模态框
        $("#updateRoom").modal({
            backdrop:"static"
        });
    });

    //检查价格是否正确
    $("#selectPrice").change(function () {
        $("#selectPrice").parent().removeClass("has-error");
        $("#p_but").text("");
      var price=$(this).val();
        price=price.trim();
        if(price==null||price==""){
            $("#price_but").attr("disabled","disabled");
           return false;
        }
        var r = /^\+?[1-9][0-9]*$/;　　//判断是否为正整数
        if(!r.test(price)){
            $("#selectPrice").parent().addClass("has-error");
            $("#p_but").text("价钱只为正整数");
            $("#p_but").css("color","red");
            $("#price_but").attr("disabled","disabled");
            return false;
        }else{
            $("#price_but").attr("disabled",false);
        }
    });
    //价格查询房间
    $("#price_but").click(function () {
         price=$("#selectPrice").val();
        selectRoomByPrice(id,price,1,sta);

    });


    //更新图片预览
    $("#path_update").change(function () {
        var preview = document.querySelector('#img_update');
        var file  = document.querySelector('#path_update').files[0];
        var reader = new FileReader();
        reader.onloadend = function () {
            preview.src = reader.result;
        }
        if (file) {
            $("#span1_update").text("");
            $("#path_update").parent().removeClass("has-error");
            reader.readAsDataURL(file);
        }
    });

    //新增图片预览
    $("#path_input").change(function () {
        var preview = document.querySelector('#img_input');
        var file  = document.querySelector('#path_input').files[0];
        var reader = new FileReader();
        reader.onloadend = function () {
            preview.src = reader.result;
        }
        if (file) {
            $("#path_input").parent().removeClass("has-error");
            $("#p1_input").text("");
            reader.readAsDataURL(file);
        }
    });

    //给后面单个删除按钮添加事件
    $(document).on("click",".delete_btn",function () {
       var roomIds= $(this).attr("room-id");
        var room=$(this).parents("tr").find("td:eq(1)").text();
        if(confirm("确认删除"+room+"房间吗?")){
            $.ajax({
                url:"/hotelonlinereservation/ManagementController/deleteAll/"+roomIds,
                type:"DELETE",
                dataType:"json",
                success:function (data) {
                    alert(data.msg);
                    //回到当前页面
                    selectRoom(id,currentPage,sta);
                },
                error:function () {
                    alert("删除错误");
                }
            });
        }

    });

  /*   //点击图片
    $("#a_img").click(function () {
        if(data != "undefined"){
            window.location.href="index.html?"+data;
        }else{
            window.location.href="index.html";
        }
    });*/

    //悬浮事件
    $("#room_table").on("mouseover mouseout","img",function(event){
        $("#pic").remove();
        $("#room_table").append("<div id='pic' style='position:absolute;'><img src='"+$(this).attr("src")+"' style='width: 300px; height:300px; border-radius: 5px;-webkit-box-shadow: 5px 5px 5px 5px hsla(0,0%,5%,1.00); box-shadow: 5px 5px 5px 0px hsla(0,0%,5%,0.3); '></div>");
        if(event.type == "mouseover"){
            //鼠标悬浮
            $(this).mousemove(function(e){
                $("#pic").css({
                    "top":40+"px",
                    "right":-20+"px"
                }).fadeIn("fast");

            });
        }else if(event.type == "mouseout"){
            $("#pic").remove();

        }
    });

    //根据价格查房间
    function selectRoomByPrice(id,price,pn,sta) {
        $.ajax({
            url:"/hotelonlinereservation/ManagementController/selectRoomByPrice",
            type:"GET",
            dataType:"json",
            data:{"price":price,"pn":pn},
            success:function (data) {
                var room = data.extend.pageInfo.list;
                //解析房间信息


                roomAjaxByPic(id,room,sta);
                //解析分页条信息
                pageByprice(id,price,data,sta);
                //解析分页信息
                build_pag_navByPic(data);
                $("#baobiao").empty();
                baobiaoByPic(room);
            },
            error:function () {
                alert("查询错误");
            }
        });
    }

    //解析分页条（价格）
    function pageByprice(id,price,data,sta) {
        //清空数据
        $("#page_nav").empty();
        var ul=$("<ul></ul>").addClass("pagination");
        //构造控件
        var firstPage=$("<li></li>").append($("<a></a>").append("首页").attr("href","javascript:void(0);"));
        var perPage=$("<li></li>").append($("<a></a>").append("&laquo;"));
        //当前为第一页，那首页和上一页无法点击
        //alert(result.extend.pageInfo.hasPreviousPage);
        //是否有上一页
        if(data.extend.pageInfo.hasPreviousPage==false){
            firstPage.addClass("disabled");
            perPage.addClass("disabled");
        }else{
            //为控件添加点击事件（点击首页跳转第一页）
            firstPage.click(function(){
                selectRoomByPrice(id,price,1,sta);
            });
            //  点击上一页，跳转到当前页面减一
            perPage.click(function(){
                selectRoomByPrice(id,price,data.extend.pageInfo.pageNum-1,sta)
            });
        }

        //构造控件（下一页）
        var nextPage=$("<li></li>").append($("<a></a>").append("&raquo;"));
        //尾页
        var lastPage=$("<li></li>").append($("<a></a>").append("尾页").attr("href","javascript:void(0);"));
        //如果当前是最后一页，就无法点击下一页后尾页
        if(data.extend.pageInfo.hasNextPage==false){
            nextPage.addClass("disabled");
            lastPage.addClass("disabled");
        }else{
            //为控件添加点击事件（当前页面加一）
            nextPage.click(function(){
                selectRoomByPrice(id,price,data.extend.pageInfo.pageNum+1,sta)
            });
            lastPage.click(function(){
                //跳到最后一页
                selectRoomByPrice(id,price,data.extend.pageInfo.pages,sta)
            });

        }

        //添加首页跟前一页
        ul.append(firstPage).append(perPage);
        //便利页码号result.extend.pageInfo.navigatepageNums==1,2,3.4,5
        //所有页码
        //alert(result.extend.pageInfo.navigatepageNums);
        $.each(data.extend.pageInfo.navigatepageNums,function(index,item){
            //item是依次被便利出来的1，2，3，4，5页码
            var numli=$("<li></li>").append($("<a></a>").append(item));
            //如果当前被便利出来的页码等于被点击页数，加一个蓝色标记
            if(data.extend.pageInfo.pageNum==item){
                numli.addClass("active");
            }

            numli.click(function(){
                selectRoomByPrice(id,price,item,sta)
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
    //更新之前查出信息
    function getRoom(id) {
        $.ajax({
            url:"/hotelonlinereservation/ManagementController/getRoom/"+id,
            type:"GET",
            dataType:"json",
            success:function (data) {
                var room=data.extend.room;
                var path=room.path;
                $("#number_update").text(room.number);
                $("#floor_update").val(room.floor);
                $("#introduce_update").val(room.introduce);
                $("#price_update").val(room.price);
                //$("#path_update").val(path);
                //alert( $("#path_update").value(room.path));
                $("#img_update").attr("src",room.path);
            },
            error:function () {
                alert("获取失败");
            },
        });
    }

    //判断按钮
    function  savaBut(msg) {
        if(msg.attr("msg")=="success"&&msg.attr("msg-1")=="success"){
            msg.attr("disabled",false);
        }else {
            msg.attr("disabled","disabled");
        }
    }
    //按楼层获取所有房间信息
    function  selectRoom(id,pn,sta){
        $.ajax({
            url:"/hotelonlinereservation/ManagementController/selectRoom",
            type:"GET",
            dataType:"json",
            data:"pn="+pn,
            beforeSend:function(XMLHttpRequest){
                $("#loading").html("<p style=\"display: block;font-size: 25px;margin-top: 200px;margin-left:45%;\">\n" +
                    "                <svg >\n" +
                    "                    <path fill=\"#0000FF\" d=\"M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50\">\n" +
                    "                        <animateTransform\n" +
                    "                                attributeName=\"transform\"\n" +
                    "                                attributeType=\"XML\"\n" +
                    "                                type=\"rotate\"\n" +
                    "                                dur=\"1s\"\n" +
                    "                                from=\"0 50 50\"\n" +
                    "                                to=\"360 50 50\"\n" +
                    "                                repeatCount=\"indefinite\" />\n" +
                    "                    </path>\n" +
                    "                </svg>\n"+
                    "            </p>");
            },
            success:function (data) {
                $("#loading").css("display","none");
                var room = JSON.parse(data.extend.pageInfo);
                //解析房间信息
                roomAjax(id,room,sta);
                //解析分页条信息
                page(id,room,sta);
                //解析分页信息
                build_pag_nav(room);

                baobiao(room);
            },
            error:function () {
                $("#loading").css("display","none");
                alert("获取错误");
            },

        });
    }

   function  baobiaoByPic(room) {
       var y_label = "价格"; //Y轴标题
       var x_label = "房间号"; //X轴标题
       //var line_title =new Array(data.extend.list.length); //曲线名称
       var x =[];
       var data1=[];
       var circle  =new Array;
       for(var a=0;a<room.length;a++){
           circle[a]=room[a].price;
           x[a]=room[a].number;
       }
       data1.push(circle);
       var data_max =600; //Y轴最大刻度
       var title = "这是标题"; //统计图标标题
       j.jqplot.diagram.base("baobiao", data1, "A", "房间价格统计表", x, x_label, y_label, data_max, 2);
   }

    function  baobiao(room) {
        var y_label = "价格"; //Y轴标题
        var x_label = "房间号"; //X轴标题
        //var line_title =new Array(data.extend.list.length); //曲线名称
        var x =[];
        var data1=[];
        var circle  =new Array;
        for(var a=0;a<room[0].list.length;a++){
            circle[a]=room[0].list[a].price;
            x[a]=room[0].list[a].number;
        }
        data1.push(circle);
        var data_max =600; //Y轴最大刻度
        var title = "这是标题"; //统计图标标题
        j.jqplot.diagram.base("baobiao", data1, "A", "房间价格统计表", x, x_label, y_label, data_max, 2);
    }




    function selectSat(id){

        $.ajax({
            url: "/hotelonlinereservation/RegistrationController/getName",
            type: "GET",
            data: {"id": id},
            dataType: "json",
            success: function (data) {
                var user = data.extend.list;
                $.each(user, function (index, item) {
                    sta=user.sta;
                    // alert(user.sta);
                    if(user.sta==1){
                        $("#room_add").text("");
                        $("#room_delete_all").text("");
                        $("#room_add").text("新增");
                        $("#room_add").attr("disabled",false);
                        $("#room_delete_all").text("删除");
                        $("#room_delete_all").attr("disabled",false);
                        $("#room_daochu_all").attr("disabled",false);
                    }else {
                        $("#room_add").text("");
                        $("#room_delete_all").text("");
                        $("#room_add").text("无权限");
                        $("#room_add").css("display","none");
                        $("#room_delete_all").text("无权限");
                        $("#room_delete_all").css("display","none");
                        $("#room_daochu_all").css("display","none");
                    }

                });

                //按楼层获取所有房间信息
                selectRoom(id,1,sta);
            },
            error: function () {
                alert("服务器异常");
            },
        });
    }


    //解析房间信息(全部获取)
    function roomAjax(id,room,sta){
        $("#room_table tbody").empty();
        if(room==null){
            $("#room_table tbody").append("<div style='height: 200px;width: 500px;margin-top: 100px;margin-left: 30%;'><span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\" style='font-size:100px;color: #c0c0c0;margin-left: 35%;'></span><p style='font-size: 30px;'>客官，目前所有房间正在整改中</p></div>");
             $("#baobiao").css("display","none");
        }else{
            for(var i=0;i<room[0].list.length;i++){
                var checkBoxId=$("<td style=' vertical-align: middle;'><input type='checkbox' class='check_item'/></td>");
                var roomname=$("<td style=' vertical-align: middle;'></td>").append(room[0].list[i].number);
                var roomfloor=$("<td style=' vertical-align: middle;'></td>").append(room[0].list[i].floor);
                var roomintroduce=$("<td style=' vertical-align: middle;'></td>").append(room[0].list[i].introduce);
                var roomprice=$("<td style=' vertical-align: middle;'></td>").append(room[0].list[i].price+"元/日");
                var roompath=$("<td style=' vertical-align: middle;'  ></td>").append($("<div class='img_d"+i+"' style='width:50px;height:50px;'><img src='"+room[0].list[i].path+"' width='50px'height='50px' style='cursor: pointer;' class='img_a'/></div>"));
                //添加编辑按钮
                if(sta!=1){
                    var edibtn=$($("<span></span>").addClass("glyphicon glyphicon-ban-circle"));
                }else{
                    var edibtn=$("<button></button>").addClass("btn btn-primary btn-sm update_btn")
                        .append($("<span></span>").addClass("glyphicon glyphicon-pencil")).append("编辑");
                    //为编辑按钮添加一个自定义属性来记录id
                    edibtn.attr("room-id",room[0].list[i].roomId);
                    //添加删除按钮
                    var delbtn=$("<button></button>").addClass("btn btn-danger btn-sm delete_btn")
                        .append($("<span></span>").addClass("glyphicon glyphicon-trash")).append("删除");
                    //为删除按钮添加id
                    delbtn.attr("room-id",room[0].list[i].roomId);
                }
                var btntd=$("<td style=' vertical-align: middle;'></td>").append(edibtn).append(" ").append(delbtn);
                $("<tr></tr>").append(checkBoxId).append(roomname).append(roomfloor).append(roomintroduce).append(roomprice)
                    .append(roompath).append(btntd)
                    .appendTo("#room_table tbody");
                //图片加载完成
                loadImg($(".img_d"+i+""));
            }

        }
    }

    //图片加载完成
    function loadImg(img_d) {
        img_d.find("img").hide();
        img_d.append("<p style='display: block;position: relative;bottom: 25px;right: 25px;'><svg ><path fill=\"#0000FF\" d=\"M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50\">\n" +
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


    //解析房间信息(价格获取)
    function roomAjaxByPic(id,room,sta){
        $("#room_table tbody").empty();
        if(room.length==0){
            $("#room_table tbody").append("<div style='height: 200px;width: 500px;margin-top: 100px;margin-left: 30%;'><span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\" style='font-size:100px;color: #c0c0c0;margin-left: 35%;'></span><p style='font-size: 30px;'>客官，目前没有这么便宜的房间</p></div>");
            $("#baobiao").css("display","none");

        }else{
            $.each(room,function(index,item){
                var checkBoxId=$("<td style=' vertical-align: middle;'><input type='checkbox' class='check_item'/></td>");
                var roomname=$("<td style=' vertical-align: middle;'></td>").append(item.number);
                var roomfloor=$("<td style=' vertical-align: middle;'></td>").append(item.floor);
                var roomintroduce=$("<td style=' vertical-align: middle;'></td>").append(item.introduce);
                var roomprice=$("<td style=' vertical-align: middle;'></td>").append(item.price+"元/日");
                var roompath=$("<td style=' vertical-align: middle;'  ></td>").append($("<img src='"+item.path+"' width='50px'height='50px' style='cursor: pointer;' class='img_a'/>"));
                //添加编辑按钮
                if(sta!=1){
                    var edibtn=$($("<span></span>").addClass("glyphicon glyphicon-ban-circle"));


                    /*  //添加删除按钮glyphicon glyphicon-ban-circle
                     var delbtn=$("<button disabled='disabled'></button>").addClass("btn btn-danger btn-sm delete_btn")
                         .append($("<span></span>").addClass("glyphicon glyphicon-trash")).append("无权限");
                     //为删除按钮添加id
                     delbtn.attr("room-id",item.roomId);*/
                }else{
                    var edibtn=$("<button></button>").addClass("btn btn-primary btn-sm update_btn")
                        .append($("<span></span>").addClass("glyphicon glyphicon-pencil")).append("编辑");
                    //为编辑按钮添加一个自定义属性来记录id
                    edibtn.attr("room-id",item.roomId);
                    //添加删除按钮
                    var delbtn=$("<button></button>").addClass("btn btn-danger btn-sm delete_btn")
                        .append($("<span></span>").addClass("glyphicon glyphicon-trash")).append("删除");
                    //为删除按钮添加id
                    delbtn.attr("room-id",item.roomId);
                }
                var btntd=$("<td style=' vertical-align: middle;'></td>").append(edibtn).append(" ").append(delbtn);
                $("<tr></tr>").append(checkBoxId).append(roomname).append(roomfloor).append(roomintroduce).append(roomprice)
                    .append(roompath).append(btntd)
                    .appendTo("#room_table tbody");

              });
        }

    }

    //解析分页条信息
    function page(id,data,sta) {
        //清空数据
        $("#page_nav").empty();
        var ul=$("<ul></ul>").addClass("pagination");
        //构造控件
        var firstPage=$("<li></li>").append($("<a></a>").append("首页").attr("href","javascript:void(0);"));
        var perPage=$("<li></li>").append($("<a></a>").append("&laquo;"));
        //当前为第一页，那首页和上一页无法点击
        //alert(result.extend.pageInfo.hasPreviousPage);
        //是否有上一页
        if(data[0].hasPreviousPage==false){
            firstPage.addClass("disabled");
            perPage.addClass("disabled");
        }else{
            //为控件添加点击事件（点击首页跳转第一页）
            firstPage.click(function(){
                selectRoom(id,1,sta)
                $("#baobiao").empty();
            });
            //  点击上一页，跳转到当前页面减一
            perPage.click(function(){
                selectRoom(id,data[0].pageNum-1,sta)
                $("#baobiao").empty();
            });
        }

        //构造控件（下一页）
        var nextPage=$("<li></li>").append($("<a></a>").append("&raquo;"));
        //尾页
        var lastPage=$("<li></li>").append($("<a></a>").append("尾页").attr("href","javascript:void(0);"));
        //如果当前是最后一页，就无法点击下一页后尾页
        if(data[0].hasNextPage==false){
            nextPage.addClass("disabled");
            lastPage.addClass("disabled");
        }else{
            //为控件添加点击事件（当前页面加一）
            nextPage.click(function(){
                selectRoom(id,data[0].pageNum+1,sta)
                $("#baobiao").empty();
            });
            lastPage.click(function(){
                //跳到最后一页
                selectRoom(id,data[0].pages,sta);
                $("#baobiao").empty();
            });

        }

        //添加首页跟前一页
        ul.append(firstPage).append(perPage);
        //便利页码号result.extend.pageInfo.navigatepageNums==1,2,3.4,5
        //所有页码
        //alert(result.extend.pageInfo.navigatepageNums);
        $.each(data[0].navigatepageNums,function(index,item){
            //item是依次被便利出来的1，2，3，4，5页码
            var numli=$("<li></li>").append($("<a></a>").append(item));
            //如果当前被便利出来的页码等于被点击页数，加一个蓝色标记
            if(data[0].pageNum==item){
                numli.addClass("active");
            }

            numli.click(function(){
                selectRoom(id,item,sta);
                $("#baobiao").empty();
            });
            ul.append(numli);
        });
        //个数
      //  var number=$("<select style='width: 80px;height: 34px;'><option value='5'>5</option><option value='10'>10</option><option value='15'>15</option><option value='20'>20</option></select>");
        //便利完了添加下一页和尾页
        ul.append(nextPage).append(lastPage);
        //将ul添加到nav中
        var nav=$("<nav></nav>").append(ul)
        //将nav添加到id为page_nav的div中
        nav.appendTo("#page_nav");
    }


    //解析分页信息
    function build_pag_nav(data){
        //清空数据
        $("#page_info").empty();
        $("#page_info").append("当前"+data[0].pageNum +"页,总"+data[0].pages +"共页,总"+data[0].total+"记录");
        //记录总数
        totalNmbuer=data[0].pages;
        //记录当前页数
        currentPage=data[0].pageNum;
    }

    //解析分页信息
    function build_pag_navByPic(data){
        //清空数据
        $("#page_info").empty();
        $("#page_info").append("当前"+data.extend.pageInfo.pageNum +"页,总"+data.extend.pageInfo.pages +"共页,总"+data.extend.pageInfo.total+"记录");
        /*//记录总数
        totalNmbuer=data.extend.pageInfo.pages;
        //记录当前页数
        currentPage=data.extend.pageInfo.pageNum;*/
    }






}


window.onload=function () {
    var totalNmbuer,currentPage,totalNmbuer1,currentPage1,sta;
    var id = $.cookie('id');
        //权限判断
    $("#select_order").attr("user-id",id);
    $("#chongzhi").attr("user-id",id);
    if(id!=null){
        selectSat(id);
    }
    selectRoom(id,1);


   //点击评论
    $(document).on("click",".comment_btn",function () {

        $("#save_comment_but").attr("user-id", "");
        $("#save_comment_but").attr("room-id", "");
        $("#addComment textarea").empty();
     //   $(".textarea").text("");
        $(".modal-body textarea").parent().removeClass("has-error");
        $("#p_com").css("color","#c0c0c0");
        $(".modal-body textarea").val("");
        $("#addComment").modal({
            backdrop:"static"
        });
        $("#save_comment_but").attr("user-id", $(this).attr("user-id"));
        $("#save_comment_but").attr("room-id", $(this).attr("room-id"));
    });

    //提交评论
    $("#save_comment_but").click(function () {
        var userid=$(this).attr("user-id");
      var text= $(".modal-body textarea").val().trim();
      if(text==""||text==null){
          return;
      }
      if(text.length>50){
          $(".modal-body textarea").parent().addClass("has-error");
          $("#p_com").css("color","red");
          return;
      }

      $.ajax({
          url:"/hotelonlinereservation/commentController/saveComment",
          type:"POST",
          data:{"roomId":$(this).attr("room-id"),"userId":$(this).attr("user-id"),"context":text},
          dataType:"text",
          success:function (data) {
              if(data==1){
                  $("#addComment").modal("hide");
                  layer_alert('评论成功', "success");
                  selectRoom(userid,currentPage,sta);
              }else{
                  layer_alert('评论失败联系管理员', "error");
              }
          },
          error:function () {
              layer_alert('网络异常', "error");
          },
      });

    });

    //获取姓名
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
                        $("#select_order").text("查看订单");
                    }else {
                        $("#select_order").text("我的订单");
                    }
                });

                //查询所有的房间信息
                selectRoom(id,1,sta);
            },
            error: function () {
                layer_alert('服务器异常', "error");
            },
        });
    }
    //删除评论
    $(document).on("click",".delete_btn_com",function () {
        id = $(this).attr("id");
        var roomId=$(this).attr("roomId");
        var user = $(this).attr("user-id");
        //alert(user);
        if(confirm("确认删除该评论吗?")){
            $.ajax({
                url: "/hotelonlinereservation/commentController/deleteCom/"+id+"/"+roomId,
                type: "DELETE",
                success: function (data) {
                    if(data==0){
                        layer_alert('删除成功', "success");
                        selectRoom(user, currentPage,sta);
                    }else{
                        layer_alert('删除失败联系管理员', "error");
                    }

                },
                error: function () {
                    layer_alert('联系管理员', "error");
                },
            });
        }

    });
    //点击点赞(未登录)
    $(document).on("click",".dianzan1",function () {
        window.location.href="login.html";
    });

    $(document).on("click",".comment_btn1",function () {
        window.location.href="login.html";
    });

    $(document).on("click",".booking_btn1",function () {
        window.location.href="login.html";
    });

    //点击点赞(已登录)
    $(document).on("click",".dianzan",function () {
        var id=$(this).attr("id");
        var user=$(this).attr("user-id");
          var roomid=$(this).attr("roomId");
       $.ajax({
           url:"/hotelonlinereservation/commentController/saveGive",
           dataType:"json",
           data:{"id":id,"user":user,"roomid":roomid},
           Type:"GET",
           success:function (data) {
                   if(data.extend.comments==0){

                       selectRoom(user,currentPage,sta);
                       $("#"+id).css("color","red");
                   }
                   if(data.extend.comments.state==1){

                       layer_alert('您已经给改评论点赞了', "warn");

                       return;
                   }
           },
           error:function () {
               layer_alert('联系管理员', "error");
           },
       });
    });

    //导出数据
    $(document).on("click","#room_daochu_all",function () {
        $(".table2excel").table2excel({
            exclude: ".noExl",
            name: "Excel Document Name",
            filename: "酒店订单管理",
            exclude_img: true,
            exclude_links: true,
            exclude_inputs: true
        });
    });

    //订房
    $(document).on("click",".booking_btn",function () {
        var userid=$(this).attr("user-id");
        getRoom($(this).attr("room-id"));
        $("#save_order").attr("room-id",$(this).attr("room-id"));
        $("#save_order").attr("user-id",$(this).attr("user-id"));
        $("#time").val("");
        $("#time1_input").val("");
        $("#total_p").text("");
        $("#save_order").attr("disabled","disabled");
        $("#addorder").modal({
            backdrop:"static"
        });

    });

   //重置
    $("#chongzhi").click(function () {
        $("#baobiao").css("display","none");
        $(".tr1").empty();
        $("#room_table tbody").empty();
        $("#page_nav").empty();
        $("#page_info").empty();
        $("#page_nav1").empty();
        $("#page_info1").empty();
        $("#but_dao").empty();

        selectRoom($(this).attr("user-id"),1,sta);
    });

    //查看订单
    $("#select_order").click(function () {
        if($(this).attr("user-id")==undefined){
            window.location.href="login.html";
        }else if(sta==1){
            $("#baobiao").empty();
            selectAll(1);
        } else{
            $("#baobiao").empty();
           selectOrder($(this).attr("user-id"),1);
        }
    });

    //查出所有订单
    function selectAll(pn) {
        $("#but_dao").empty();
        $.ajax({
            url:"/hotelonlinereservation/OrderController/selectAll",
            type:"GET",
            dataType:"json",
            data:{"pn":pn},
            success:function (data) {
                var order=data.extend.pageInfo.list;
                // alert(JSON.stringify(data.extend.pageInfo.list, null, 4));
                $(".tr1").empty();
                $("#room_table tbody").empty();
                $("#page_nav").empty();
                $("#page_info").empty();
                $(".tr1").append("<th>#</th>").append("<th>用户名</th>").append("<th>房间名</th>")
                    .append("<th>预订时间</th>").append("<th>退房时间</th>")
                    .append("<th>总付金额</th>").append("<th>房间图片</th>").append("<th>操作</th>");
                $("#but_dao").append("<button class=\"btn btn-primary\" id=\"room_daochu_all\" style=\"float: left;margin-left: 2px;\" ><span class=\"glyphicon glyphicon-file\"></span>导出</button>");
                getOrederAll(order);
                getPage(data);
                getPageToAll(data);
                //baobiao
                $("#baobiao").css("display","block");
                baobiao(order);
            },
            error:function () {
                layer_alert('查询错误联系管理员', "error");
            },
        });
    }

    function getPageToAll(data) {
        //清空数据
        $("#page_nav1").empty();
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
                selectAll(1);
                $("#baobiao").empty();
            });
            //  点击上一页，跳转到当前页面减一
            perPage.click(function(){
                selectAll(data.extend.pageInfo.pageNum-1);
                $("#baobiao").empty();
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
                selectAll(data.extend.pageInfo.pageNum+1);
                $("#baobiao").empty();
            });
            lastPage.click(function(){
                //跳到最后一页
                selectAll(data.extend.pageInfo.pages);
                $("#baobiao").empty();
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
                selectAll(item);
                $("#baobiao").empty();
            });
            ul.append(numli);
        });
        //便利完了添加下一页和尾页
        ul.append(nextPage).append(lastPage);
        //将ul添加到nav中
        var nav=$("<nav></nav>").append(ul);
        //将nav添加到id为page_nav的div中
        nav.appendTo("#page_nav1");
    }

    function  baobiao(order) {
        var y_label = "总金额"; //Y轴标题
        var x_label = "时间"; //X轴标题
        //var line_title =new Array(data.extend.list.length); //曲线名称
        var x =[];
        var data1=[];
        var circle  =new Array;
        for(var a=0;a<order.length;a++){
            circle[a]=order[a].totalPrice;
            x[a]=init(order[a].startTime);
        }
        data1.push(circle);
        var data_max =10000; //Y轴最大刻度
        var title = "这是标题"; //统计图标标题
        j.jqplot.diagram.base("baobiao", data1, "A", "订单曲线统计表", x, x_label, y_label, data_max, 1);
    }




    function getOrederAll(order) {
        if(order.length==0){
            //无订单
            $(".tr1").empty();
            $(".tr1").append("<th>所有订单</th>")
            $("#room_table tbody").append("<div style='height: 200px;width: 500px;margin-top: 100px;margin-left: 30%;'><span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\" style='font-size:100px;color: #c0c0c0;margin-left: 35%;'></span><p style='font-size: 30px;'>目前没有对应的订单内容，您可以通过" +
                "重置后，酒店预订，制定住宿计划。</p></div>");
        }else{
            $.each(order,function(index,item){
                var span=$("<td style=' vertical-align: middle;'><span class='glyphicon glyphicon-eye-open' aria-hidden='true'></span> </td>");
                var roomname=$("<td style=' vertical-align: middle;'></td>").append(item.username);
                var roomfloor=$("<td style=' vertical-align: middle;'></td>").append(item.roomnumber);
                var roomintroduce=$("<td style=' vertical-align: middle;'></td>").append(init(item.startTime));
                var endTime=$("<td style=' vertical-align: middle;'></td>").append(init(item.endTime));
                var roomprice=$("<td style=' vertical-align: middle;'></td>").append(item.totalPrice+"元");
                var roompath=$("<td style=' vertical-align: middle;'  ></td>").append($("<img src='"+item.path+"' width='50px'height='50px' style='cursor: pointer;' class='img_a'/>"));
                var delbtn=$("<button></button>").addClass("btn btn-danger btn-sm delete_order_guan")
                    .append($("<span></span>").addClass("glyphicon glyphicon-trash")).append("退房");
                //为删除按钮添加id
                delbtn.attr("order-id",item.id);
                var btn=$("<td style=' vertical-align: middle;' ></td>").append(delbtn);

                $("<tr></tr>").append(span).append(roomname).append(roomfloor).append(roomintroduce).append(endTime).append(roomprice)
                    .append(roompath) .append(btn)
                    .appendTo("#room_table tbody");
            });
        };
    }




    function selectOrder(userid,pn) {
       // var userid=$(this).attr("user-id");
        $.ajax({
            url:"/hotelonlinereservation/OrderController/selectOrder",
            type:"GET",
            dataType:"json",
            data:{"userid":userid,"pn":pn},
            success:function (data) {
                var order=data.extend.pageInfo.list;
               // alert(JSON.stringify(data.extend.pageInfo.list, null, 4));
                $(".tr1").empty();
                $("#room_table tbody").empty();
                $("#page_nav").empty();
                $("#page_info").empty();
                $(".tr1").append("<th>#</th>").append("<th>用户名</th>").append("<th>房间名</th>")
                    .append("<th>预订时间</th>").append("<th>退房时间</th>")
                    .append("<th>总付金额</th>").append("<th>房间图片</th>").append("<th>操作</th>");
                getOrede(order,userid);
                getPage(data);
                getPageTo(data,userid);
                $("#baobiao").css("display","block");
                $("#baobiao").empty();
                baobiao(order);
            },
            error:function () {
                layer_alert('查询错误联系管理员', "error");
            },
        });
    }

    //解析订单
    function getOrede(order,userid) {
       // alert(order);
        if(order.length==0){
            //无订单
            $(".tr1").empty();
            $(".tr1").append("<th>我的订单</th>")
            $("#room_table tbody").append("<div style='height: 200px;width: 500px;margin-top: 100px;margin-left: 30%;'><span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\" style='font-size:100px;color: #c0c0c0;margin-left: 35%;'></span><p style='font-size: 30px;'>您没有对应的订单内容，您可以通过" +
                "重置后，酒店预订，制定住宿计划。</p></div>");
        }else{
            $.each(order,function(index,item){
                var span=$("<td style=' vertical-align: middle;'><span class='glyphicon glyphicon-eye-open' aria-hidden='true'></span> </td>");
                var roomname=$("<td style=' vertical-align: middle;'></td>").append(item.username);
                var roomfloor=$("<td style=' vertical-align: middle;'></td>").append(item.roomnumber);
                var roomintroduce=$("<td style=' vertical-align: middle;'></td>").append(init(item.startTime));
                var endTime=$("<td style=' vertical-align: middle;'></td>").append(init(item.endTime));
                var roomprice=$("<td style=' vertical-align: middle;'></td>").append(item.totalPrice+"元");
                var roompath=$("<td style=' vertical-align: middle;'  ></td>").append($("<img src='"+item.path+"' width='50px'height='50px' style='cursor: pointer;' class='img_a'/>"));
                var delbtn=$("<button></button>").addClass("btn btn-danger btn-sm delete_order")
                    .append($("<span></span>").addClass("glyphicon glyphicon-trash")).append("退订");
                //为删除按钮添加id
                delbtn.attr("order-id",item.id);
                delbtn.attr("user-id",userid);
                var upbtn=$("<button disabled='disabled'></button>").addClass("btn btn-primary btn-sm update_btn")
                    .append($("<span></span>").addClass("glyphicon glyphicon-pencil")).append("禁止改签");
                upbtn.attr("order-id",item.id);
                upbtn.attr("user-id",userid);
                var btn=$("<td style=' vertical-align: middle;' ></td>").append(delbtn).append(" ").append(upbtn);
                $("<tr></tr>").append(span).append(roomname).append(roomfloor).append(roomintroduce).append(endTime).append(roomprice)
                    .append(roompath).append(btn)
                    .appendTo("#room_table tbody");
            });
        };
    }

    //解析分页
    function getPage(data) {
        $("#page_info1").empty();
        $("#page_info1").append("当前"+data.extend.pageInfo.pageNum +"页,总"+data.extend.pageInfo.pages +"共页,总"+data.extend.pageInfo.total+"记录");
        //记录总数
        totalNmbuer1=data.extend.pageInfo.pages;
        //记录当前页数
        currentPage1=data.extend.pageInfo.pageNum;

    }
  //解析分页条
    function getPageTo(data,id) {
        //清空数据
        $("#page_nav1").empty();
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
                selectOrder(id,1);
                $("#baobiao").empty();
            });
            //  点击上一页，跳转到当前页面减一
            perPage.click(function(){
                selectOrder(id,data.extend.pageInfo.pageNum-1);
                $("#baobiao").empty();
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
                selectOrder(id,data.extend.pageInfo.pageNum+1);
                $("#baobiao").empty();
            });
            lastPage.click(function(){
                //跳到最后一页
                selectOrder(id,data.extend.pageInfo.pages);
                $("#baobiao").empty();
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

                selectOrder(id,item);
                $("#baobiao").empty();
            });
            ul.append(numli);
        });
        //便利完了添加下一页和尾页
        ul.append(nextPage).append(lastPage);
        //将ul添加到nav中
        var nav=$("<nav></nav>").append(ul);
        //将nav添加到id为page_nav的div中
        nav.appendTo("#page_nav1");
    }

    //解析分页信息
    function build_pag_nav(id,data){
        //清空数据
        $("#page_info").empty();
        $("#page_info").append("当前"+data.extend.pageInfo.pageNum +"页,总"+data.extend.pageInfo.pages +"共页,总"+data.extend.pageInfo.total+"记录");
        //记录总数
        totalNmbuer=data.extend.pageInfo.pages;
        //记录当前页数
        currentPage=data.extend.pageInfo.pageNum;
    }

    //管理员退房
    $(document).on("click",".delete_order_guan",function () {
        if(confirm("确认退掉该房间吗?")){
            $.ajax({
                url:"/hotelonlinereservation/OrderController/deleteOrder/"+$(this).attr("order-id"),
                type:"DELETE",
                dataType:"json",
                success:function (data) {
                    if(data==1){
                        layer_alert('房间退订成功', "success");
                        selectAll(1);
                    }
                },
                error:function () {
                    layer_alert('退订失败联系管理员', "error");
                },
            });
        }


    });

    //个人房间退订
    $(document).on("click",".delete_order",function () {
        var userid=$(this).attr("user-id");
        if(confirm("确认退订该房间吗?")){
            $.ajax({
                url:"/hotelonlinereservation/OrderController/deleteOrder/"+$(this).attr("order-id"),
                type:"DELETE",
                dataType:"json",
                success:function (data) {
                    if(data==1){
                        layer_alert('房间退订成功', "success");
                        selectOrder(userid,1);
                    }
                },
                error:function () {
                    layer_alert('退订失败联系管理员', "error");
                },
            });
        }

    });

    //查出天数及价格
    $("#time").change(function () {
        var start_time= $.trim($("#time").val());
        var end_time= $.trim($("#time1_input").val());
        if(end_time!=""&&start_time!=""){
            var  time1 = Date.parse(new Date(start_time));
            var time2 = Date.parse(new Date(end_time));
            var total_time=Math.abs(parseInt((time2 - time1)/1000/3600/24));
            var price=$("#price_order").text();
            price= price.substring(1,price.length);
            var total_price=parseInt(total_time)*parseInt(price);
            $("#total_p").text("总共预订"+total_time+"天,预订金额为"+total_price+"元");
            $("#save_order").attr("disabled",false);
        }else{
            $("#total_p").text("");
            $("#save_order").attr("disabled","disabled");
        }
    });
    $("#time1_input").change(function () {
        var start_time= $.trim($("#time").val());
        var end_time= $.trim($("#time1_input").val());
        if(end_time!=""&&start_time!=""){
            var  time1 = Date.parse(new Date(start_time));
            var time2 = Date.parse(new Date(end_time));
            var total_time=Math.abs(parseInt((time2 - time1)/1000/3600/24));
            var price=$("#price_order").text();
            price= price.substring(1,price.length);
            var total_price=parseInt(total_time)*parseInt(price);
            $("#total_p").text("总共预订"+total_time+"天,预订金额为"+total_price+"元");
            $("#save_order").attr("disabled",false);
        }else{
            $("#total_p").text("");
            $("#save_order").attr("disabled","disabled");
        }
    });

    //提交订单
    $("#save_order").click(function () {
      var roomnumber=$("#numbe_order").text();
      var start_time= $("#time").val();
      var end_time= $("#time1_input").val();
      var  time1 = Date.parse(new Date(start_time));
      var time2 = Date.parse(new Date(end_time));
      var total_time=Math.abs(parseInt((time2 - time1)/1000/3600/24));
      var price=$("#price_order").text();
      var path=$("#img_input").attr("src");
      price= price.substring(1,price.length);
      var userid=$(this).attr("user-id");
      var roomid=$(this).attr("room-id");
      var total_price=parseInt(total_time)*parseInt(price);
        $.ajax({
            url:"/hotelonlinereservation/OrderController/saveOrder",
            type:"POST",
            dataType:"json",
            data:{"start_Time":start_time,"end_Time":end_time,"userid":userid,"totalPrice":total_price,"roomnumber":roomnumber,"path":path,"pn":currentPage},
            success:function (data) {
               if(data==1){
                   layer_alert('房间预定成功', "success");
                   $("#addorder").modal("hide");
                   selectRoom(userid,currentPage,sta);
               }
            },
            error:function () {
                layer_alert('预定失败联系管理员', "error");
            },
        });
    });

    //获取房间信息
    function getRoom(id) {
        $.ajax({
            url:"/hotelonlinereservation/ManagementController/getRoom/"+id,
            type:"GET",
            dataType:"json",
            success:function (data) {
                var room=data.extend.room;
                $("#numbe_order").text(room.number);
                $("#price_order").text("￥"+room.price);
                $("#img_input").attr("src",room.path);
            },
            error:function () {
                layer_alert('获取失败', "error");
            },
        });
    }
    //查询所有的评论及房间信息
    function selectRoom(id,pn,sta) {
      var pn= parseFloat(pn);

        $.ajax({
            url:"/hotelonlinereservation/ManagementController/selectRoomTo",
            dataType:"json",
            data:"pn="+pn,
            Type:"GET",

            success:function (data) {
                $("#loading").css("display","none");
                var room=data.extend.pageInfo;
                var room=   JSON.parse(data.extend.pageInfo);

                roomAjax(id,room,sta);
                //解析分页条信息
                pageByprice(id,room,sta);
               // 解析分页信息
               build_pag_nav(id,room);
            },
            error:function () {
                layer_alert('联系管理员', "error");
            },
        });
    }

    function roomAjax(id,room,sta) {
        $("#room_table tbody").empty();

        for(var a=0;a<room[0].list.length;a++){
            //$.each(room[0].list[a],function(index,item){

                var roompath=$("<td style=' vertical-align: middle;width:200px; '  ></td>").append($("<div style='float: left;width:'200px ' class='img_d"+a+"'><img src='"+room[0].list[a].path+"' width='200px'height='201px' style='cursor: pointer;' class='img_a'/></div>"));
                var div=$("<div style='height:201px;float: left;width: 100%;margin-top:1%; '></div>");
                var div_p=  $("<div style='width: 150px;height: 202px;float: left;'></div>").append("<span style='margin-top:30px;font-size: 20px;display: block;'class='glyphicon glyphicon-home' aria-hidden='true'>房间号:"+room[0].list[a].number+"</span>")
                    .append("<span style='margin-top:30px;margin-left:30px;font-size: 30px;display: block;color: red'class='glyphicon glyphicon-jpy' aria-hidden='true'>"+room[0].list[a].price+"</span>");
                var div_ping= $("<div style='width: 82%;height: 100%;overflow-y:auto;float: left;border: 1px solid #c0c0c0;margin-left: 2%;' class='div_ping'></div>");
                div_ping.attr("id",room[0].list[a].roomId);

                div.append(div_p).append(div_ping);

                //添加按钮
                if(id==undefined){
                    var comment=$("<button  style='margin-top: 30px;margin-left: 10px;float: left'></button>").addClass("btn btn-primary btn-sm comment_btn1")
                        .append($("<span></span>").addClass("glyphicon glyphicon-comment")).append("评论");
                    comment.attr("user-id","1");
                    comment.attr("room-id",room[0].list[a].roomId);
                    var booking=$("<button  style='margin-top: 30px;margin-left: 10px;float: left'></button>").addClass("btn btn-danger btn-sm booking_btn1")
                        .append($("<span></span>").addClass("glyphicon glyphicon-heart-empty")).append("预订");
                    booking.attr("user-id","1");
                    booking.attr("room-id",room[0].list[a].roomId);
                    div_p.append(comment).append(" ").append(booking);
                } else{
                    //alert(item.order.state);
                    var comment=$("<button  style='margin-top: 30px;margin-left: 10px;float: left'></button>").addClass("btn btn-primary btn-sm comment_btn")
                        .append($("<span></span>").addClass("glyphicon glyphicon-comment")).append("评论");
                    comment.attr("user-id",id);
                    comment.attr("room-id",room[0].list[a].roomId);
                    if(room[0].list[a].order.state==1){
                        var booking=$("<button  style='margin-top: 30px;float: left' disabled='disabled'></button>").addClass("btn btn-danger btn-sm booking_btn")
                            .append($("<span></span>").addClass("glyphicon glyphicon-heart-empty")).append("已被预订");
                    }else{
                        var booking=$("<button  style='margin-top: 30px;margin-left: 10px;float: left'></button>").addClass("btn btn-danger btn-sm booking_btn")
                            .append($("<span></span>").addClass("glyphicon glyphicon-heart-empty")).append("预订");
                    }
                    booking.attr("user-id",id);
                    booking.attr("room-id",room[0].list[a].roomId);
                    div_p.append(comment).append(" ").append(booking);
                }

                $("<tr style='height:201px;' ></tr>").append(roompath).append(div).appendTo("#room_table tbody");
                //查询评论
                selsectComments(room[0].list[a].roomId ,1,id,sta);
               //图片加载完成
               loadImg($(".img_d"+a+""));

           // });
        }

        //图片加载完成
        function loadImg(img_d) {
            img_d.find("img").hide();
            img_d.append("<p style='display: block;position: relative;width: 200px;top: 25px;left: 45px;'><svg ><path fill=\"#0000FF\" d=\"M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50\">\n" +
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



    }
    //解析分页条
    function pageByprice(id,data,sta) {
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
                selectRoom(id,1,sta);
            });
            //  点击上一页，跳转到当前页面减一
            perPage.click(function(){
                selectRoom(id,data[0].pageNum-1,sta);
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
                selectRoom(id,data[0].pageNum+1,sta);
            });
            lastPage.click(function(){
                //跳到最后一页
                selectRoom(id,data[0].pages,sta);
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

    //解析分页信息
    function build_pag_nav(id,data){
        //清空数据
        $("#page_info").empty();
        $("#page_info").append("当前"+data[0].pageNum +"页,总"+data[0].pages +"共页,总"+data[0].total+"记录");
        //记录总数
        totalNmbuer=data[0].pages;
        //记录当前页数
        currentPage=data[0].pageNum;
    }


    //获取评论
    function selsectComments(roomId,pn,id,sta) {
        var div=$("#room_table").find('div[id^='+roomId+']');
        div.empty();
        $.ajax({
            url:"/hotelonlinereservation/commentController/selectRoonAndCom",
            dataType:"json",
            data:{"roomId":roomId,"pn":pn},
            Type:"GET",
            success:function (data) {

                /*var mes = JSON.stringify(data, null, 4);
                alert(mes);*/
                //解析评论 var room=data.extend.pageInfo;
                var pinglun=   JSON.parse(data.extend.list);
               // alert(pinglun);
                if(pinglun.length==0){
                    div.append("<span style='display: block;margin-top: 10%;margin-left:20%;font-size: 30px;height: 50px;line-height: 50px;color: red;' class='glyphicon glyphicon-alert'>当前房间还没有评论，快留下你的足迹吧</span>");
                }else{
                    $.each(pinglun,function(index,item){
                        //格式化时间
                        var tt= init(item.time.time);
                        if(id==undefined){
                            div.append("<p style='margin-top: 20px;font-size: 15px;margin-left: 20px; display: block'>"+item.username+":"+item.context+"<span style='display: block;float: right;font-size: 15px;margin-right: 20px;'>"+tt+"</span>" +
                                "<span style='display: block;float: right;margin-right: 20px;'>("+item.greatnumber+")</span>"+"<span  class='glyphicon glyphicon-thumbs-up dianzan1' aria-hidden='true' style='float: right;cursor: pointer;' id='"+item.id+"';></span>"+
                                "</p>");
                        }else if(sta==1){
                            div.append("<p style='margin-top: 20px;font-size: 15px;margin-left: 20px; display: block'>"+item.username+":"+item.context+"<button id='"+item.id+"'user-id='"+id+"' roomId='"+roomId+"' class='btn btn-danger btn-sm delete_btn_com' style='height: 24px;float: right;margin-right: 20px;'><span class='glyphicon glyphicon-trash'></span>删除</button>"+
                                "<span style='display: block;float: right;font-size: 15px;'>"+tt+"</span>"
                                + "</p>");

                        } else{
                            div.append("<p style='margin-top: 20px;font-size: 15px;margin-left: 20px; display: block'>"+item.username+":"+item.context+"<span style='display: block;float: right;font-size: 15px;margin-right: 20px;'>"+tt+"</span>" +
                                "<span style='display: block;float: right;margin-right: 20px;'>("+item.greatnumber+")</span>"+"<span class='glyphicon glyphicon-thumbs-up dianzan' aria-hidden='true' style='float: right;cursor: pointer;' id='"+item.id+"'roomId='"+roomId+"';></span>"+
                                "</p>");
                            $(".dianzan").attr("user-id",id);
                        }

                    });

                }
            },
            error:function () {
                alert("联系管理员");
            },
        });
    }

    //时间格式化
    function init(time) {
        var d = new Date(time);
        var year = d.getFullYear();
        var day = d.getDate();
        var month = +d.getMonth() + 1;
        var hour = d.getHours();
        var minute = d.getMinutes();
        var second = d.getSeconds();
        var misec = d.getMilliseconds();
        var times = year + "-" + formate(month) + "-" + formate(day) + " " + formate(hour) + ":" + formate(minute) + ":" + formate(second) + ":" + formate(misec);
        return times;
    }

    function formate(d){
        return d>9?d:'0'+d;
    }
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



}


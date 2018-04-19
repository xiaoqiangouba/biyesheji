window.onload = function(){
    $(function(){
        var  clearTime=null;//ji计算滑动时间
        //当前的序号   列表 的 序号
        var $index=0;
        //前滑动的页面
        var  $qianIdenx=0;
        $("#list li").mouseover(function(){
            //得到悬停的是哪一个列表
            //获取li.index
            $index=$(this).index();
            //滑动开始
            scrollView();
            $qianIdenx=$index;
        });
        //自动开始 滑动
        autoView();
        function scrollView(){
            //遍历列表标签  将当前对应的按钮变为白色块
            $("#list li").eq($index).addClass("hover").siblings().removeClass("hover");
            if ($index>$qianIdenx) {

                $("#imgbox img").eq($qianIdenx).stop(true, true).animate({
                    "left" : "-720px"
                });
                //图片过去 随后进行下一张往前走
                $("#imgbox img").eq($index).css("left","720px").stop(true, true).animate({
                    "left" : "0"
                });
            }else if($index < $qianIdenx){
                $("#imgbox img").eq($qianIdenx).stop(true, true).animate({
                    "left" : "720px"
                });
                $("#imgbox img").eq($index).css("left","-720px").stop(true, true).animate({
                    "left" : "0"
                });
            };
        };
        function autoView(){
//		设置时间
            clearTime = setInterval(function(){
//			每次序列号+1
                $index++;
                if($index > 7){
                    $index = 0;
                }
//			开始滑动
                scrollView();
                $qianIdenx = $index;
            },2000);
        }
        $("#imgbox").hover(function(){
            $(".btnleft ,.btnright").stop().fadeIn(500);
        },function(){
            $(".btnleft ,.btnright").stop().fadeOut(500);
        });
    });

    //点击QQ
    $("#login_qq").click(function(){
        //弹出模态框
        layer_alert('该功能尚未开通', "warn");
    });
    //点击微博
    $("#login_wei").click(function(){
        //弹出模态框
        layer_alert('该功能尚未开通', "warn");
    });
    //点击git
    $("#login_git").click(function(){
        //弹出模态框
        layer_alert('该功能尚未开通', "warn");
    });
    //点击人人
    $("#login_ren").click(function(){
        //弹出模态框
        layer_alert('该功能尚未开通', "warn");
    });

    //用户登录
    $("#login").click(function () {
        var username=$("#username").val();
        var password=$("#password").val();
        username=username.trim();
        password=password.trim();
        password=$.md5(password);
        $.ajax({
            url:"/hotelonlinereservation/RegistrationController/userLogin",
            dataType:"json",
            type:"post",
            data:{"username":username,"password":password},
            success : function (data) {

                //用户名或密码不正确
                if(data.code==200){
                   $("#result").text("用户名或密码不正确");
                   $("#result").css("color","red");
                   $("#password").parent().addClass("has-error");
                   $("#username").parent().addClass("has-error");
                }else{
                    if(window.navigator.cookieEnabled){
                       $.cookie('id',data.extend.id,{ expires: 7, path: '/',});
                        window.location.href="index.html";
                    }else{
                        layer_alert('请您打开游览器的cookie', "error");
                    }


                       /*window.location.href="index.html?&&="+data.extend.id;*/

                }
            },
            error : function () {
                layer_alert('服务器异常', "error");
            },
        });
    });
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
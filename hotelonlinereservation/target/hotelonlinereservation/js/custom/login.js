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
        $("#exampleModal").modal({
            backdrop:"static"
        });
    });
    //点击微博
    $("#login_wei").click(function(){
        //弹出模态框
        $("#exampleModal").modal({
            backdrop:"static"
        });
    });
    //点击git
    $("#login_git").click(function(){
        //弹出模态框
        $("#exampleModal").modal({
            backdrop:"static"
        });
    });
    //点击人人
    $("#login_ren").click(function(){
        //弹出模态框
        $("#exampleModal").modal({
            backdrop:"static"
        });
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
                        alert("请您打开浏览器cookies");
                    }


                       /*window.location.href="index.html?&&="+data.extend.id;*/

                }
            },
            error : function () {
                alert("服务器异常");
            },
        });
    });

}
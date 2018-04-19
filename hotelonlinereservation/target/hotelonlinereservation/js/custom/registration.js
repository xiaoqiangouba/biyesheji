window.onload = function(){
    //点击QQ
    $("#img_qq").click(function(){
        //弹出模态框
        layer_alert('该功能尚未开通', "warn");
    });
    //点击微信
    $("#img_weixin").click(function(){
        //弹出模态框
        layer_alert('该功能尚未开通', "warn");
    });
    //点击新浪
    $("#img_xinlang").click(function(){
        //弹出模态框
        layer_alert('该功能尚未开通', "warn");
    });

    //检查用户名是否存在
    $("#userName").change(function () {
        var userName=$("#userName").val();
        if(!user(this)){
            $("#add_user_but").attr("ajax","error");
            return  false;
        }/*else if(userName=="张三"){
            view_masge("#userName","error","用户名已存在");
            $("#add_user_but").attr("disabled","disabled");
           return;}*/
        else{
            /*
            * 发请求查看用户名是否存在
            */
            $.ajax({
                url:"/hotelonlinereservation/RegistrationController/verifyUserName",
                type:"POST",
                data:"userName="+userName,
                dataType:"json",
                success:function (data) {
                    if(data==true){
                        view_masge("#userName","success","");
                        $("#add_user_but").attr("ajax","success");
                        return  true;
                    }else{
                        view_masge("#userName","error","用户名已存在");
                        $("#add_user_but").attr("disabled","disabled");
                        return  false;
                    }
                },
                error : function () {
                    layer_alert('服务器异常', "error");
                },
            });
        };
    });

    //检查两次密码是否一致；
    $("#passWord").change(function () {
        var passWord=$("#passWord").val();
        var passWord1=$("#passWord1").val();
        $("#passWord").parent().removeClass("has-success has-error");
        $("#passWord1").parent().removeClass("has-success has-error");
        $("#password_span").text("");
        if(passWord!=passWord1){
            $("#passWord").parent().addClass("has-error");
            $("#passWord1").parent().addClass("has-error");
            $("#password_span").text("两次密码不一致");
            $("#password_span").css("color","red");
            $("#add_user_but").attr("disabled","disabled");
            return false;
        }else{
            $("#passWord").parent().addClass("has-success");
            $("#passWord1").parent().addClass("has-success");
            $("#password_span").text("");
            return true;
        }
    });
    $("#passWord1").change(function () {
        var passWord=$("#passWord").val();
        var passWord1=$("#passWord1").val();
        $("#passWord").parent().removeClass("has-success has-error");
        $("#passWord1").parent().removeClass("has-success has-error");
        $("#password_span").text("");
        if(passWord!=passWord1){
            $("#passWord").parent().addClass("has-error");
            $("#passWord1").parent().addClass("has-error");
            $("#password_span").text("两次密码不一致");
            $("#password_span").css("color","red");
            $("#add_user_but").attr("ajax","error");
            return false;
        }else{
            $("#passWord").parent().addClass("has-success");
            $("#passWord1").parent().addClass("has-success");
            $("#password_span").text("");
            $("#add_user_but").attr("ajax","success");
            return true;
        }
    });
    //检验用户名是否合法
    function user(id){
        var userName=$(id).val();
        var regNmae=/(^[a-zA-Z0-9_-]{6,16}$)|(^[\u2E80-\u9FFF]{2,5})/;
        if(!regNmae.test(userName)){
            view_masge(id,"error","用户名为2-5个中文或6-16位英文和数字组合");
            return false;
        }else{
            view_masge(id,"success","");
            return true;
        }
    };
    //检验qq邮箱是否正确
    $("#email").change(function(){
        $("#email").parent().removeClass("has-success has-error");
        $("#email_span").text("");
        var email=$(this).val();
        var regEamli=/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
        if(!regEamli.test(email)){
            //邮箱格式不正确
            $(this).parent().addClass("has-error");
            $("#email_span").text("邮箱格式不正确");
            $("#email_span").css("color","red");
            $("#add_user_but").attr("ajax","error");
            //关闭获取验证码按钮
            $("#email_but").addClass("disabled");
            $("#email_but").attr("disabled","disabled");
            return false;
        }else {
            /**
             * 检查邮箱是否注册
             */
            $.ajax({
                url:"/hotelonlinereservation/RegistrationController/verifyEmail",
                data:"email="+email,
                dataType:"json",
                type:"POST",
                success : function (data) {
                    if(data!=true){
                        $("#email").parent().addClass("has-error");
                        $("#email_span").text("此邮箱已注册");
                        $("#email_span").css("color","red");
                        $("#add_user_but").attr("ajax","error");
                        //关闭获取验证码按钮
                        $("#email_but").addClass("disabled");
                        $("#email_but").attr("disabled","disabled");
                        return false;
                    }else{
                        $("#email").parent().addClass("has-success");
                        $("#email_span").text("");
                        $("#add_user_but").attr("ajax","success");
                        //释放获取验证码按钮
                        $("#email_but").removeClass("disabled");
                        $("#email_but").attr("attr","true");
                        $("#email_but").attr("disabled",false);
                        // alert($("#email_but").attr("attr"));
                        //调用获取验证码
                        yanzhenma();


                        return true;
                    }
                },
                error : function () {
                    layer_alert('邮箱验证错误', "error");
                }
            });

        };

    });

    //显示检验信息
    function view_masge(id,value,text) {
        //清除原来样式
        $(id).parent().removeClass("has-success has-error");
        $("#user_span").text("");
        if("success"==value){
            //给其父元素添加成功样式
            $(id).parent().addClass("has-success");
            //其下面的span显示状态
            $("#user_span").text(text);
        }else{
            //给其父元素添加成功样式
            $(id).parent().addClass("has-error");
            //span显示状态
            $("#user_span").text(text);
            $("#user_span").css("color","red");
        }
    };

    //鼠标悬浮图片更换---qq
    $("#img_qq").mouseover(function () {
        document.getElementById("img_qq").src="img/registration/qq1.png";
    });
    $("#img_qq").mouseout(function () {
        document.getElementById('img_qq').src ="img/registration/qq.png"
    });

    //微信
    $("#img_weixin").mouseover(function () {
        document.getElementById("img_weixin").src="img/registration/weixin1.png";
    });
    $("#img_weixin").mouseout(function () {
        document.getElementById('img_weixin').src ="img/registration/weixin.png";
    });

    //新浪
    $("#img_xinlang").mouseover(function () {
        document.getElementById("img_xinlang").src="img/registration/xinlang1.png";
    });
    $("#img_xinlang").mouseout(function () {
        document.getElementById('img_xinlang').src ="img/registration/xinlang.png";
    });

    function yanzhenma(){
        //全局变量记录验证码
        var yan=null;
        if($("#email_but").attr("attr")=="true"){
            //获取邮箱验证码
            $("#email_but").click(function () {
                $("#email_but").attr("disabled","disabled");
                //设置一分钟
                var wait=60;
                //获取邮箱
                var email= $("#email").val();
                //发送邮件
                if(wait==60){
                    $.ajax({
                        url: "/hotelonlinereservation/EmailController/verifyEmail",
                        type: "POST",
                        data: "email=" + email,
                        success: function (data) {
                            yan=data;
                        },
                        error: function (data) {
                            layer_alert('网络未连接', "error");
                        },
                    });
                    time();
                };
                $("#email_but").addClass("disabled");
                function time() {
                    if (wait == 0) {
                        $("#email_but").removeClass("disabled");
                        $("#email_but").text("获取验证码");
                        $("#email_but").attr("disabled",false);
                        wait = 60;
                        return;
                    } else {
                        $("#email_but").text("重新发送"+wait+"s");
                        wait--;
                        setTimeout(function() {
                            time();
                        },1000)
                    };
                };
            });
            //获取验证码进行判断
            $("#yanzhengma").change(function () {
                var yanzhengma=$("#yanzhengma").val();
                //去除空格
                yanzhengma=yanzhengma.trim();
                //集体换成大写
                yanzhengma=yanzhengma.toUpperCase();
                yan=yan.toUpperCase();
                //清除样式
                $("#yanzhengma").parent().removeClass("has-success has-error");
                //判断验证码是否相同
                if(yan !=null){
                    if(yanzhengma==yan){
                        $("#yanzhenma_span").text("");
                        $("#yanzhengma").parent().addClass("has-success");
                        //释放注册按钮
                        $("#add_user_but").removeClass("disabled");
                        $("#add_user_but").attr("disabled",false);

                    }else {
                        $("#yanzhenma_span").css("color","red");
                        $("#yanzhenma_span").text("验证码不正确");
                        $("#yanzhengma").parent().addClass("has-error");
                        $("#add_user_but").addClass("disabled");
                        $("#add_user_but").attr("disabled","disabled");
                    }

                }
            });
        }
    };

    //注册信息
    $("#add_user_but").click(function () {
       // $("#add_user_but").attr("ajax","success");
            var userName=$("#userName").val();
            var passWord=$("#passWord").val();
             passWord=$.md5(passWord);
            var email=$("#email").val();
            $.ajax({
                url:"/hotelonlinereservation/RegistrationController/registrationUser",
                data:{"username":userName,"password":passWord,"eamil":email},
                dataType:"json",
                type:"POST",
                success:function (data) {
                    if(data==true){
                        $("#result").text("注册成功");
                        $("#result").css("color","#00db00");
                        $("#email_but").attr("disabled","disabled");
                        $("#add_user_but").attr("disabled","disabled");
                        //清空验证码
                        yan=null;
                    }
                },
                error:function () {
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
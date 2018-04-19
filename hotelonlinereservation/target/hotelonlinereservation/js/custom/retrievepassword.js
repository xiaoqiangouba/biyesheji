window.onload = function() {
    var yanzhengma;
    //点击QQ
    $("#img_qq").click(function () {
        //弹出模态框
        layer_alert('该功能尚未开通', "warn");
    });
    //点击微信
    $("#img_weixin").click(function () {
        //弹出模态框
        layer_alert('该功能尚未开通', "warn");
    });
    //点击新浪
    $("#img_xinlang").click(function () {
        //弹出模态框
        layer_alert('该功能尚未开通', "warn");
    });
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

    //检验qq邮箱是否正确
    $("#email").change(function() {
        $("#email").parent().removeClass("has-success has-error");
        $("#email_span").text("");
        var email = $(this).val();
        var regEamli = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
        if (!regEamli.test(email)) {
            //邮箱格式不正确
            $(this).parent().addClass("has-error");
            $("#email_span").text("邮箱格式不正确");
            $("#email_span").css("color", "red");
            $("#code").attr("disabled", "disabled");
            $("#email_but").attr("disabled", "disabled");
        } else {
            $.ajax({
                url: "/hotelonlinereservation/RegistrationController/verifyEmail",
                data: "email=" + email,
                dataType: "json",
                type: "POST",
                success: function (data) {
                    if (data != true) {
                        $("#email").parent().addClass("has-success");
                        $("#email_span").text("");
                        $("#code").removeClass("disabled");
                        $("#code").attr("disabled",false);
                        $("#code").attr("attr",true);
                    } else {
                        $("#email").parent().addClass("has-error");
                        $("#email_span").text("此邮箱未注册");
                        $("#email_span").css("color", "red");
                        //关闭获取验证码按钮
                        $("#code").attr("disabled","disabled");
                        $("#email_but").attr("disabled", "disabled");
                        $("#code").attr("attr",false);
                        return false;
                    }

                }
            });
        }
    });

    //发送验证码
    $("#code").click(function () {
        $("#code").attr("disabled","disabled");
        if($(this).attr("attr")=="true"){
            var email=$("#email").val();
            /**
             * 发送邮箱验证
             */
                //设置一分钟
            var wait=60;
            //发送邮件
            if(wait==60){
                $.ajax({
                    url:"/hotelonlinereservation/EmailController/retrieve",
                    type:"POST",
                    data:"email="+email,
                    success:function (data) {
                        yanzhengma=data;
                    },
                    error:function () {
                        layer_alert('网络异常', "warn");
                    },
                });
                time();
            }

            function time() {
                if (wait == 0) {
                    $("#code").removeClass("disabled");
                    $("#code").text("获取验证码");
                    $("#code").attr("disabled",false);
                    wait = 60;
                    return;
                } else {
                    $("#code").text("重新发送"+wait+"s");
                    wait--;
                    setTimeout(function() {
                        time();
                    },1000)
                };
            };
        }else{
            return false;
        }

    });
    //判断验证码
    $("#yanzhengma").change(function () {
        var yan=$("#yanzhengma").val();
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
                //清空验证码
                yan=null;
                //显示密码

                $("#div_password").css('display','block');
                $("#div_password1").css('display','block');
            }else {
                $("#yanzhenma_span").css("color","red");
                $("#yanzhenma_span").text("验证码不正确");
                $("#yanzhengma").parent().addClass("has-error");
                $("#div_password").css('display','none');
                $("#div_password1").css('display','none');
            }

        }
    });

    //判断两次密码是否一致
    $("#passWord").change(function () {
        var password= $("#passWord").val();
        password= $.trim(password);
        var password1= $("#passWord1").val();
        password1= $.trim(password1);
        if(password1==""&&password==""){
            return false;
        }
        $("#passWord").parent().removeClass("has-success has-error");
        $("#passWord1").parent().removeClass("has-success has-error");
        if(password!=password1){
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
            $("#add_user_but").attr("disabled",false);
        }
    });

    $("#passWord1").change(function () {

        var password= $("#passWord").val();
        password= $.trim(password);
        var password1= $("#passWord1").val();
        password1=$.trim(password1);
        if(password1==""&&password==""){
           return false;
        }
        $("#passWord").parent().removeClass("has-success has-error");
        $("#passWord1").parent().removeClass("has-success has-error");
        if(password!=password1){
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
            $("#add_user_but").attr("disabled",false);
        }
    });
    //更改密码
    $("#add_user_but").click(function () {
        var password= $("#passWord1").val();
        password=$.md5(password);
        var email=document.getElementById("email").value;
        $.ajax({
            url:"/hotelonlinereservation/RegistrationController/updataPassword",
            dataType:"json",
            data:{"eamil":email,"password":password},
            type:"POST",
            success:function (data) {
                if(data==1){
                    $("#_span").text("更改成功");
                    $("#_span").css("color","#00db00");
                    $("#add_user_but").attr("disabled","disabled");
                }else{

                }
            },
            error:function () {
                layer_alert('服务器异常', "warn");
            }
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
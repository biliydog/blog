/**
 * Created by Administrator on 2016/9/19.
 */
// *********测试工具函数*********
var log = function () {
    console.log(arguments)
};


var validate = function (s) {
    return s.length > 0;
};

// *******切换登录和注册表单*********
var changeDom = function () {
    var login = $('.login'),
        register = $('.register'),
        registerForm = $('.reg-form'),
        loginForm = $('.login-form'),
        con = $('.container');

    login.bind('click',function () {
        $(this).addClass('s');
        register.removeClass('s');
        registerForm.hide();
        loginForm.show();
        con.css('background', '#ccc4bd')
    });
    register.bind('click',function () {
        $(this).addClass('s');
        login.removeClass('s');
        registerForm.css('display', 'flex');
        loginForm.hide();
        con.css('background','#36B5A9')
    });
};


// *********register成功回调************
var RegSuccess = function (num) {
    log('ajax success!',num);
    var d = $('.message-r');
    var msg = JSON.parse(num);
    log('是否成功返回注册信息：', msg.message);
    d.text(msg.message);
    // 注册成功则跳转页面
    if(msg.message == '注册成功！'){
        var s = 'http://jsonbourne.cc:3000/index';
        log('到这里了');
        window.location.href = s;
    }
};


// *********login成功回调************
var LogSucess = function (a) {
    log('ajax success!',a);
    var d = $('.message-l');
    var msg = JSON.parse(a);
    log('是否成功返回登录信息：', msg.message);
    d.text(msg.message);
    // 登录成功则跳转页面
    if(msg.message == '登录成功！'){
        var s = 'http://jsonbourne.cc:3000/index';
        log('到这里了');
        window.location.href = s;
    }
};


// ************用户登录程序************
var Login = function () {
    var btn = $('.submit-login');
    btn.bind('click', function () {
        log('咋回事？');
        var name = $('#log-username').val();
        var pwd = $('#log-password').val();
        if(validate(name) && validate(pwd)){
            var form = {};
            form.username = name;
            form.password = pwd;
            log('s是否成功生成form:',form.username, form.password);
            var request = {
                url:'/api/login',
                type:'post',
                data:form,
                success:function (data) {
                    LogSucess(data);
                },
                error:function () {
                    alert('ajax fail');
                }
            };
            $.ajax(request);
        }else{
            $('.message-l').text('用户名或密码太短！');
        }
    })
};


// **********用户注册**************
var Register = function () {
    var btn = $('.submit-reg');
    btn.bind('click', function () {
        var NewUserName = $('#reg-username').val();
        var NewPwd = $('#reg-password').val();
        if (validate(NewUserName) && validate(NewPwd)){
            log('s是否成功生成form:',NewUserName, NewPwd);
            var form = {};
            form.username = NewUserName;
            form.password = NewPwd;
            log('s是否成功生成form:',form.username, form.password);
            var request = {
                url:'/register',
                type:'post',
                data:form,
                success:function (data) {
                    RegSuccess(data);
                },
                error:function () {
                    alert('ajax fail');
                }
            };
            $.ajax(request);
        }else{
            $('.message').text('用户名或密码太短！');
        }
    })
};



// ***********document程序************
$(document).ready(function () {
    $('.container').slideDown();
    changeDom();
    Register();
    Login();
});
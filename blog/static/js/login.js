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
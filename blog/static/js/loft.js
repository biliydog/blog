/**
 * Created by Administrator on 2016/9/21.
 */
// ********工具***********
var log = function () {
    console.log(arguments)
};


var validate = function (s) {
    return s.length > 0;
};


// ********显示编辑区域***********
var ShowEditArea = function () {
    var binder = $('.content');
    binder.on('click', '.submit-edit', function (e) {
        var that = $(this);
        var edit = that.parent().parent().next();
        var current = that.parent().prev().find('.loft').text();
        log(current);
        var enter = edit.find('.enter-edit');
        log('???/',enter.attr('class'));
        enter.val(current);
        edit.slideToggle();
    })
};


// *******添加新微博***********
var NewDom = function (a, b, c, d) {
    var s = $(a);
    s.addClass(b);
    s.text(d);
    c.append(s);
    return s
};


var NewPackage = function (msg) {
    var editCSS = "submit-edit my-btn button button-glow button-rounded button-highlight";
    var delCSS ="submit-del my-btn button button-glow button-rounded button-caution";
    var comCSS = "submit-comment button button-glow button-rounded button-highlight";
    var comCss2 = 'submit-com button button-glow button-rounded button-highlight';
    var sendCss = "button button-glow button-border button-rounded button-primary";
    var css = "edit-sub button button-glow button-border button-rounded button-primary"
    var con = $('.content');
    var ThePackage = $('<div></div>');
    ThePackage.addClass('package');
    con.prepend(ThePackage);
    // ***********创建item*********
    var theItem = NewDom('<div></div>', 'item',ThePackage );
    // ***********创建user*********
    NewDom('<h4></h4>', 'user', theItem, msg.user);
    // ***********创建para*********
    var thePara = NewDom('<div></div>', 'para', theItem);
    NewDom('<p></p>', 'loft', thePara, msg.content);
    NewDom('<span></span>', 'loft-id', thePara, msg.id);
    // ***********创bar*********
    var theBar = NewDom('<div></div>', 'bar', theItem );
    NewDom('<a></a>', editCSS, theBar, '编辑');
    NewDom('<a></a>', delCSS, theBar, '删除');
    NewDom('<a></a>', comCss2, theBar, '评论');
    NewDom('<span></span>','time', theBar, msg.time);
    // ***********创建edit*********
    var theEdit = NewDom('<div></div>', 'edit-area',ThePackage);
    NewDom('<input>', 'enter-edit',theEdit);
    NewDom('<button></button>', css,theEdit,'发送');
    //************创建commentlist*****
    var theCmment = NewDom('<ul></ul>','comment-list',ThePackage);
    var theLi = NewDom('<li></li>','com-input',theCmment);
    NewDom('<input>','enter-com',theLi);
    NewDom('<button></button>', comCSS, theLi, '发送评论');
};


var NewLoftSuccess =function (a) {
    log('数据到这里了没？', a);
    var msg = JSON.parse(a);
    log('获得服务器返回的信息了没', msg.user);
    $('#enter-area').val('');
    NewPackage(msg);
};


var AddLoft = function () {
    var btn = $('.submit-loft');
    var form = {};
    btn.bind('click', function () {
        var content = $('#enter-area').val();
        log('拿到content?',content);
        if(validate(content)){
            form.content = content;
            Request('/api/new_loft', NewLoftSuccess,form);
        }
        else {
            $('.enter-message').show();
        }
    })

};


// *******显示所有loft***********
//var showAll= function (a) {
//    var loftList = JSON.parse(a);
//    for (var i=0;i<loftList.length;i++){
//        NewPackage(loftList[i]);
//    }
//};

//
//var All =function () {
//    var form = {};
//    Request('/api/loft',showAll,form);
//};


// ****************评论这一大坨不知道怎么拆**********************
var AddComment = function () {
    var binder = $('.content');
    // *******按下评论按钮做的事***********
    binder.on('click', '.submit-com', function () {
        var that = $(this);
        var comList = that.parent().parent().next().next();
        var li = that.parent().parent().next().next().find('.com-input')
        log('li找对了吗',li.attr('class'));
        comList.slideToggle();
        var exit = comList.find('li');
        if (exit.length <= 2){
            var id = that.parent().prev().find('.loft-id').text();
            log('loft-id:',id);
            var form = {};
            form.id = id;
            log('loft-id:',form.id);
            var request = {
                url: '/api/comment_all',
                type: 'post',
                data: form,
                success: function (data) {
                    var list = JSON.parse(data);
                    for (var i=0;i<list.length;i++){
                        log('评论信息', list[i].user,list[i].content);
                        var newLi = $('<li></li>');
                        log('执行业绩程序了吗')
                        newLi.addClass('bb');
                        li.after(newLi);
                        NewDom('<span></span>', 'comment-user', newLi, list[i].user);
                        NewDom('<span></span>', 'comment-para', newLi, list[i].content);
                        NewDom('<span></span>', 'comment-time', newLi, list[i].time);
                    }
                },
                error: function () {
                    alert('ajax fail');
                }
            };
            $.ajax(request);
        }
    });
    // *******按下发送评论做的事***********
    binder.on('click', '.submit-comment', function () {
        var SendCom = $(this);
        var content = SendCom.prev().val();
        if(validate(content)) {
            var item = SendCom.parent().parent().prev().prev();
            var id = item.find('.loft-id');
            var ComLi = SendCom.parent();
            log('获取到评论内容和id', content, id.text());
            var form = {};
            form.content = content;
            form.loftId = id.text();
            log('form有了吗', form);
            var request = {
                url: '/api/new_comment',
                type: 'post',
                data: form,
                success: function (data) {
                    var com = $('<li></li>');
                    com.addClass('bb');
                    ComLi.after(com);
                    var a = JSON.parse(data);
                    NewDom('<span></span>', 'comment-user', com, a.user);
                    NewDom('<span></span>', 'comment-para', com, a.content);
                    NewDom('<span></span>', 'comment-time', com, a.time);
                },
                error: function () {
                    alert('ajax fail');
                }
            };
            $.ajax(request);
        }
    })
};


// ********ajax***********
var Request = function (link, fn, form) {
    var request = {
        url: link,
        type: 'post',
        data: form,
        success: function (data) {
            fn(data);
        },
        error: function () {
            alert('ajax fail');
        }
    };
    $.ajax(request);
};


// ********再编辑***********
var Edit = function () {
    var binder = $('.content');
    binder.on('click', '.edit-sub', function () {
        var that = $(this);
        var newContent = that.prev().val();
        var id = that.parent().prev().find('.para').find('.loft-id').text();
        log('loft和id', newContent,id);
        var form = {};
        form.new_content = newContent;
        form.id = id;
        Request('/api/edit', fn ,form);
        that.parent().prev().find('.para').find('.loft').text(newContent);
    })
};
var fn = function () {

};


// ********删除***********
var Del = function () {
    var binder = $('.content');
    binder.on('click', '.submit-del', function () {
        var that = $(this);
        var package = that.parent().parent().parent();
        var id = that.parent().prev().find('.loft-id').text();
        log('package和id', package.attr('class'),id);
        var form = {};
        form.id =id;
        Request('/api/delete', fn ,form);
        package.remove();
    })
};

// ********主函数***********
var main =function () {
    AddLoft();
    AddComment();
//    All();
    ShowEditArea();
    Edit();
    Del();
};


// ********页面加载***********
$(document).ready(function () {
    main();
});
var log = function () {
    console.log(arguments)
};


$(function () {
    var editor = new wangEditor('new-text');
    editor.create('div1');
    article(editor);
    Slide();
    Del();
    Edit();
});


var Slide = function (){
    var binder = $('body');
    binder.on('click', '.slide', function(){
        var that = $(this),
            con = that.parent().next();
        if (that.text()=='收起'){
            con.slideUp();
            that.text('展开');
        }else{
            con.slideDown();
            that.text('收起')
        }
    })
};


var currentTime = function () {
    var theDate = new Date(),
        artDate = theDate.toLocaleDateString();
    artDate = artDate +' '+theDate.getHours() +':'+ theDate.getMinutes();
    log(artDate);
    return artDate
};


var article = function (editor) {
    var binder = $('body');
    binder.on('click', '.article-submit', function () {
        var that = $(this),
            articles = that.next(),
            content = editor.$txt.html();
        // 发布文章成功的回调函数
        var newArticleSuccess =function (a) {
            log('是否成功调用了回调');
            var res = JSON.parse(a),
                newArticle = $('<div></div>');
            log('服务器反会了啥',res);
            // 在回调过程中创建新的article板块
            newArticle.addClass('article');
            articles.prepend(newArticle);
            var para = $('<div></div>').append(content);
            var footer= NewDom('<div></div>', '.article-footer', newArticle);
            NewDom('<div></div>', '.article-author', footer,res.user);
            NewDom('<div></div>', '.article-time', footer,res.created_time);
            newArticle.append(para);
        };
        log('编辑器里拿到的东西：', content);
        //如果编辑器里不是空的话，构建请求并发给后端
        if (content !== '<p><br></p>') {
            var req = {};
            req.para = content;
            req.time = currentTime();
            JSON.stringify(req);
            log('请求json化了以后',JSON.stringify(req));
            AjRequest('/api/new_article', newArticleSuccess,req);
        }
    });
};


var Del = function(){
    var binder  = $('body');
    binder.on('click', '.del', function () {
        var that = $(this),
            idDom = that.parent().next().next().text(),
            form = {
                'id':idDom
            }

        var delSuccess = function(a){
            var
                article =that.parent().parent();
            if (a = 'del success'){
                article.remove();
            }
        };
        AjRequest('/api/article_del', delSuccess, form)

    })
};

//
// var Edit = function(){
//     var binder  = $('body');
//     binder.on('click', '.edit', function () {
//         var that = $(this),
//             idDom = that.parent().next().next().text(),
//             form = {
//                 'id':idDom
//             };
//         log('草拟吗拿了操你妈的啥：', idDom)
//         var fn = function(a){
//
//
//         };
//         AjRequest('/api/edit_article', fn, form)
//
//     })
// };


var AjRequest = function (link, fn, form) {
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


var NewDom = function (a, b, c, d) {
    var s = $(a);
    s.addClass(b);
    s.text(d);
    c.append(s);
    return s
};
/**
 * Created by Administrator on 2016/10/11.
 */

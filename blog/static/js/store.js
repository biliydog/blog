var log = function () {
    console.log(arguments)
};


$(function () {
    var editor = new wangEditor('new-text');
    editor.create('div1');
    article(editor);
});


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
            var header= NewDom('<div></div>', '.article-header', newArticle);
            NewDom('<div></div>', '.article-title', header,'查找标题！');
            NewDom('<div></div>', '.article-author', header,res.user);
            NewDom('<div></div>', '.article-time', header,res.created_time);
            var para = $('<div></div>').append(content);
            newArticle.append(para);
            newArticle.prepend(content);
        };
        log('编辑器里拿到的东西：', content);
        //如果编辑器里不是空的话，构建请求并发给后端
        if (content !== '<p><br></p>') {
            var req = {};
            req.para = content;
            req.time = currentTime();
            JSON.stringify(req);
            log('请求json化了以后',JSON.stringify(req));
            AjRequest('/api/new_article', req, newArticleSuccess);
        }
    });
};

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
/**
 * Created by Administrator on 2016/10/11.
 */

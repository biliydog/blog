var log = function () {
    console.log(arguments)
};


$(function () {
    var editor = new wangEditor('editor');
    editor.create();
    edit(editor);
});



var currentTime = function () {
    var theDate = new Date(),
        artDate = theDate.toLocaleDateString();
    artDate = artDate +' '+theDate.getHours() +':'+ theDate.getMinutes();
    log(artDate);
    return artDate
};

var edit = function (editor) {
    var binder = $('body');
    binder.on('click', '.edited', function () {
        var id= $('.id').text(),
            content = editor.$txt.html();
        // 发布文章成功的回调函数
        var EditSuccess =function (a) {
            if (a==='edit success'){
                window.location.href='http://jsonbourne.cc:3000/store'
            }
        };
        log('编辑器里拿到的东西：', content);
        //如果编辑器里不是空的话，构建请求并发给后端
        if (content !== '<p><br></p>') {
            var req = {};
            req.para = content;
            req.time = currentTime();
            req.id = id;
            JSON.stringify(req);
            log('请求json化了以后',JSON.stringify(req));
            AjRequest('/api/edit_article', EditSuccess,req);
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
 * Created by Administrator on 2016/10/15.
 */

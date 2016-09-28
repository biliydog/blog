/**
 * Created by Administrator on 2016/9/20.
 */
var ShowDom = function (a,b) {
    a.bind('click', function () {
        b.slideToggle();
    })
};


var More = function () {
    var one = $('.btn1');
    var oneDown = $('.down1');
    ShowDom(one,oneDown);
    var two = $('.btn2');
    var twoDown = $('.down2');
    ShowDom(two,twoDown);
    var three = $('.btn3');
    var threeDown = $('.down3');
    ShowDom(three,threeDown);

};



$(document).ready(function () {
    More();
    GoLoft();
});
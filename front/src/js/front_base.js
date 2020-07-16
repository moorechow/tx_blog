function FrontBase() {
    
}

FrontBase.prototype.run = function(){
    var self = this;
    self.listenAuthBoxHover();
};

FrontBase.prototype.listenAuthBoxHover = function () {
    var self = this;
    var authBox = $(".auth-box");
    var userMoreBox = $(".user-more-box");
    authBox.hover(function () {
        userMoreBox.show();
    },function () {
        userMoreBox.hide();
    });
};

$(function () {
    var frontBase = new FrontBase();
    frontBase.run();
});
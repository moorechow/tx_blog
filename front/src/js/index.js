// 面向对象
// 1、添加属性，通过this关键字绑定属性，并指定值
// 原型链
// 2、添加方法
// 在Banner.prototype上绑定方法就可以

// function Banner() {
//     // 这里所有的方法相当于python中的__init__方法的代码
//     console.log('构造函数');
//     this.person = '天信'
// }
//
// // 原型链
// Banner.prototype.greet = function (word) {
//     console.log('hello world',word)
// }

// var banner = new Banner();
// console.log(banner.person);
// banner.greet('zhoumo');

function Banner() {
    this.bannerWidth = 798;
    this.bannerGroup = $("#banner-group");
    this.index = 1;
    this.leftArrow = $(".left-arrow");
    this.rightArrow = $(".right-arrow");
    this.bannerUl = $("#banner-ul");
    this.liList = this.bannerUl.children("li");
    this.bannerCount = this.liList.length;
    this.pageControl = $(".page-control");
}

// 初始化banner（滑动窗口）的尺寸，还要把首图clone到最后，把尾图克隆到开始
Banner.prototype.initBanner = function () {
    var self = this;
    var firstBanner = self.liList.eq(0).clone();
    var lastBanner = self.liList.eq(self.bannerCount-1).clone();
    self.bannerUl.append(firstBanner);
    self.bannerUl.prepend(lastBanner);
    self.bannerUl.css({"width":self.bannerWidth*(self.bannerCount+2),'left':-self.bannerWidth});
};

// 初始化banner下方的几个小圆点
Banner.prototype.initPageControl = function(){
    var self = this;
    for (var i = 0; i < self.bannerCount; i++){
        var circle = $("<li></li>");
        self.pageControl.append(circle);
        if(i === 0){
            circle.addClass("active");
        }
    }
    self.pageControl.css({"width": 12*self.bannerCount+16*(self.bannerCount-1)+2*8});
};

// 设置左右两个箭头是出现还是隐藏
Banner.prototype.toggleArrow = function(isShow){
    var self = this;
    if(isShow){
        var self = this;
        self.leftArrow.show();
        self.rightArrow.show();
    }else{
        self.leftArrow.hide();
        self.rightArrow.hide();
    }
};

// 监听滑动窗是否有鼠标放上来，放上来就显示左右两个箭头
Banner.prototype.listenBannerHover = function(){
    var self = this;
    this.bannerGroup.hover(function () {
        // 鼠标放上来
        clearInterval(self.timer);
        self.toggleArrow(true);
    },function () {
        // 鼠标离开
        self.loop();
        self.toggleArrow(false);
    })
};

// 实现滑动动作animate把。。做成动画，使生机勃勃
Banner.prototype.animate = function(){
    var self = this;
    var index = self.index;
    self.bannerUl.animate({"left":-798*index},500);
    if(index === 0){
        index = self.bannerCount - 1;
    }else if(index === self.bannerCount + 1){
        index = 0;
    }else{
        index = self.index - 1;
    }
    self.pageControl.children('li').eq(index).addClass("active").siblings().removeClass("active");
};

// 滑动窗循环计数
Banner.prototype.loop = function(){
    var self = this;
    // bannerUI.css({"left":-798});  会跳变无动画效果
    this.timer = setInterval(function () {
        if (self.index >= self.bannerCount + 1){
            self.bannerUl.css({"left":-self.bannerWidth});
            self.index = 2;
        }
        else{
            self.index += 1;
        }
        self.animate();
    },2000)
};

// 滑动窗左右箭头的监听
Banner.prototype.listenArrowClick = function(){
    var self = this;
    self.leftArrow.click(function () {
        if(self.index === 0){
            // == number和char只要相同，都可以成立
            // === number和char不能相等
            self.bannerUl.css({"left":-self.bannerWidth*self.bannerCount});
            self.index = self.bannerCount - 1;
        }else{
            self.index--;
        }
        self.animate();
    });

    self.rightArrow.click(function () {
        if(self.index === self.bannerCount + 1){
            self.bannerUl.css({"left":-self.bannerWidth});
            self.index = 2;
        }else{
            self.index++;
        }
        self.animate();
    });
};

// 监听滑动窗的下面小点点点击事件
Banner.prototype.listenPageControl = function(){
    var self = this;
    self.pageControl.children("li").each(function (index,obj) {
        $(obj).click(function () {
            console.log("index:",index);
            self.index = index + 1;
            self.animate();
        });
    });
};

Banner.prototype.run = function () {
    console.log("running...");
    this.initBanner();
    this.initPageControl();
    this.loop();
    this.listenArrowClick();
    this.listenPageControl();
    this.listenBannerHover();
};

// $ jquery 定义的，万能函数，元素选择时也是用这个,$()里的函数，jquery保证它必须在整个页面加载完毕后才执行
$(function(){
    var banner = new Banner();
    banner.run();
});

// 点击登录按钮，弹出模态对话框
//
function Auth() {
    var self = this;
    self.maskWrapper = $(".mask-wrapper");
    self.scrollWrapper = $(".scroll-wrapper");
};

Auth.prototype.run = function () {
    var self = this;
    self.ListenShowHideEvent();
    self.listenSwitchEvent();
    self.listenSigninEvent();
};

Auth.prototype.ShowEvent = function(){
    var self = this;
    self.maskWrapper.show();
};

Auth.prototype.HideEvent = function(){
    var self = this;
    self.maskWrapper.hide();
};

Auth.prototype.ListenShowHideEvent = function(){
    var self = this;
    var signinBtn = $('.signin-btn');
    var signupBtn = $('.signup-btn');
    var closeBtn = $('.close-btn');
    var scrollWrapper = $('.scroll-wrapper');

    signinBtn.click(function () {
         self.ShowEvent();
         scrollWrapper.css({"left":0});
    });
    signupBtn.click(function () {
        self.ShowEvent();
        scrollWrapper.css({"left":-400});
    });
    closeBtn.click(function () {
        self.HideEvent();
    })
};

Auth.prototype.listenSwitchEvent = function(){
    var self = this;
    var Switcher = $('.switch');
    Switcher.click(function () {
        var currentLeft = self.scrollWrapper.css("left");
        currentLeft = parseInt(currentLeft);
        if(currentLeft < 0){
            self.scrollWrapper.animate({"left":'0'});
        }else{
            self.scrollWrapper.animate({"left":"-400px"});
        }
    })
};

Auth.prototype.listenSigninEvent = function(){
    var self =this;
    var signinGroup = $('.signin-group');
    var telephoneInput = signinGroup.find("input[name='telephone']");
    var passwordInput = signinGroup.find("input[name='password']");
    var rememberInput = signinGroup.find("input[name='remember']");

    var submitBtn = signinGroup.find(".submit-btn");

    submitBtn.click(function () {
        var teleph = telephoneInput.val();
        var passwd = passwordInput.val();
        var rememb = rememberInput.prop("checked");
        // 处于某种我暂时不知道的原因，直接调用其他文件定义的全局变量无法成功，
        // 一直报找不到或者没定义，只好采取比较傻的办法，利用window来传递
        window.txajax.post({
            'url':'account/login/',
            'data':{
                'telephone':teleph,
                'password':passwd,
                'remember':rememb?1:0,
            },
            'success':function (result) {
                if(result['code'] == 200){
                    self.HideEvent();
                    window.location.reload();
                }else{
                    var messageObject = result['message'];
                    if(typeof messageObject == 'string' || messageObject.constructor == String){
                        console.log(messageObject);
                        window.messageBox.show(messageObject);
                    }else{
                        // {"passwrd":['密码过长'，'密码果断'],"telephone":['xx','xxxx']}
                        for(var key in messageObject){
                            var messages = messageObject[key];
                            var message = messages[0];
                            //console.log(message);
                            window.messageBox.show(message);
                        }
                    }
                }
            },
            'fail':function (error) {
                console.log(error)
            }
        });
    });
};

//window.auth = new Auth();
//exports.Auth = Auth;
$(function () {
    // 此处必须延迟执行，否则与index.js中的run会覆盖，如果避免覆盖，我尝试了很多办法，
    // 要不然延迟，要不然用一个复杂机制安排页面中所有的js文件调用顺序
    // 如果想要通过文件互相包含则完全没效果，不知道为什么？
    var auth = new Auth();
    setTimeout(function () {
        // 这里就是处理的事件
        auth.run();
    }, 50);
});

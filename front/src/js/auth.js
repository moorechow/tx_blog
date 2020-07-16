// 点击登录按钮，弹出模态对话框
//
function Auth() {
    var self = this;
    self.maskWrapper = $(".mask-wrapper");
    self.scrollWrapper = $(".scroll-wrapper");
    self.smsCaptcha = $(".sms-captcha-btn");
    self.telephoneInput = $(".signup-group input[name='telephone']");
};

Auth.prototype.run = function () {
    var self = this;
    self.ListenShowHideEvent();
    self.listenSwitchEvent();
    self.listenSigninEvent();
    self.listenImgCaptchaEvent();
    self.listenSmsCaptchaEvent();
    self.listenSignupEvent();
};

Auth.prototype.ShowEvent = function(){
    var self = this;
    self.maskWrapper.show();
};

Auth.prototype.HideEvent = function(){
    var self = this;
    self.maskWrapper.hide();
};

Auth.prototype.smsSuccessEvent = function(){
    var self = this;
    messageBox.showSuccess('短信验证码发送成功！');
    self.smsCaptcha.addClass('disabled');
    var count = 60;
    self.smsCaptcha.unbind('click');
    var timer = setInterval(function () {
        self.smsCaptcha.text(count+'s');
        count -= 1;
        if(count <= 0){
            clearInterval(timer);
            self.smsCaptcha.removeClass('disable');
            self.smsCaptcha.text('发送验证码');
            self.listenSmsCaptchaEvent();
        }
    },1000)
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

Auth.prototype.listenSignupEvent = function(){
    var signupGroup = $('.signup-group');
    var submitBtn = signupGroup.find('.submit-btn');
    submitBtn.click(function (event) {
        event.preventDefault(); // 组织提交默认表单的行为
        var telephoneInput = signupGroup.find("input[name='telephone']");
        var usernameInput = signupGroup.find("input[name='username']");
        var imgCaptchaInput = signupGroup.find("input[name='img_captcha']");
        var password1Input = signupGroup.find("input[name='password1']");
        var password2Input = signupGroup.find("input[name='password2']");
        var smsCaptchaInput = signupGroup.find("input[name='sms_captcha']");

        var telephone = telephoneInput.val();
        var username = usernameInput.val();
        var img_captcha = imgCaptchaInput.val();
        var password1 = password1Input.val();
        var password2 = password2Input.val();
        var sms_captcha = smsCaptchaInput.val();

        txajax.post({
            'url': '/account/register/',
            'data': {
                'telephone': telephone,
                'username': username,
                'img_captcha': img_captcha,
                'password1': password1,
                'password2': password2,
                'sms_captcha': sms_captcha
            },
            'success': function (result) {
                if(result['code'] == 200):{
                    window.location.reload();
                }else{

                }

            }
            'fail':function (error) {
                window.messageBox.showError('服务器内部错误！');
            },
        });
    });

};

Auth.prototype.listenSmsCaptchaEvent = function () {
    var self = this;
    self.smsCaptcha.click(function () {
        var telephone = self.telephoneInput.val();
        console.log("telephone Num:");
        console.log(telephone);
        if(!telephone){
            messageBox.showInfo("请输入手机号码")
        }

        txajax.get({
            'url':'/account/sms_captcha/',
            'data':{
                'telephone':telephone
            },
            'success':function (result) {
                if(result['code'] == 200){
                    self.smsSuccessEvent();
                }
            },
            'fail':function (error) {
                console.log(error);
            },
        });
    });
};

//
// 用来处理导航条
//
function FrontBsae() {

}

FrontBsae.prototype.run = function(){
    var self = this;
    self.listenAuthBoxHover();
};

FrontBsae.prototype.listenAuthBoxHover = function () {
    var self = this;
    var authBox = $(".auth-box");
    var userMoreBox = $(".user-more-box");
    authBox.hover(function () {
        userMoreBox.show();
    },function () {
        userMoreBox.hide();
    });
};

Auth.prototype.listenImgCaptchaEvent = function(){
    var imgCaptcha = $('.img-captcha');
    imgCaptcha.click(function () {
        imgCaptcha.attr("src","/account/img_captcha/"+"?random="+Math.random())
    })
};


$(function () {
    // 此处必须延迟执行，否则与index.js中的run会覆盖，如果避免覆盖，我尝试了很多办法，
    // 要不然延迟，要不然用一个复杂机制安排页面中所有的js文件调用顺序
    // 如果想要通过文件互相包含则完全没效果，不知道为什么？
    var auth = new Auth();
    var frontBase = new FrontBsae();

    setTimeout(function () {
        // 这里就是处理的事件
        auth.run();
        frontBase.run();
    }, 50);
});



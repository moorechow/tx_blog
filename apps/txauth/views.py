from django.shortcuts import render,redirect,reverse
from django.contrib.auth import login,logout,authenticate
from django.views.decorators.http import require_POST
from .forms import LoginForm,RegisterForm
from django.http import JsonResponse
from utils import restful
from utils.captcha.txcaptcha import Captcha
from utils.aliyunsdk import aliyunsms
from io import BytesIO
from django.http import HttpResponse
from django.core.cache import cache
from django.contrib.auth import get_user_model

User = get_user_model()

# json的格式
# {"code":200, 300，404，500……
# "message":"具体情况是啥"
# "data":{"username"……等等需要带回去的信息 }}
@require_POST
def tx_login(request):
    form = LoginForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        password = form.cleaned_data.get('password')
        remember = form.cleaned_data.get('remember')
        user = authenticate(request, username=telephone, password=password)
        # print('user:%s' % user)

        if user:
            if user.is_active:
                login(request,user)
                if remember:
                    request.session.set_expiry(None)
                else:
                    request.session.set_expiry(0)
                return restful.ok()
                    # JsonResponse({"code":200,"message":"","data":{}})
            else:
                return restful.unauth_error(message="您帐号没有权限访问！")
        else:
            return restful.params_error(message="您帐号或密码错误！")
    else:
        # 表单验证失败
        errors = form.get_error()
        # {"passwrd":['密码过长'，'密码果断'],"telephone":['xx','xxxx']}
        return restful.params_error(message=errors)

def tx_logout(request):
    logout(request)
    return redirect(reverse('index'))

@require_POST
def register(request):
    form = RegisterForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password')
        user = User.objects.create_user(telephone=telephone,username=username,password=password)
        login(request,user)
        return restful.ok()
    else:
        return restful.params_error(message=form.get_error())

def img_captcha(request):
    text,image = Captcha.gene_code()
    out = BytesIO()
    image.save(out,'png')
    # BytesIO用一个管道用来存储图片数据流，调用image的save将生成的数据流保存在png文件中，
    # 但是保存完，文件指针指向文件结束为，需要重新复位
    out.seek(0)

    response = HttpResponse(content_type='image/png')
    # 从BytesIO的管道中读取图片数据，保存到response的对象上
    response.write(out.read())
    response['Content-length'] = out.tell()

    # 验证码存在memcache中，全部转成小写
    cache.set(text.lower(),text.lower(),5*60)

    return response

def sms_captcha(request):
    # /sms_captcha/?telephone=XXX
    telephone = request.GET.get('telephone')
    code = Captcha.gene_text()
    cache.set(telephone,code,5*60)
    result = aliyunsms.send_sms(telephone,code)
    return restful.ok()

# def cache_test(request):
#     cache.set('username','zhoumo',60)
#     result = cache.get('username')
#     print(result)
#     return HttpResponse('success')

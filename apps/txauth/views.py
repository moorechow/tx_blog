from django.shortcuts import render
from django.contrib.auth import login,logout,authenticate
from django.views.decorators.http import require_POST
from .forms import LoginForm
from django.http import JsonResponse
from utils import restful

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
                return restful.result()
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


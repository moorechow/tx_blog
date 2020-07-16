# -*- coding:utf-8 -*-
#@Time : 2020-07-09 14:51
#@Author: Moore Chow
#@File : urls.py

from django.urls import path
from . import views

app_name = 'txauth'

urlpatterns = [
    path('login/', views.tx_login, name='login'),
    path('logout/', views.tx_logout, name='logout'),
    path('img_captcha/', views.img_captcha, name='img_captcha'),
    path('sms_captcha/', views.sms_captcha, name='sms_captcha'),
    path('register/', views.register, name='register'),
    # path('cache/', views.cache_test, name='cache'),
]

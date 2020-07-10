# -*- coding:utf-8 -*-
#@Time : 2020-07-09 14:51
#@Author: Moore Chow
#@File : urls.py

from django.urls import path
from . import views

app_name = 'txauth'

urlpatterns = [
    path('login/', views.tx_login, name='login'),
]

# -*- coding:utf-8 -*-
#@Time : 2020-07-10 15:45
#@Author: Moore Chow
#@File : urls.py

from django.urls import path
from . import views

app_name = 'payinfo'

urlpatterns = [
    path('', views.payinfo, name='payinfo'),
]

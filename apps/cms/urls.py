# -*- coding:utf-8 -*-
#@Time : 2020-07-07 17:11
#@Author: Moore Chow
#@File : urls.py

from django.urls import path
from . import views

app_name = 'cms'

urlpatterns = [
    path('login/', views.cms_login, name='cms_login'),
]

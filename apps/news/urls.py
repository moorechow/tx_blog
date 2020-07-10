# -*- coding:utf-8 -*-
#@Time : 2020-07-07 17:11
#@Author: Moore Chow
#@File : urls.py

from django.urls import path
from . import views

app_name = 'news'

urlpatterns = [
    path('', views.index, name='index'),
    path('<int:news_id>/',views.new_detail,name='news_detail'),
]

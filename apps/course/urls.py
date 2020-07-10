# -*- coding:utf-8 -*-
#@Time : 2020-07-10 15:20
#@Author: Moore Chow
#@File : urls.py
from django.urls import path
from . import views

app_name = 'course'

urlpatterns = [
    path('', views.course_index, name='course_index'),
    path('<int:course_id>/',views.course_detail,name='course_detail'),
]

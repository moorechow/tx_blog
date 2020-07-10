from django.shortcuts import render

# Create your views here.
def cms_login(request):
    return render(request,'cms/login.html')





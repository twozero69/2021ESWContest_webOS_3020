from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
@csrf_exempt
def face_recognition(request):
    if request.method == "POST":
        #사이즈가 68인 배열 / 내부는 id(0~67), x, y를 키값으로 가지는 딕셔너리
        landmark = JSONParser().parse(request)

        ########################################
        #여기에 코딩
        print(landmark)
        ########################################

        
        #결과 반환
        return JsonResponse({
            "returnValue": False,
            "userdata": None
        })
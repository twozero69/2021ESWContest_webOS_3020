from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt

import base64
import cv2
import numpy as np
import matplotlib.pyplot as plt



# Create your views here.
@csrf_exempt
def get_vector(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        base64Data = data["base64"].split(",")[1]
        byteData = base64.b64decode(base64Data)
        arrData = np.frombuffer(byteData, np.uint8)

        #bgr_img, landmark
        bgr_img = cv2.imdecode(arrData, flags=cv2.IMREAD_COLOR)
        landmark = data["landmark"]
        ########################################
        #여기에서 landmark -> vector로 변환


        vector = "계산 후 저장"
        ########################################

        #변환 결과를 반환
        return JsonResponse({
            "vector": vector
        })


@csrf_exempt
def face_recognition(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        base64Data = data["base64"].split(",")[1]
        byteData = base64.b64decode(base64Data)
        arrData = np.frombuffer(byteData, np.uint8)

        #bgr_img, landmark
        bgr_img = cv2.imdecode(arrData, flags=cv2.IMREAD_COLOR)
        landmark = data["landmark"]

        ########################################
        #여기에 얼굴인식 코딩

        ########################################

        #인식결과 반환
        return JsonResponse({
            "returnValue": False,
            "userdata": None
        })
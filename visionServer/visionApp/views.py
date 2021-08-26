from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt


import base64
import cv2
import dlib
import numpy as np


# ML models
facerec = dlib.face_recognition_model_v1("models/dlib_face_recognition_resnet_model_v1.dat")


# utility methods
def points_to_dlib(points):
    dlib_points = dlib.points()
    for point in points:
        dlib_points.append(dlib.point(x=int(point["x"]), y=int(point["y"])))

    return dlib_points


def face_info_to_dlib(face_info):
    left = face_info['x']
    top = face_info['y']
    right = face_info['x']+face_info['width']
    bottom = face_info['y']+face_info['height']
    return dlib.rectangle(left, top, right, bottom)


def landmark_to_dlib(landmark, face_info):
    dlib_face_rect = face_info_to_dlib(face_info)
    dlib_landmark = points_to_dlib(landmark)
    return dlib.full_object_detection(dlib_face_rect, dlib_landmark)


def dlib_vector_to_list(dlib_vector):
    list=[]
    for i in range(0, 128):
        list.append(dlib_vector[i])
    return list


# Create your views here.
@csrf_exempt
def get_vector(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        base64Data = data["base64"].split(",")[1]
        byteData = base64.b64decode(base64Data)
        arrData = np.frombuffer(byteData, np.uint8)

        #bgr_img, face_info, landmark
        bgr_img = cv2.imdecode(arrData, flags=cv2.IMREAD_COLOR)
        face_info = data["faceInfo"]
        landmark = data["landmark"]

        #face vector 계산
        shape = landmark_to_dlib(landmark, face_info)
        dlib_vector = facerec.compute_face_descriptor(bgr_img, shape)
        vector = dlib_vector_to_list(dlib_vector)

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
        
        #bgr_img, face_info, landmark
        bgr_img = cv2.imdecode(arrData, flags=cv2.IMREAD_COLOR)
        face_info = data["faceInfo"]
        landmark = data["landmark"]

        #face vector 계산
        shape = landmark_to_dlib(landmark, face_info)
        dlib_vector = facerec.compute_face_descriptor(bgr_img, shape)
        vector = dlib_vector_to_list(dlib_vector)
        ########################################
        #여기에서 vector랑 firebase storage와 비교코딩

        ########################################

        #인식결과 반환
        return JsonResponse({
            "returnValue": False,
            "userdata": None
        })
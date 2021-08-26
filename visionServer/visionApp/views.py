from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt


import base64
import cv2
import dlib
import numpy as np
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


# ML models
facerec = dlib.face_recognition_model_v1("models/dlib_face_recognition_resnet_model_v1.dat")


#firebase instance
cred = credentials.Certificate('admin/firebase-adminsdk.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
users_ref = db.collection(u'users')


# utility methods
def base64_to_img(base64Data):
    byteData = base64.b64decode(base64Data)
    arrData = np.frombuffer(byteData, np.uint8)
    return cv2.imdecode(arrData, flags=cv2.IMREAD_COLOR)


def points_to_dlib(points):
    dlib_points = dlib.points()
    for point in points:
        dlib_points.append(dlib.point(x=int(point["x"]), y=int(point["y"])))

    return dlib_points


def face_info_to_dlib(face_info):
    left = face_info['x']
    top = face_info['y']
    right = face_info['x'] + face_info['width']
    bottom = face_info['y'] + face_info['height']
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

        #bgr_img, face_info, landmark
        bgr_img = base64_to_img(base64Data)
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
        
        #bgr_img, face_info, landmark
        bgr_img = bgr_img = base64_to_img(base64Data)
        face_info = data["faceInfo"]
        landmark = data["landmark"]

        #face vector 계산
        shape = landmark_to_dlib(landmark, face_info)
        dlib_vector = facerec.compute_face_descriptor(bgr_img, shape)
        vector = dlib_vector_to_list(dlib_vector)

        #firebase firestore의 사용자 얼굴정보와 비교
        return_value = False
        userdata = None
        minDist = 0.3

        docs = users_ref.stream()
        for doc in docs:
            data = doc.to_dict()
            dist = np.linalg.norm(np.array(data['vector'])-np.array(vector), axis=0)
            if dist < minDist:
                minDist = dist
                userdata = data
                return_value = True
            
            print(data['name'], dist)

        #인식결과 반환
        return JsonResponse({
            "returnValue": return_value,
            "userdata": userdata
        })
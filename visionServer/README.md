
# visionServer

외부 PC에서 실행되는 얼굴인식용 서버

# 패키지설치

#### `pip install -r requirements.txt`

# .env 작성

.env.example파일을 참고하여 .env파일 생성

# 실행(python3)
### local에서 실행:
#### `python manage.py runserver` 
### 외부접속 허용:
#### `python manage.py runserver 0.0.0.0:<PORT>`

# API1

### HTTP:

#### `'POST' http://<IP>:<PORT>/vision/face/v1/vector`

### Description:

첨부된 이미지의 얼굴에 대한 벡터값을 반환

### Request:

```
{
    base64: base64 image string, //얼굴이 촬영된 사진
    faceInfo: { //사진에서 얼굴의 위치
        x: 126,
        y: 198,
        width: 121,
        height: 215
    }
}
```

### Response:

```
{
    vector: face vector //얼굴에 대한 벡터
}
```

# API2

### HTTP:

#### `'POST' http://<IP>:<PORT>/vision/face/v1/recognition`

### Description:

첨부된 이미지와 얼굴에서 firebase firestore에 저장된 유저정보와 일치하는지 확인하고 그 결과를 반환.

### Request:

```
{
    base64: base64 image string, //얼굴이 촬영된 사진
    faceInfo: { //사진에서 얼굴의 위치
        x: 126,
        y: 198,
        width: 121,
        height: 215
    }
}
```

### Response:

```
{
    returnValue: True, //얼굴인식 결과(성공: True, 실패: False)
    userdata: firebase_userdata //firebase에서 읽어온 얼굴 주인의 유저데이터(returnValue가 False인 경우 None)
}
```
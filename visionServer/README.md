
## visionServer

외부 PC에서 실행되는 얼굴인식용 서버

## 패키지설치

#### `pip install -r requirements.txt`

## .env 작성

.env.example파일을 참고하여 .env파일 생성

## 실행(python3)
### local에서 실행:
#### `python manage.py runserver` 
### 외부접속 허용:
#### `python manage.py runserver 0.0.0.0:<PORT>`

## API

### HTTP:

#### `'POST' http://<IP>:<PORT>/vision/face/v1/recognition`

### Description:

firebase firestore에서 얼굴의 주인을 찾아 그 결과를 반환.

### Request:

```

[

//얼굴의 68개 랜드마크

{

id: 0,

x: -3.95343017578125,

y: 62.41119384765625

},

...

]

```

### Response:

```

{

returnValue: True, //얼굴인식 결과

userdata: firebase_userdata //firebase에서 읽어온 얼굴 주인의 유저데이터

}

```
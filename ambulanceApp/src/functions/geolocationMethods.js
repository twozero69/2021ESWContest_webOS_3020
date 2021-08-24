const getGeolocation = async () => {
    if(window.navigator.geolocation){
        return "여기에 Promise 작성"
    }
    else{
        console.log("error: can't use navigator");
    }
}

export {getGeolocation};
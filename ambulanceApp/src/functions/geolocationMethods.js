const getGeolocation = () => {
    return new Promise((resolve, reject) => {
        window.navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};

export {getGeolocation};
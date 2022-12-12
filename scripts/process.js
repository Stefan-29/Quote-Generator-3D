const readJson = (jsonFileName, callback) => {
    const httpRequest = new XMLHttpRequest();
    httpRequest.overrideMimeType("application/json");
    httpRequest.open("GET", jsonFileName, true);
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == "200") {
            callback(httpRequest.responseText);
        }
    };
    httpRequest.send(null);

}
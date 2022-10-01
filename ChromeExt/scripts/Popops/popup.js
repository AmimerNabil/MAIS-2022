
console.log("popup got started...")

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
    if(request.subject === "python_to_popup"){
        chrome.action.openPopup();
        document.getElementById("text").innerText = request.python_response;
        sendResponse(true);
    }
    sendResponse(false);
})
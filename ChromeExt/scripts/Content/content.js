console.log("smartTracker is active...")

// onMessage Listeners
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.method === 'get-highlighted-word') {
        let highlighted = window.getSelection().toString()
        if (highlighted && highlighted.length > 0) {
            // getting the DOM parent element
            parent_element = document.getSelection().anchorNode.parentNode;

            let response = {
                status: "OK",
                text: highlighted,
                parent_element_text: parent_element.textContent 
            }

            sendResponse(response);

        } else {
            let response = {
                status: "No Content",
                text: "~~~empt¡™¡y string~~~"
            }
            sendResponse(response);
        }
    }

    if(request.method === "openPopup"){
        console.log(await getStorageValuePromise("python_response"))
        createModal();
    }

    return true;
});

// helper methods

// getting value from storage async
function getStorageValuePromise(key){
    return new Promise((resolve) => {
        chrome.storage.sync.get(key, resolve);
    })
}







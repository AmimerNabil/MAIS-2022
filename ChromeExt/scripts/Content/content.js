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

        document.body.onload = createModal;
        function createModal() {
            const mainDiv = document.createElement("div");
            mainDiv.setAttribute("id", "main");
            mainDiv.innerHTML = `
            <button type="button" class="collapsible" id="button1">Definition/Example</button>
            <div class="content" id="tab1">
                <div id="first">
                    <h5 id="word">Word:</h5>
                    <h5 id="type">Type:</h5>
                </div>
                <p id="definition">Definition:</p>
                <p id="example">Example:</p>
            </div>
            
            <button type="button" class="collapsible" id="button2">Synonyms/Antonyms</button>
            <div class="content" id="tab2">
                <p id="synonyms">Synonyms:</p>
                <p id="antonyms">Antonyms:</p>
            </div>

            <button type="button" class="collapsible" id="button3">Relevant links</button>
            <div class="content" id="tab3">
                 <p id="links">Links:</p>
            </div>
            `;
            document.body.appendChild(mainDiv);
        }

        //function to drop down tabs
        var coll = document.getElementsByClassName("collapsible");
        var i;
        
        for (i = 0; i < coll.length; i++) {
          coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
              content.style.display = "none";
            } else {
              content.style.display = "block";
            }
          });
        }
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







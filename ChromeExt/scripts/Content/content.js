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
                text: "~~~empty string~~~"
            }
            sendResponse(response);
        }
    }

    if(request.method === "openPopup"){
        console.log("hello world")
        
        python_response = (await getStorageValuePromise("python_response"))["python_response"];
        console.log(python_response);
        word = await getStorageValuePromise("word");
        console.log(word);
        createModal()
        document.body.onload = createModal;
        function createModal() {
            let mainDiv = ""
            if (!document.getElementById("wordBay-main")) {
                mainDiv = document.createElement("div");
                mainDiv.setAttribute("id", "wordBay-main");
            }else {
                mainDiv = document.getElementById("wordBay-main");
            }
            mainDiv.innerHTML = `
            <div id="wordBay-header">
                <div id="wordBay-name">wordBay</div>
                <div id="wordBay-header-button-container">
                    <button id="wordBay-close">&times;</button>
                </div>
            </div>
            <button type="button" class="wordBay-collapsible" id="button1">Definition and Examples</button>
            <div class="wordBay-content" id="wordBay-tab1">
                <div id="wordBay-first">
                    <h5 id="wordBay-word">${word.word}</h5>
                    <h5 id="wordBay-type">[${python_response["POS"]}]</h5>
                </div>
                <p id="definition">Definition: ${python_response["best_def"]}</p>
                <p id="example">Example:</p>
            </div>
            
            <button type="button" class="wordBay-collapsible" id="button2">Synonyms and Antonyms</button>
            <div class="wordBay-content" id="wordBay-tab2">
                <p id="synonyms">Synonyms:hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh</p>
                <p id="antonyms">Antonyms:</p>
            </div>

            <button type="button" class="wordBay-collapsible" id="button3">Relevant Links</button>
            <div class="wordBay-content" id="wordBay-tab3">
                 <p id="links">Links:</p>
            </div>
            `;
            document.body.appendChild(mainDiv);
            document.getElementById("wordBay-close").addEventListener('click' , () => {
                let element = document.getElementById("wordBay-main");
                element.remove(); 
            })        
        }

        //function to drop down tabs
        var coll = document.getElementsByClassName("wordBay-collapsible");
        var i;
        
        for (i = 0; i < coll.length; i++) {
          coll[i].addEventListener("click", function() {
            this.classList.toggle("wordBay-active");
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
        chrome.storage.local.get(key, resolve);
    })
}





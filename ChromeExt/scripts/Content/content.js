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
        word = (await getStorageValuePromise("word"))["word"];
        word = capitalizeFirstLetter(word);

        let examples = []
        let synonyms = []

        let approvedWordAPI = python_response["approvedWordAPI"]
        console.log(approvedWordAPI)
        for (let i = 0; i < approvedWordAPI.length; i++){
            console.log(approvedWordAPI[i]);
            let def = approvedWordAPI[i]["def"]

            if(def.examples){
                for(let i = 0; i < def["examples"].length; i++){
                    if(def["examples"].length > 5) break;
                    examples.push(def["examples"][i])
                }
            }
            
            if(def.synonyms){
                for(let i = 0; i < def["synonyms"].length; i++){
                    if(def["synonyms"].length > 10) break;
                    synonyms.push(def["synonyms"][i]);
                }
            }
        }

        console.log(examples)
        console.log(synonyms)

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
                <div id="wordBay-name">WordBay</div>
                <div id="wordBay-header-button-container">
                    <button id="wordBay-close">Close</button>
                </div>
            </div>
            <button type="button" class="wordBay-collapsible" id="button1">Definition</button>
            <div class="wordBay-content" id="wordBay-tab1">
                <div id="wordBay-first">
                    <h4 id="wordBay-word"><span id="wordBay-word-def">${word}</span> , [${python_response["POS"]}]</h4>
                    <p id="wordBay-definition">${python_response["best_def"]}</p>
                </div>
            </div>
            <button type="button" class="wordBay-collapsible" id="button2">Examples and Synonyms</button>
            <div class="wordBay-content" id="wordBay-tab2">
                <div id="wordBay-example-container"> 
                    <h5 id="example">Examples:</h5>
                </div>
                <div id="wordBay-synonyms-container"> 
                    <h5 id="synonyms">Synonyms:</h5>
                </div>
            </div>

            <button type="button" class="wordBay-collapsible" id="button3">Relevant Links</button>
            <div class="wordBay-content" id="wordBay-tab3">
                 <h5 id="links">Links:</h5>
            </div>
            `;
            document.body.appendChild(mainDiv);

            // append close button listener
            document.getElementById("wordBay-close").addEventListener('click' , () => {
                let element = document.getElementById("wordBay-main");
                element.remove(); 
            }) 

            // append synonyms and examples
            let ul_example = document.createElement('ul');
            ul_example.setAttribute("id", "wordBay_list")
            for (let i = 0; i < examples.length; i++){
                li = document.createElement("li");
                li.appendChild(document.createTextNode(examples[i]));
                li.style["list-style-type"] = "disc" 
                ul_example.appendChild(li);
            }
            
            let ul_synonym = document.createElement('ul');
            ul_synonym.setAttribute("id", "wordBay_list")
            for (let i = 0; i < synonyms.length; i++){
                li = document.createElement("li");
                li.appendChild(document.createTextNode(synonyms[i]));
                li.style["list-style-type"] = "disc" 
                ul_synonym.appendChild(li);
            }
            
            document.getElementById("wordBay-example-container").appendChild(ul_example);
            document.getElementById("wordBay-synonyms-container").appendChild(ul_synonym);
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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}




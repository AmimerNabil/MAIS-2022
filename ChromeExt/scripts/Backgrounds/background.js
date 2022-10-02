console.log("background running")

chrome.commands.onCommand.addListener(async (command) => {
   if(command === 'getDefinitions'){
     await getDefinition(); 
   }
})

// function to open the popup window with the new information
const openWithInfo = async () => {
   console.log("time to open the popup window");

   // we are going to send a message to the cntent window.
   // that content window will open a javascript popup inside. 
   
   chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      let message = 
      {
         method : "openPopup",
      }
      chrome.tabs.sendMessage(tabs[0].id, message)
   })
}

// function to get definition of word
const getDefinition = async () => {
   chrome.tabs.query({active: true, currentWindow: true}, async function (tabs){
      let message = {
         method : "get-highlighted-word"
      }

      // now that we have the tab ID, we send a message from it, to its content script
      chrome.tabs.sendMessage(tabs[0].id, message, async function(response){
         let definitionURL = 'https://api.dictionaryapi.dev/api/v2/entries/en/'
         let definition = await (await fetch(`${definitionURL}${response.text}`, {
            method : "GET",
            "access-control-allow-origin": true,
         })).json()

         definition = definition[0];

         let definitions = {
            word : response.text,
            surrounding_Text : response.parent_element_text,
            type : []
         }

         for (let i = 0; i < definition.meanings.length; i++) {
            let object = definition.meanings[i]
            let type = object.partOfSpeech
            let defs = object.definitions.map((element) => element.definition);

            definitions.type.push({
               type : type,
               definitions : defs
            })
         }

         let python_response = await (await fetch(`http://localhost:3000/getDef`, {
            method : "POST",
            body : JSON.stringify(definitions)
         })).json()

         let newObject = {
            word : response.text,
            python_response : python_response
         }

         await chrome.storage.sync.set(newObject, function() {
            console.log("added object to storage ") 
            console.log(newObject)
         })

         console.log("tasked finished")
         await openWithInfo();
      });
   });
}




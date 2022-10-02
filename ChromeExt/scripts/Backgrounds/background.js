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
         if(response.text == `~~~empty string~~~`) return;
         
         // definiitions from free dictionary api
         
         let definitionURL = 'https://api.dictionaryapi.dev/api/v2/entries/en/'
         let definition = await (await fetch(`${definitionURL}${response.text}`, {
            method : "GET",
            "access-control-allow-origin": true,
         })).json()

         // other info from wordsAPI 
         let definitionURL_wordAPI = 'https://wordsapiv1.p.rapidapi.com/words/'
         let definition_wordAPI = await (await fetch(`${definitionURL_wordAPI}${response.text}`, {
            method : "GET",
            headers: {
               'X-RapidAPI-Key': 'bcfd7505a6msh945819cda050110p1626e6jsn83648e06ffd3',
               'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
             }
         })).json()

         if(!definition[0] || definition_wordAPI.success == false){
            await chrome.storage.local.set({"wasFound" : false}, function() {
               console.log("No definitions were found. ") 
            })
            openWithInfo();
            return;
         }

         definition = definition[0];
         console.log(definition_wordAPI)
         let definitions = {
            wordAPI_Result : definition_wordAPI,
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

         await chrome.storage.local.set(newObject, function() {
            console.log("added object to storage ") 
            console.log(newObject)
         })

         console.log("tasked finished")
         await openWithInfo();
      });
   });
}




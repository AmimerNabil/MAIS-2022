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
         let definitionURL = 'https://wordsapiv1.p.rapidapi.com/words/'
         let definition = await (await fetch(`${definitionURL}${response.text}`, {
            method : "GET",
            headers: {
               'X-RapidAPI-Key': 'bcfd7505a6msh945819cda050110p1626e6jsn83648e06ffd3',
               'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
             }
         })).json()

         let python_req = {
            definition : definition,
            surrounding_Text : response.parent_element_text
         }

         console.log(python_req)
         
         let python_response = await (await fetch(`http://localhost:3000/getDef`, {
            method : "POST",
            body : JSON.stringify(python_req)
         })).json()

         console.log(python_response)

         // let newObject = {
         //    word : response.text,
         //    python_response : python_response
         // }

         // await chrome.storage.sync.set(newObject, function() {
         //    console.log("added object to storage ") 
         //    console.log(newObject)
         // })

         // console.log("tasked finished")
         // await openWithInfo();
      });
   });
}




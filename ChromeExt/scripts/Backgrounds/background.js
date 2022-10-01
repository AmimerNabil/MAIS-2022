console.log("background running")

chrome.commands.onCommand.addListener(async (command) => {
   if(command === 'getDefinitions'){
     await getDefinition(); 
   }
})

// function to get definition of word
const getDefinition = async () => {
   chrome.tabs.query({active: true, currentWindow: true}, async function (tabs){
      let message = {
         method : "get-highlighted-word"
      }

      // now that we have the tab ID, we send a message from it, to its content script
      chrome.tabs.sendMessage(tabs[0].id, message, async function(response){
        console.log(response);
      });
   });
}





// everything lives in its own bubbles

### content scripts
script that runs after the pages load. It is javascript that is injected into your page. 
we can affect and manipulate the content of the webpage. 
--- 
it does not listen for browser events like URL changing or browser bnuttons being pressed. It has only effect on 
the current webpage. 

### the background script 
the background script is a script that listens for events based on the user experience. 
    examples :
        - if a user has pressed a button
        - if a user has selected some text. WHatever right. 


Ideas on what to include in the popup :

    - determining whether the words are a noun by looking at its surroundings. 
    - Find best definition with sentence correlations. 

    1. example sentences.
    2. morphology of the word.
    3. Related google links.
    

    Idea. highlight tough words depending on the complexity of the document.
    WHat do we want to accomplish :

    1. sentence correlation //python 

    2. type of word using surroundings // javascript
    3. Related google links.  // javascript
    4. example sentence. // javascript



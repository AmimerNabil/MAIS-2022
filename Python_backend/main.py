from unittest import result
from numpy import result_type
import spacy
from flask import Flask, jsonify, request
####################################
# important application constants 
# and dependencies
####################################
# package used is english small. For more tools, we could download , eng_core_web_nd and eng_core_web_lg
nlp = spacy.load("en_core_web_lg")
app = Flask(__name__)
_port = 3000



Glossary = {
    "NOUN": "noun",
    "VERB": "verb",
    "ADV": "adverb",
    "ADJ": "adjective",
    "CONJ": "conjunction",
    "PRON": "pronoun",
    "IN": "preposition",
    "PROPN" : "noun"
}

################
# routes
################
@app.route('/helloworld', methods = ['GET'])
def hello():
    return jsonify({
        "status" : "200 OK",
        "message": 'Hello'
    })


@app.route('/getDef', methods = ['POST'])
def getDef():
    req =  request.get_json(force=True)
    word = req["definition"]["word"].strip()
    definitions = req["definition"]["results"]
    surrounding_text_doc = nlp(req["surrounding_Text"].replace("\n", "").replace("\t", ""))
    print(surrounding_text_doc)

    # 1. find the type of the word. 
    POS = ""
    for token in surrounding_text_doc:
        if (token.text == word):
            POS = token.pos_

    validDefs = []

    biggest_def_length = 0
    for defs in definitions:
        if(defs["partOfSpeech"] == Glossary[POS]):
            if len(defs["definition"]) > biggest_def_length:
                biggest_def_length = len(defs["definition"])
            validDefs.append(defs)


    similarity_Array = []

    #2 . create similarity vectors for the definitions and for the examples
    for idx,defs in enumerate(validDefs):
        definition = defs["definition"]
        examples = defs.get("examples")
        definition = nlp(definition)
    
        idx_word = 0
        average_def_corolation = 0
        # first compare every noun verb and adjective with the full surrounding text in the definition
        for word_token in definition:
            if(word_token.pos_ == "NOUN" or word_token.pos_ == "VERB" or word_token.pos_ == "ADJ"):
                average_def_corolation += word_token.similarity(surrounding_text_doc)
                idx_word += 1

        # get the average correlation. 
        weight = len(defs)/biggest_def_length
        average_def_corolation = (average_def_corolation/idx_word) * weight

        similarity_Array.append({
            "index" : idx,
            "def_cor" : average_def_corolation,
            "corr" : (average_def_corolation)
        })
    
    best = 0
    sim = 0
    for element in similarity_Array:
        if sim < element["corr"]:
            sim = element["corr"]
            best = element["index"]

    # print(similarity_Array)

    return jsonify({
        "status" : "200 OK",
        "valid_defs" : validDefs,
        "similarity_array" : similarity_Array,
        "best_Def" : validDefs[best]
    })

    
if __name__ == '__main__':
    app.run(debug=True , port=_port)



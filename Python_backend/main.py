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
    result =  request.get_json(force=True)
    types = result["type"]
    definitions = []

    for type in types:
        object = {
            "type" : type["type"],
            "def" : type["definitions"]
        }
        definitions.append(object)

    surrounding_text_doc = nlp(result["surrounding_Text"])

    POS = ""
    word = result["word"].strip()
    for token in surrounding_text_doc:
        if (token.text == word):
            POS = token.pos_
    
    definition = []
    for object in result["type"]:
        if (object["type"].lower() == Glossary[POS].lower()):
            definition = object["definitions"]

    biggest_length = len(max(definition, key=len))

    best_sim = 0
    best_def_index = -1

    ####################
    # weighted_similarity index to determine correct definition. 
    # seems to work the best !!!
    ####################
    for idx, defs in enumerate(definition):
        length_of_def = len(defs)
        average_similarity = 0.0
        defs_doc = nlp(defs)
        word_count = 0
        for word in defs_doc:
            if(word.pos_ == "NOUN" or word.pos_ == "VERB" or word.pos_ == "ADJ"):
                partialSum = surrounding_text_doc.similarity(word)
                average_similarity += partialSum
                word_count += 1

        average_similarity = average_similarity/word_count

        if average_similarity > best_sim: 
            best_sim = average_similarity
            best_def_index = idx

        average_similarity = (average_similarity, idx)

        print("average sim : " + str(average_similarity) + " for def : " + defs)

    best_Def = definition[best_def_index]
    ## once we have the best definition : we try to get the synonys
    definitions_wordAPI = result["wordAPI_Result"]["results"]
    approvedDefs = []
    best_Def_doc = nlp(best_Def)

    for definition_w in definitions_wordAPI:
        defs = nlp(definition_w["definition"])
        sim = defs.similarity(best_Def_doc)
        if sim > 0.70 :
            approvedDefs.append({
                "def" : definition_w,
                "sim" : sim
            })

    return jsonify({
        "status" : "200 OK",
        "POS" : POS,
        "defs" : definition,
        "best_def" : best_Def,
        "approvedWordAPI" : approvedDefs
    })

    
if __name__ == '__main__':
    app.run(debug=True , port=_port)



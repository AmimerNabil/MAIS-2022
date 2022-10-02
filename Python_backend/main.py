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
            break


    print(definition)

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
        for word in defs_doc:
            if(word.pos_ == "NOUN" or word.pos_ == "VERB"):
                partialSum = surrounding_text_doc.similarity(word)
                average_similarity += partialSum

        average_similarity = average_similarity/length_of_def
        weighted_similarity = (length_of_def/biggest_length) * average_similarity
        

        if weighted_similarity > best_sim: 
            best_sim = weighted_similarity
            best_def_index = idx

        weighted_similarity = (weighted_similarity, idx)

        print("average sim : " + str(weighted_similarity) + " for def : " + defs)


    return jsonify({
        "status" : "200 OK",
        "POS" : POS,
        "defs" : definition,
        "best_def" : definition[best_def_index]
    })

    
if __name__ == '__main__':
    app.run(debug=True , port=_port)



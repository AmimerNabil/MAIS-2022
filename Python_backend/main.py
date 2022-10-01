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
    # req =  request.get_json(force=True)
    # word = req["definition"]["word"].strip()
    # definitions = req["definition"]["results"]
    # surrounding_text_doc = nlp(req["surrounding_Text"].replace("\n", "").replace("\t", ""))
    # print(surrounding_text_doc)

    # # 1. find the type of the word. 
    # POS = ""
    # for token in surrounding_text_doc:
    #     if (token.text == word):
    #         POS = token.pos_

    # validDefs = []

    # for defs in definitions:
    #     if(defs["partOfSpeech"] == Glossary[POS]):
    #         validDefs.append(defs)


    # similarity_Array = []

    # #2 . create similarity vectors for the definitions and for the examples
    # for idx,defs in enumerate(validDefs):
    #     definition = nlp(defs["definition"])
    #     examples = defs["examples"]

    #     idx_word = 0
    #     average_def_corolation = 0
    #     # first compare every noun verb and adjective with the full surrounding text in the definition
    #     for word_token in definition:
    #         if(word_token.pos_ == "NOUN" or word_token.pos_ == "VERB" or word_token.pos_ == "ADJ"):
    #             average_def_corolation += word_token.similarity(surrounding_text_doc)
    #             idx_word += 1

    #     # get the average correlation. 
    #     average_def_corolation = average_def_corolation/idx if idx > 0 else average_def_corolation

    #     # do the same thing with the definition example
    #     average_ex_correlation = 0
    #     idx_example = 0
    #     for example in examples:
    #         idx_example += 1
    #         example_doc = nlp(example)
    #         avg_for_one_ex = 0 # average correlation for this one example
    #         idx = 0 # keeping track of relevant words in the example
    #         for word_token in example_doc:
    #             if(word_token.pos_ == "NOUN" or word_token.pos_ == "VERB" or word_token.pos_ == "ADJ"):
    #                 avg_for_one_ex += word_token.similarity(surrounding_text_doc)
    #                 idx += 1
    #         avg_for_one_ex = avg_for_one_ex/idx if idx > 0 else avg_for_one_ex
    #         average_ex_correlation += avg_for_one_ex
        
    #     average_ex_correlation = average_ex_correlation/idx_example if idx_example > 0 else average_ex_correlation

    #     similarity_Array.append({
    #         "index" : idx,
    #         "def_cor" : average_def_corolation,
    #         "avg_ex_cor" : average_ex_correlation,
    #         "corr" : (average_def_corolation + average_ex_correlation)
    #     })

    #     print(similarity_Array)

    return jsonify({
        "status" : "200 OK",
        # "valid_defs" : validDefs
    })

    

if __name__ == '__main__':
    app.run(debug=True , port=_port)



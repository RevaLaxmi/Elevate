"""
import spacy
import sys
import json

# Load SpaCy NLP model
nlp = spacy.load("en_core_web_sm")

def extract_info(text):
    doc = nlp(text)
    extracted_data = {
        "name": None,
        "email": None,
        "phone": None,
        "skills": [],
        "experience": []
    }

    # Extract email and phone
    for ent in doc.ents:
        if ent.label_ == "PERSON" and not extracted_data["name"]:
            extracted_data["name"] = ent.text
        elif ent.label_ == "EMAIL":
            extracted_data["email"] = ent.text
        elif ent.label_ == "PHONE":
            extracted_data["phone"] = ent.text

    # Extract skills (basic example)
    extracted_data["skills"] = [token.text for token in doc if token.pos_ == "NOUN"]

    return extracted_data

if __name__ == "__main__":
    input_file = sys.argv[1]  # Read input file path from command-line argument

    with open(input_file, "r", encoding="utf-8") as f:
        text = f.read()

    extracted_data = extract_info(text)

    # Print JSON output (this is captured by `execSync` in TypeScript)
    print(json.dumps(extracted_data, indent=2))
"""
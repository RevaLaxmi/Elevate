import sys
import json
import spacy

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

    for ent in doc.ents:
        if ent.label_ == "PERSON" and not extracted_data["name"]:
            extracted_data["name"] = ent.text
        elif ent.label_ == "EMAIL":
            extracted_data["email"] = ent.text
        elif ent.label_ == "PHONE":
            extracted_data["phone"] = ent.text

    extracted_data["skills"] = [token.text for token in doc if token.pos_ == "NOUN"]

    return extracted_data

if __name__ == "__main__":
    try:
        input_file = sys.argv[1]
        with open(input_file, "r", encoding="utf-8") as f:
            text = f.read()

        if not text.strip():
            raise ValueError("Empty text file. No data to process.")

        extracted_data = extract_info(text)

        # Ensure valid JSON output
        print(json.dumps(extracted_data, indent=2))

    except Exception as e:
        error_message = {"error": str(e)}
        print(json.dumps(error_message))

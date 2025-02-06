import sys
import json
import re

def extract_info(text):
    # Define your regex patterns for each field
    extracted_data = {
        "name": None,
        "email": None,
        "phone": None,
        "skills": [],
        "experience": []
    }

    # Example: Extract name (you can refine this based on your text structure)
    name_match = re.search(r"(?:Name|Full Name):?\s*([A-Za-z\s]+)", text)
    if name_match:
        extracted_data["name"] = name_match.group(1).strip()

    # Extract email (using a basic regex for emails)
    email_match = re.search(r"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})", text)
    if email_match:
        extracted_data["email"] = email_match.group(1)

    # Extract phone number (basic pattern)
    phone_match = re.search(r"(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})", text)
    if phone_match:
        extracted_data["phone"] = phone_match.group(1)

    # Extract skills (this assumes skills are listed, you might need to adjust)
    skills_matches = re.findall(r"\b(?:Python|Java|JavaScript|C\+\+|SQL|Machine Learning|TensorFlow|PyTorch|etc)\b", text, re.IGNORECASE)
    extracted_data["skills"] = list(set(skills_matches))  # Deduplicate the list

    # Example for extracting work experience (you may need to refine based on your text format)
    experience_matches = re.findall(r"(?:Experience|Work\s?History):?\s*([\s\S]+?)(?=\n\s*\n|\Z)", text)
    extracted_data["experience"] = [exp.strip() for exp in experience_matches]

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

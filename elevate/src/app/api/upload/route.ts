/* 

import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import pdf from "pdf-parse";  // Import pdf-parse for text extraction

export const config = {
  api: {
    bodyParser: false,  // Disable body parsing as we are using formidable
  },
};

export async function POST(req: Request) {
  const form = new formidable.IncomingForm({
    uploadDir: "./uploads", // Directory where files are temporarily stored
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req as any, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return resolve(NextResponse.json({ error: "Failed to upload file" }, { status: 500 }));
      }

      const uploadedFile = files.file[0];  // Assuming only one file is uploaded
      console.log("Uploaded file:", uploadedFile);

      // Process the PDF after uploading
      try {
        const pdfBuffer = fs.readFileSync(uploadedFile.filepath);
        const pdfData = await pdf(pdfBuffer); // Extract text from the PDF
        const extractedText = pdfData.text;  // The text content of the PDF

        // Clean up the extracted text (optional preprocessing)
        const cleanedText = cleanExtractedText(extractedText);

        // You can now use the cleanedText for further processing (like parsing structured data)
        console.log("Extracted Text:", cleanedText);

        resolve(NextResponse.json({ message: "File uploaded and processed successfully!" }));
      } catch (error) {
        console.error("Error parsing PDF:", error);
        resolve(NextResponse.json({ error: "Failed to extract text from PDF" }, { status: 500 }));
      }
    });
  });
}

// Preprocessing function to clean up extracted text (e.g., removing extra spaces)
function cleanExtractedText(text: string): string {
  // Clean up unwanted spaces or headers/footers (you can customize this based on the format of your CVs)
  let cleanedText = text.replace(/\s+/g, ' ').trim();  // Remove excessive whitespace
  // Further cleanup logic can go here (e.g., removing page numbers, headers, footers)

  return cleanedText;
}


*/

import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import pdf from "pdf-parse"; // For text extraction
import { Configuration, OpenAIApi } from "openai";


export const config = {
  api: {
    bodyParser: false, // Disable default body parser
  },
};

// Initialize OpenAI API client
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Add your OpenAI API key in .env.local
  })
);

export async function POST(req: Request) {
  const form = new formidable.IncomingForm({
    uploadDir: "./uploads", // Directory for temporary storage
    keepExtensions: true,
  });

  return new Promise((resolve) => {
    form.parse(req as any, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return resolve(NextResponse.json({ error: "Failed to upload file" }, { status: 500 }));
      }

      // Check if a file was uploaded
      if (!files.file || !Array.isArray(files.file) || files.file.length === 0) {
        return resolve(NextResponse.json({ error: "No file uploaded" }, { status: 400 }));
      }

      const uploadedFile = files.file[0]; // Get the uploaded file
      console.log("Uploaded file:", uploadedFile);

      try {
        // Step 1: Extract text from the uploaded PDF
        const pdfBuffer = fs.readFileSync(uploadedFile.filepath);
        const pdfData = await pdf(pdfBuffer);
        const extractedText = pdfData.text;

        // Optional preprocessing step to clean the extracted text
        const cleanedText = cleanExtractedText(extractedText);

        // Step 2: Use OpenAI to parse the CV into structured sections
        const parsedCV = await parseCVWithAI(cleanedText);

        // Step 3: Return the structured CV data as the API response
        resolve(NextResponse.json({ parsedData: parsedCV }, { status: 200 }));
      } catch (error) {
        console.error("Error processing PDF:", error);
        resolve(NextResponse.json({ error: "Failed to process file" }, { status: 500 }));
      }
    });
  });
}

// Function to clean up extracted text (optional)
function cleanExtractedText(text: string): string {
  return text.replace(/\s+/g, " ").trim(); // Remove excessive whitespace
}

// Function to parse the CV using OpenAI
async function parseCVWithAI(text: string) {
  const prompt = `
    Parse the following CV text into the following sections:
    - Name
    - Email
    - Phone
    - LinkedIn
    - GitHub
    - Education
    - Experience
    - Skills
    - Languages
    - Interests

    Text: ${text}
  `;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 1500,
  });

  // Attempt to parse and return JSON response
  try {
    return JSON.parse(response.data.choices[0].text.trim());
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("Failed to parse AI response.");
  }
}

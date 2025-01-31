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
import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: false, // Disable default body parser
  },
};

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is correctly set in .env.local
});

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

type ChatCompletionResponse = {
    choices: {
      message: {
        role: string;
        content: string;
      };
    }[];
  };

// Function to parse the CV using OpenAI
async function parseCVWithAI(text: string) {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Or "gpt-3.5-turbo"
      messages: [
        { role: "system", content: "You are a helpful assistant that parses CV data." },
        { role: "user", content: `
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
        ` },
      ],
      max_tokens: 1500,
    });
  
  // Safely access message content, or throw an error if it's not available
  const messageContent = response.choices?.[0]?.message?.content?.trim();
  if (!messageContent) {
    throw new Error("OpenAI API response is incomplete or invalid.");
  }

  return messageContent;
}

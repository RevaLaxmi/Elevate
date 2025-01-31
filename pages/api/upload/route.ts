import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse"; // For text extraction
import OpenAI from "openai";

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is correctly set in .env.local
});

// Define the upload directory
const uploadDir = path.join(process.cwd(), 'upload');

export const config = {
  api: {
    bodyParser: false, // Disable default body parser
  },
};

export async function POST(req: Request) {
  console.log("API route hit");

  // Initialize formidable form with the correct upload directory
  const form = new formidable.IncomingForm({
    uploadDir: uploadDir, // Correct usage of uploadDir
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

import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import { NextRequest, NextResponse } from "next/server";


console.log("✅ API route /api/parse is being registered...");

export async function POST(req: NextRequest) {
  console.log("✅ Received request to /api/parse");

  try {
    const body = await req.json();
    console.log("📂 Received fileName:", body);

    if (!body?.fileName) {
      console.log("⚠️ Missing fileName in request body");
      return NextResponse.json({ message: "Missing fileName" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", "uploads", body.fileName);
    console.log("🔍 Looking for file at:", filePath);

    if (!fs.existsSync(filePath)) {
      console.log("❌ File not found:", filePath);
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    // Read and parse the PDF file
    const fileBuffer = fs.readFileSync(filePath);
    console.log("📄 File read successfully");

    const data = await pdfParse(fileBuffer);
    console.log("📝 Extracted text successfully");

    // Save extracted text
    const extractedDir = path.join(process.cwd(), "public", "extracted");
    if (!fs.existsSync(extractedDir)) {
      fs.mkdirSync(extractedDir, { recursive: true });
    }

    const extractedFilePath = path.join(extractedDir, `${body.fileName}.txt`);
    fs.writeFileSync(extractedFilePath, data.text);
    console.log("📁 Extracted text saved at:", extractedFilePath);

    return NextResponse.json({ message: "Text extracted and saved successfully", extractedFilePath });
  } catch (error) {
    console.error("🚨 Error parsing PDF:", error);
    return NextResponse.json({ message: "Failed to extract text from PDF" }, { status: 500 });
  }
}





/*
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { fileName } = await req.json();

    // Ensure the file exists in the 'uploads' folder
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    // Read and parse the PDF file
    const fileBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(fileBuffer);

    // Extract text
    const extractedText = data.text;

    // Save extracted text to 'extracted' folder
    const extractedDir = path.join(process.cwd(), 'public', 'extracted');
    if (!fs.existsSync(extractedDir)) {
      fs.mkdirSync(extractedDir, { recursive: true });
    }

    const extractedFilePath = path.join(extractedDir, `${fileName}.txt`);
    fs.writeFileSync(extractedFilePath, extractedText);

    return NextResponse.json({ message: "Text extracted and saved successfully", extractedFilePath });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return NextResponse.json({ message: "Failed to extract text from PDF" }, { status: 500 });
  }
}

*/



/*
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    // Retrieve the file name from the request body (assuming it's sent as JSON)
    const { fileName } = await req.json();
    
    if (!fileName) {
      console.error("No file name provided in the request body");
      return NextResponse.json({ message: "No file name provided" }, { status: 400 });
    }

    // Construct the file path in the uploads folder
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, fileName);
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    console.log(`File found at ${filePath}`);

    // Parse the PDF and extract text
    const extractedData = await extractTextFromPDF(filePath);

    // Save the extracted text to the public/extracted folder
    const extractedDir = path.join(process.cwd(), "public", "extracted");
    if (!fs.existsSync(extractedDir)) {
      fs.mkdirSync(extractedDir, { recursive: true });
    }

    const extractedFilePath = path.join(extractedDir, `${fileName}.txt`);
    fs.writeFileSync(extractedFilePath, extractedData);

    console.log(`Extracted text saved at ${extractedFilePath}`);

    return NextResponse.json({ message: "Text extracted and saved", extractedFilePath });

  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json({ message: "Error processing file" }, { status: 500 });
  }
}

// Function to extract text from the PDF
async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const data = fs.readFileSync(filePath);  // Read the PDF file
    const result = await pdfParse(data);     // Parse the PDF
    console.log("Text extracted from PDF:", result.text);  // Log the extracted text
    return result.text;                      // Return extracted text
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Error extracting text from PDF");
  }
}
*/





/*

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse"; // Ensure installed: npm install pdf-parse
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
    try {
        const { fileName } = await req.json();
        if (!fileName) {
            return NextResponse.json({ error: "No file name provided" }, { status: 400 });
        }

        // Locate uploaded PDF
        const filePath = path.join(process.cwd(), "public/uploads", fileName);
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        // Extract text from PDF
        const pdfBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(pdfBuffer);
        const extractedText = pdfData.text;

        // 🔹 Send extracted text to OpenAI for structured parsing
        const prompt = `Extract structured information from the following resume:\n\n${extractedText}`;
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2,
        });

        const structuredData = response.choices[0]?.message?.content;

        if (!structuredData) {
            return NextResponse.json({ error: "Failed to extract data" }, { status: 500 });
        }

        // 🔹 Save extracted data as JSON
        const extractedDir = path.join(process.cwd(), "public/extracted");
        if (!fs.existsSync(extractedDir)) fs.mkdirSync(extractedDir, { recursive: true });

        const jsonFilePath = path.join(extractedDir, `${fileName}.json`);
        fs.writeFileSync(jsonFilePath, JSON.stringify(JSON.parse(structuredData), null, 2));

        return NextResponse.json({
            message: "Data extracted and saved successfully",
            filePath: jsonFilePath,
            structuredData: JSON.parse(structuredData),
        });

    } catch (error) {
        console.error("Error processing file:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
*/




/*

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your .env.local
});

export async function POST(req: Request) {
    try {
        const { fileName } = await req.json();
        const filePath = path.join(process.cwd(), "elevate/public/uploads", fileName);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);

        // Process extracted text using OpenAI
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                {
                    role: "system",
                    content: "Extract structured data from the resume in JSON format. Fields: name, email, phone, education, experience, skills, projects, certifications.",
                },
                {
                    role: "user",
                    content: pdfData.text,
                },
            ],
            temperature: 0.2,
        });

        const structuredData = response.choices[0]?.message?.content || "{}";
        return NextResponse.json(JSON.parse(structuredData));
    } catch (error) {
        console.error("Error parsing PDF:", error);
        return NextResponse.json({ error: "Error processing PDF" }, { status: 500 });
    }
}

*/
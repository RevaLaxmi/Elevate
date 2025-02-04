import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// This function is to trigger the /api/parse route
async function triggerParseRoute(fileName: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/parse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName }),
    });

    if (!response.ok) {
      throw new Error(`Failed to trigger parse route: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Parse response:", data);
  } catch (error) {
    console.error("Error in triggerParseRoute:", error);
  }
}


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, file.name);
    fs.writeFileSync(filePath, buffer);

    // Trigger the parse route after successful upload
    await triggerParseRoute(file.name);

    return NextResponse.json({ message: "File uploaded and parse triggered successfully", filePath });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}




/*THIS IS THE HUGGING FACE CODE - WHICH ISNT WORKING... THE MODEL VERSION JUST ISNT CLICKING TO PARSE THE TEXT FOR THE PDF FILE*/
/* 
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Hugging Face API details
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HUGGINGFACE_MODEL = "impira/layoutlm-document-qa";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    // Define upload & extracted directories
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const extractedDir = path.join(process.cwd(), "public", "extracted");

    // Ensure directories exist
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    if (!fs.existsSync(extractedDir)) fs.mkdirSync(extractedDir, { recursive: true });

    // Save uploaded file
    const filePath = path.join(uploadDir, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    console.log(`✅ File uploaded: ${file.name}`);

    // 📌 Send file to Hugging Face API for text extraction
    const extractedData = await extractTextFromPDF(filePath);

    if (!extractedData) {
      return NextResponse.json({ message: "Text extraction failed" }, { status: 500 });
    }

    // Save extracted text to JSON
    const extractedFilePath = path.join(extractedDir, `${file.name}.json`);
    fs.writeFileSync(extractedFilePath, JSON.stringify(extractedData, null, 2));

    return NextResponse.json({
      message: "File uploaded and extracted successfully",
      extractedFile: `/extracted/${file.name}.json`,
    });

  } catch (error) {
    console.error("❌ Error processing file:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}

// Function to extract text using Hugging Face API
async function extractTextFromPDF(filePath: string) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const response = await fetch(`https://api-inference.huggingface.co/models/${HUGGINGFACE_MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/pdf",
      },
      body: fileBuffer,
    });

    const data = await response.json();
    console.log("🔍 Hugging Face Response:", data);  // Debugging - See what the API returns

    if (!data || !data.generated_text) {
      throw new Error("Unexpected response format");
    }

    return { extractedText: data.generated_text };
  } catch (error) {
    console.error("❌ Hugging Face API Error:", error);
    return null;
  }
}
*/


/*THIS IS THE OPEN AI PART WHICH WE'RE NO LONGER USING - IT'LL TAKE TIME TO WORK WITH FREE CREDITS */
/* 
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Mock function to parse the uploaded file (Replace this with actual logic)
async function parseFile(filePath: string) {
  const fs = require("fs");
  const fileContent = fs.readFileSync(filePath, "utf-8"); // Read file content

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a resume parser. Extract Name, Email, Phone, Skills, Experience, and Education." },
        { role: "user", content: fileContent },
      ],
      max_tokens: 300,
    }),
  });

  const data = await response.json();
  console.log("🔍 OpenAI Response:", JSON.stringify(data, null, 2));

  if (data.choices && data.choices.length > 0) {
    return { extractedText: data.choices[0].message.content };
  } else {
    throw new Error("Unexpected response format from OpenAI API");
  }
}
/// this section ^^ we're figuring out how we want to parse our files 

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, file.name);
    fs.writeFileSync(filePath, buffer);

    console.log("✅ File uploaded:", file.name);

    // 🟢 Call the parsing function directly instead of making another API call
    const parsedData = await parseFile(filePath);

    return NextResponse.json({
      message: "File uploaded and parsed successfully",
      filePath,
      extractedData: parsedData,
    });

  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ message: "Upload and parsing failed" }, { status: 500 });
  }
}
*/










/* THIS CODE COMPONENT RIGHT BELOW WORKS AS OF 4/2/25 */
/*
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, file.name);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ message: "File uploaded successfully", filePath });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
*/
/* I WANT TO ADD THE PDF-PARSE CODE NOW HERE AFTER THIS*/











/*idk what this is */
/* 
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadDir = path.join(process.cwd(), "public", "uploads");

        // Ensure upload directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Save uploaded file
        const filePath = path.join(uploadDir, file.name);
        fs.writeFileSync(filePath, buffer);

        console.log("✅ File uploaded:", file.name);

        // 🟢 Automatically trigger the parsing API
        const parseResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/parse`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileName: file.name }),
        });

        if (!parseResponse.ok) {
            throw new Error("Parsing failed");
        }

        const parsedData = await parseResponse.json();

        return NextResponse.json({
            message: "File uploaded and parsed successfully",
            filePath,
            extractedData: parsedData,
        });

    } catch (error) {
        console.error("❌ Error uploading file:", error);
        return NextResponse.json({ message: "Upload failed" }, { status: 500 });
    }
}
*/
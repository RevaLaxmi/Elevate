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

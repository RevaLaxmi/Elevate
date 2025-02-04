import { NextResponse } from "next/server";
import { processExtractedText } from "@/app/api/clean/cleanText"; // Adjust import path if needed

export async function POST(req: Request) {
    try {
        const { fileName } = await req.json();
        if (!fileName) {
            return NextResponse.json({ error: "❌ No file name provided" }, { status: 400 });
        }

        console.log(`✅ Received request to /api/clean for file: ${fileName}`);
        
        const structuredData = processExtractedText(fileName);

        if (!structuredData) {
            return NextResponse.json({ error: "❌ File not found or could not be processed" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: structuredData });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "❌ An unknown error occurred" }, { status: 500 });
    }
}

import fs from "fs";
import path from "path";

const cleanText = (rawText: string) => {
    console.log("🧹 Cleaning extracted text...");

    return {
        name: rawText.match(/Name:\s*(.*)/)?.[1]?.trim() || "Unknown",
        email: rawText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)?.[0] || "Unknown",
        phone: rawText.match(/(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/)?.[0] || "Unknown",
        education: rawText.match(/Education:\s*(.*)/)?.[1]?.trim() || "Not Found",
        experience: rawText.match(/Experience:\s*(.*)/)?.[1]?.trim() || "Not Found",
        skills: rawText.match(/Skills:\s*(.*)/)?.[1]?.split(",").map(skill => skill.trim()) || [],
    };
};

export const processExtractedText = (fileName: string) => {
    console.log(`🔍 Processing extracted text for: ${fileName}`);

    // Add '.pdf.txt' to the extracted file name
    const extractedPath = path.join(process.cwd(), "public", "extracted", `${fileName}.pdf.txt`);
    const structuredPath = path.join(process.cwd(), "public", "structured_data", `${fileName}.json`);

    if (!fs.existsSync(extractedPath)) {
        console.error(`❌ Extracted file not found: ${extractedPath}`);
        return null;
    }

    console.log(`📄 Reading extracted text from: ${extractedPath}`);
    const rawText = fs.readFileSync(extractedPath, "utf-8");
    const cleanedData = cleanText(rawText);

    console.log("✅ Successfully cleaned text. Saving structured data...");

    // Ensure the structured_data directory exists
    const structuredDataDir = path.dirname(structuredPath);
    if (!fs.existsSync(structuredDataDir)) {
        fs.mkdirSync(structuredDataDir, { recursive: true });
    }

    // Save cleaned data as JSON
    fs.writeFileSync(structuredPath, JSON.stringify(cleanedData, null, 2));

    console.log(`📁 Cleaned data saved at: ${structuredPath}`);
    return cleanedData;
};

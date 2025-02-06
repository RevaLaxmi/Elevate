import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export const processExtractedText = (fileName: string) => {
    console.log(`🔍 Processing extracted text for: ${fileName}`);

    const extractedTxtPath = path.join(process.cwd(), "public", "extracted", `${fileName}.pdf.txt`);
    const structuredPath = path.join(process.cwd(), "public", "structured_data", `${fileName}.json`);
    const pythonScriptPath = path.join(process.cwd(), "src", "app", "api", "clean", "process_resume.py");

    if (!fs.existsSync(extractedTxtPath)) {
        console.error(`❌ Extracted text file not found: ${extractedTxtPath}`);
        return null;
    }

    console.log(`📄 Running PyResparser on extracted text...`);

    try {
        const command = `python3 "${pythonScriptPath}" "${extractedTxtPath}"`;
        const output = execSync(command).toString().trim();

        if (!output) {
            console.error("❌ Python script returned empty output.");
            return null;
        }

        const jsonData = JSON.parse(output);

        if (jsonData.error) {
            console.error(`❌ Python Error: ${jsonData.error}`);
            return null;
        }

        fs.writeFileSync(structuredPath, JSON.stringify(jsonData, null, 2));

        console.log("✅ Successfully extracted structured data using PyResparser.");
        return jsonData;
    } catch (error) {
        console.error("❌ Error running PyResparser script:", error);
        return null;
    }
};

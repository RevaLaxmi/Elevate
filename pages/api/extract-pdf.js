import fs from "fs";
import path from "path";
import pdf from "pdf-parse";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Get filename from request body
    const { filename } = req.body;

    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }

    // Define the path where the PDF is stored
    const filePath = path.join(process.cwd(), "public", "uploads", filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Read PDF file as buffer
    const pdfBuffer = fs.readFileSync(filePath);

    // Extract text from PDF
    const data = await pdf(pdfBuffer);

    return res.status(200).json({ success: true, extractedText: data.text });
  } catch (error) {
    return res.status(500).json({ error: "Failed to extract PDF data", details: error.message });
  }
}

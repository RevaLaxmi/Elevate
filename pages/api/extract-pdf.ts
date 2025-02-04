import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { filename } = req.body;

      // Get the file path of the uploaded PDF from the 'public/uploads' folder
      const filePath = path.join(process.cwd(), "public", "uploads", filename);

      // Ensure the file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
      }

      // Read the PDF file as a buffer
      const pdfBuffer = fs.readFileSync(filePath);

      // Parse the PDF content using pdf-parse
      const data = await pdf(pdfBuffer);

      // Extracted text from the PDF
      const extractedText = data.text;

      // Here you can further process the extracted text (e.g., storing it in a file, parsing it for specific fields)
      console.log("Extracted Text: ", extractedText); // You can log the text or handle it differently.

      // Respond back with the extracted text (for testing purposes)
      res.status(200).json({ success: true, extractedText });
    } catch (error) {
      console.error("Error extracting PDF text:", error);
      res.status(500).json({ error: "Failed to extract PDF data", details: error });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

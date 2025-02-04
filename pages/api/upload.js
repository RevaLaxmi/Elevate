import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false, // Required for formidable
  },
};

// Function to extract CV details using regex
function extractCVData(text) {
  const cvData = {};

  // Extract Name (First Line Heuristic)
  const lines = text.split("\n").map(line => line.trim()).filter(line => line.length > 0);
  cvData.name = lines[0]; // First line is often the name

  // Extract Email
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const emailMatch = text.match(emailRegex);
  cvData.email = emailMatch ? emailMatch[0] : "Not Found";

  // Extract Phone Number (Supports multiple formats)
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/;
  const phoneMatch = text.match(phoneRegex);
  cvData.phone = phoneMatch ? phoneMatch[0] : "Not Found";

  // Extract LinkedIn
  const linkedinRegex = /(https?:\/\/)?(www\.)?linkedin\.com\/[a-zA-Z0-9-_/]+/;
  const linkedinMatch = text.match(linkedinRegex);
  cvData.linkedin = linkedinMatch ? linkedinMatch[0] : "Not Found";

  // Extract GitHub
  const githubRegex = /(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-_]+/;
  const githubMatch = text.match(githubRegex);
  cvData.github = githubMatch ? githubMatch[0] : "Not Found";

  // Extract Education (Find lines with "University", "College", "B.Sc", "M.Sc", "PhD")
  const educationKeywords = ["University", "College", "B.Sc", "M.Sc", "PhD", "Bachelor", "Master", "Degree"];
  cvData.education = lines.find(line => educationKeywords.some(keyword => line.includes(keyword))) || "Not Found";

  // Extract Skills (Looking for a "Skills" section)
  const skillsIndex = lines.findIndex(line => line.toLowerCase().includes("skills"));
  if (skillsIndex !== -1 && skillsIndex + 1 < lines.length) {
    cvData.skills = lines[skillsIndex + 1]; // Next line after "Skills"
  } else {
    cvData.skills = "Not Found";
  }

  // Extract Experience (Find "Experience" section)
  const experienceIndex = lines.findIndex(line => line.toLowerCase().includes("experience"));
  if (experienceIndex !== -1) {
    cvData.experience = lines.slice(experienceIndex, experienceIndex + 3).join("\n"); // Take 3 lines after "Experience"
  } else {
    cvData.experience = "Not Found";
  }

  return cvData;
}

// API handler
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), "public", "uploads");
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("❌ Error parsing file:", err);
      return res.status(500).json({ error: "Error parsing file" });
    }

    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const originalFilename = file.originalFilename || "uploaded.pdf";
    const newFilePath = path.join(form.uploadDir, originalFilename);
    fs.renameSync(file.filepath, newFilePath);

    try {
      const pdfBuffer = fs.readFileSync(newFilePath);
      const data = await pdf(pdfBuffer);

      // Extract structured data
      const extractedData = extractCVData(data.text);

      return res.status(200).json({
        success: true,
        message: "File uploaded and data extracted",
        extractedData,
      });

    } catch (error) {
      console.error("❌ Failed to extract text:", error);
      return res.status(500).json({ error: "Failed to extract text", details: error.message });
    }
  });
}



/* CURRENT WORKING VERSION AS OF 03/02/25 */

/* 

import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false, // Required for handling file uploads with formidable
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), "public", "uploads"); // Upload directory
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing file" });
    }

    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const originalFilename = file.originalFilename || "RevaChauhan_CV.pdf"; // Ensure filename exists
    const newFilePath = path.join(form.uploadDir, originalFilename);
    fs.renameSync(file.filepath, newFilePath); // Move file to the correct location

    try {
      // Read uploaded PDF and extract text
      const pdfBuffer = fs.readFileSync(newFilePath);
      const data = await pdf(pdfBuffer);

      // Save extracted text to a new file
      const extractedDir = path.join(process.cwd(), "public", "extracted");
      if (!fs.existsSync(extractedDir)) {
        fs.mkdirSync(extractedDir, { recursive: true });
      }

      const textFilePath = path.join(extractedDir, `${originalFilename}.txt`);
      fs.writeFileSync(textFilePath, data.text, "utf-8");

      console.log(`✅ Extracted text saved to: ${textFilePath}`);

      return res.status(200).json({
        success: true,
        message: "File uploaded and text extracted",
        extractedText: data.text,
        textFilePath: `/extracted/${originalFilename}.txt`, // URL for the extracted text
      });
    } catch (error) {
      console.error("❌ Failed to extract text:", error);
      return res.status(500).json({ error: "Failed to extract text", details: error.message });
    }
  });
}

*/


/* SECOND VERSION */



/* 

import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm({
      keepExtensions: true,
      uploadDir: './public/uploads',  // Save files in the 'uploads' folder
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'File upload failed' });
      }

      const file = files.file[0];
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Save the file and respond with a success message
      return res.status(200).json({ message: 'File uploaded successfully' });
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}


*/
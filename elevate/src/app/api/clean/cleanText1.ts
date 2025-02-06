

/* VERSION OF CLEAN TS THATS working - WITHOUT the process resume file */
import fs from "fs";
import path from "path";

// Section headers with possible variations
const SECTION_HEADERS = {
    professional_summary: ["Professional Summary", "Summary", "Profile"],
    employment_history: ["Employment History", "Work Experience", "Experience", "Internships"],
    education: ["Education", "Academic Background", "Qualifications"],
    skills: ["Skills", "Technical Skills", "Core Competencies"],
    projects: ["Projects", "Key Projects", "Research"],
    positions_held: ["Positions Held", "Leadership", "Roles"],
    languages: ["Languages", "Language Proficiency"],
    awards: ["Awards", "Achievements", "Honors"],
    extracurriculars: ["Extracurricular Activities", "Clubs", "Interests"],
    certifications: ["Certifications", "Courses", "Training"],
    publications: ["Publications", "Research Papers"],
};

// Function to extract sections dynamically
const extractFlexibleSection = (text: string, sectionNames: string[]) => {
    for (const name of sectionNames) {
        const extracted = extractSection(text, name);
        if (extracted !== "Not Found") return extracted;
    }
    return "Not Found";
};

// Extracts a section's content
const extractSection = (text: string, heading: string) => {
    const regex = new RegExp(`${heading}\\s*[-–—]*\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z\\s&]+\\n|$)`, "i");
    return text.match(regex)?.[1]?.trim() || "Not Found";
};

// Extract list-based items (handles different bullet styles)
// Improved version of extractListItems for spacing between concatenated words
const extractListItems = (text: string) => {
    return text
        .split("\n")
        .map(item => item.replace(/^(?:[-•●▪✔▶✅▶️]|\d+\.)\s*/, "").trim()) // Remove bullets
        .filter(item => item.length > 0) // Remove empty lines
        .map(item => item.replace(/([a-z])([A-Z])/g, "$1 $2")) // Add space before uppercase words
        .map(item => item.replace(/\s+/g, " ")) // Ensure proper spacing
        .map(item => item.trim()); // Remove any leading/trailing whitespace
};

const educationRegex = /\b(B.Sc|B.A|M.Sc|M.A|P.G.D|Degree|Diploma|CGPA)\b/;
const internshipKeywords = /\b(Intern|Internship|Research Intern)\b/;


// Normalize inconsistent capitalization
const normalizeText = (text: string) => text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());

const cleanText = (rawText: string) => {
    console.log("🧹 Cleaning extracted text...");

    return {
        // Personal Information
        name: rawText.match(/^(.*?)\n/)?.[1]?.trim() || "Unknown",
        email: rawText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)?.[0] || "Unknown",
        phone: rawText.match(/(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/)?.[0] || "Unknown",
        nationality: rawText.match(/Nationality:\s*(.*)/)?.[1]?.trim() || "Unknown",
        location: rawText.match(/(Location|Address):\s*(.*)/)?.[2]?.trim() || "Unknown",
        linkedin: rawText.match(/LinkedIn:\s*(.*)/)?.[1]?.trim() || "Not Found",
        github: rawText.match(/Github:\s*(.*)/)?.[1]?.trim() || "Not Found",
        website: rawText.match(/Website:\s*(.*)/)?.[1]?.trim() || "Not Found",

        // Major Sections
        professional_summary: extractFlexibleSection(rawText, SECTION_HEADERS.professional_summary),

        employment_history: extractFlexibleSection(rawText, SECTION_HEADERS.employment_history)
            .split(/\n(?=[A-Za-z].*(\d{4}|\bInternship\b))/)  // Split on years or 'Internship'
            .map(job => {
                const lines = job.split("\n").map(line => line.trim()).filter(line => line);

                if (lines.length < 3) {
                    return { company: "Unknown", duration: "Unknown", job_title: "Unknown", responsibilities: [] };
                }

                // Extracting Company Name and Duration properly
                const companyMatch = lines[0].match(/^([A-Za-z&\s]+)\s+(\w+\s*\d{4}\s*[-–—]?\s*\w+\s*\d{4}|\d{4}-\d{4})/);
                const company = companyMatch ? normalizeText(companyMatch[1].trim()) : "Unknown";
                const duration = companyMatch ? companyMatch[2].trim() : "Unknown";

                // Job Title detection, checking for 'Internship' keywords
                const job_title = normalizeText(lines[1]?.replace(/^[-•●]\s*/, "").trim() || "Unknown");

                // Detect if the job title includes internship-related terms and adjust if needed
                if (/internship/i.test(job_title)) {
                    console.log(`Detected Internship: ${job_title}`); // Debugging
                }

                // Extract Responsibilities
                const responsibilities = extractListItems(lines.slice(2).join("\n"));

                return { company, duration, job_title, responsibilities };
            }),





        education: extractFlexibleSection(rawText, SECTION_HEADERS.education)
            .split(/\n(?=[A-Z].+?,\s*[A-Za-z\s]+(?:\d{4})?)/)
            .map(edu => {
                const lines = edu.split("\n");
                return {
                    degree: normalizeText(lines[0]?.trim() || "Unknown"),
                    university: lines[1]?.trim() || "Unknown",
                    cgpa: lines.find(line => /CGPA|GPA|Grade/i.test(line)) || "Not Found"
                };
            }),

        projects: extractFlexibleSection(rawText, SECTION_HEADERS.projects)
            .split(/\n(?=[•●-])/)
            .map(project => project.replace(/^[-•●]\s*/, "").trim()),

        positions_held: extractFlexibleSection(rawText, SECTION_HEADERS.positions_held)
            .split(/\n(?=[•●-])/)
            .map(position => position.replace(/^[-•●]\s*/, "").trim()),

        skills: extractListItems(extractFlexibleSection(rawText, SECTION_HEADERS.skills)),

        languages: extractListItems(extractFlexibleSection(rawText, SECTION_HEADERS.languages)),

        awards: extractListItems(extractFlexibleSection(rawText, SECTION_HEADERS.awards)),

        extracurriculars: extractListItems(extractFlexibleSection(rawText, SECTION_HEADERS.extracurriculars)),

        certifications: extractListItems(extractFlexibleSection(rawText, SECTION_HEADERS.certifications)),

        publications: extractListItems(extractFlexibleSection(rawText, SECTION_HEADERS.publications)),
    };
};



// Process and save structured data
export const processExtractedText = (fileName: string) => {
    console.log(`🔍 Processing extracted text for: ${fileName}`);

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

    if (!fs.existsSync(path.dirname(structuredPath))) {
        fs.mkdirSync(path.dirname(structuredPath), { recursive: true });
    }

    fs.writeFileSync(structuredPath, JSON.stringify(cleanedData, null, 2));
    console.log(`📁 Cleaned data saved at: ${structuredPath}`);

    return cleanedData;
};










/* ------------------------------------------------------------------------------------------- */


/*First REGEX file - while basically pulled out like... nothing */
/*
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
*/
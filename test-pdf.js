import fs from "fs";
import pdfParse from "pdf-parse";

const filePath = "C:/Users/Reva Laxmi Chauhan/Desktop/Elevate/Elevate/elevate/public/uploads/RevaChauhan_CV.pdf"; // Make sure this is correct

console.log("Trying to read file:", filePath); // ✅ Debugging step

fs.readFile(filePath, (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }
  pdfParse(data)
    .then((result) => {
      console.log("PDF Text:", result.text);
    })
    .catch((error) => {
      console.error("PDF Parsing Error:", error);
    });
});

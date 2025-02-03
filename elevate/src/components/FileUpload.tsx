"use client";

import React, { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("No file selected.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? "Uploading..." : "Upload PDF"}
      </button>
    </div>
  );
}

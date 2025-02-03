"use client";

import React, { useState } from "react";
import { Button } from "../components/ui/button";
import FileUpload from "../components/FileUpload";

export default function LandingPage() {
  const [headerSticky, setHeaderSticky] = useState(false);

  const handleScroll = () => {
    setHeaderSticky(window.scrollY > 50);
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", handleScroll);
  }

  return (
    <div className="font-sans antialiased">
      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          headerSticky ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold">ELEVATE</div>
          <div>
            <Button className="mr-4">Login</Button>
            <Button variant="outline">Sign Up</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="h-screen bg-gray-50 flex flex-col justify-center items-center text-center">
        <h1 className="text-5xl font-bold mb-4">ELEVATE</h1>
        <p className="text-lg text-gray-600 mb-6">
          The quickest way to create your personal website.
        </p>
        <Button size="lg">Get Started</Button>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Elevate?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2">Choose Your Template</h3>
              <p className="text-gray-600">
                Pick from a selection of sleek, professionally-designed templates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI-Generated Content</h3>
              <p className="text-gray-600">
                Let AI generate professional text tailored to your CV or portfolio.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-bold mb-2">Upload Your CV</h3>
              <p className="text-gray-600">
                Upload your CV, and we'll do the rest. Create a personal website in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upload CV Section */}
      <section className="w-full flex flex-col items-center py-12 bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Upload Your CV</h2>
        <p className="text-gray-600 mb-6">
          Kickstart your professional website by uploading your resume.
        </p>
        <FileUpload />
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">&copy; 2025 Elevate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}


/*  

// src/app/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [headerSticky, setHeaderSticky] = useState(false);

  const handleScroll = () => {
    setHeaderSticky(window.scrollY > 50);
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", handleScroll);
  }

  return (
    <div className="font-sans antialiased">
      {}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          headerSticky ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold">ELEVATE</div>
          <div>
            <Button className="mr-4">Login</Button>
            <Button variant="outline">Sign Up</Button>
          </div>
        </div>
      </header>

      {}
      <section className="h-screen bg-gray-50 flex flex-col justify-center items-center text-center">
        <h1 className="text-5xl font-bold mb-4">ELEVATE</h1>
        <p className="text-lg text-gray-600 mb-6">
          The quickest way to create your personal website.
        </p>
        <Button size="lg">Get Started</Button>
      </section>

      {}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Elevate?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {}
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2">Choose Your Template</h3>
              <p className="text-gray-600">
                Pick from a selection of sleek, professionally-designed templates.
              </p>
            </div>

            {}
            <div className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI-Generated Content</h3>
              <p className="text-gray-600">
                Let AI generate professional text tailored to your CV or portfolio.
              </p>
            </div>

            {}
            <div className="text-center">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-bold mb-2">Upload Your CV</h3>
              <p className="text-gray-600">
                Upload your CV, and we'll do the rest. Create a personal website in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">&copy; 2025 Elevate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

Use the CVUploader component in your landing page or a dedicated section where the upload feature is showcased.

import CVUploader from "@/components/CVUploader";

export default function Home() {
  return (
    <main className="flex flex-col items-center space-y-12">
      {}
      <section className="w-full flex flex-col items-center py-12 bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Upload Your CV</h2>
        <p className="text-gray-600 mb-6">Kickstart your professional website by uploading your resume.</p>
        <CVUploader />
      </section>
    </main>
  );
}

*/

/* BELOW IS THE DEFAULT NEXT.JS LANDING PAGE */

/*

import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}

*/
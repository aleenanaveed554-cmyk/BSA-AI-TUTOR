import { Bricolage_Grotesque, Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata = {
  title: "BSA AI Tutor — learn Business Systems Analysis",
  description: "An AI tutor for Business Systems Analysis students: explanations, quizzes and case studies powered by Groq.",
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

'use client'
import { Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

export const Footer: React.FC = () => {

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-t border-slate-200 dark:border-slate-800">
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center gap-6">
        
        <div className="flex space-x-4">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
          >
            <Twitter className="h-5 w-5" />
          </Link>
          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
          >
            <Linkedin className="h-5 w-5" />
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-sm text-slate-600 dark:text-slate-400">
          © {currentYear} Stoic Development. <br/> Front-End-Dev: NestorLlach. <br/>Back-End-Dev: Samuel Llach.
        </div>
      </div>
    </div>
  </footer>
  )
}

export default Footer


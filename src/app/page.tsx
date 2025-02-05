"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function Home() {
  useEffect(() => {
    const timer = setTimeout(() => {
      redirect("/login");
    }, 4000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black space-y-8">
 
      <div className="relative w-96 h-96 animate-fade-in rounded-full">
        <Image
          src="/Lion.jfif"
          alt="Stoic Development"
          fill
          className="object-contain rounded-full"
        />
      </div>

      
      <h1 className="text-6xl font-bold text-white animate-fade-in">
        Stoic Development
      </h1>

      
      <div className="flex flex-col items-center space-y-2 animate-fade-in">
        <span className="text-2xl text-white">
          Front-End Dev: Nestor Llach
        </span>
        <span className="text-2xl text-white">
          Back-End Dev: Samuel Llach
        </span>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          opacity: 0;
          animation: fade-in 1s ease-out forwards;
        }

        /* Delays escalonados */
        .animate-fade-in:nth-child(1) {
          animation-delay: 0.3s;
        }
        
        .animate-fade-in:nth-child(2) {
          animation-delay: 0.8s;
        }
        
        .animate-fade-in:nth-child(3) {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
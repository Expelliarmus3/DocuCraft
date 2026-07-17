import React from 'react';
import './globals.css'; 

export const metadata = {
  title: 'DocuCraft Studio Pro',
  description: 'AI document dynamic architecture utility',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
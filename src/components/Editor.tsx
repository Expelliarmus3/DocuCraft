'use client';
import React from 'react';

interface EditorProps {
  title: string;
  content: string;
  onTitleChange: (val: string) => void;
  onContentChange: (val: string) => void;
}

export default function Editor({ title, content, onTitleChange, onContentChange }: EditorProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        onContentChange(fileContent); 
    };

    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between gap-4">
        <input 
          type="text" 
          value={title} 
          onChange={(e) => onTitleChange(e.target.value)} 
          placeholder="Untitled Document" 
          className="font-semibold text-lg px-3 py-1.5 rounded border w-2/3 focus:outline-none focus:ring-2 focus:ring-amber-700 transition-colors duration-200"
          style={{
            backgroundColor: 'var(--bg-base)',
            borderColor: 'var(--border-ui)',
            color: 'var(--color-text)'
          }}
        />
        <label 
          className="border rounded px-3 py-1.5 text-xs font-medium cursor-pointer transition-transform hover:scale-102 active:scale-98 shadow-sm text-center"
          style={{
            backgroundColor: 'var(--bg-base)',
            borderColor: 'var(--border-ui)',
            color: 'var(--color-text-muted)'
          }}
        >
          Upload TXT/MD
          <input type="file" accept=".txt,.md" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>
      
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Type, paste plain text, or upload a markdown file here..."
        className="flex-1 w-full p-4 rounded-lg font-mono text-sm resize-none border focus:outline-none focus:ring-1 focus:ring-amber-700 min-h-[450px] transition-colors duration-200"
        style={{
          backgroundColor: 'var(--bg-base)',
          borderColor: 'var(--border-ui)',
          color: 'var(--color-text)'
        }}
      />
    </div>
  );
}
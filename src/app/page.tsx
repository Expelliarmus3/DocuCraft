'use client';
import React, { useState, useRef, useEffect } from 'react';
import Toolbar from '@/components/Toolbar';
import Editor from '@/components/Editor';
import Preview from '@/components/Preview';
import { TemplateId } from '@/utils/types';
import { exportToDocx, exportToPdf } from '@/utils/documentExporter';
import { Sun, Moon } from 'lucide-react';

export default function WorkspacePage() {
  const [title, setTitle] = useState('Project Layout Assessment Blueprint');
  const [content, setContent] = useState('Provide your professional draft details right here.');
  const [templateId, setTemplateId] = useState<TemplateId>('resume');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode layout
  const previewRef = useRef<HTMLDivElement>(null);

  // Sync class configurations dynamically on the document body root HTML nodes
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleAiEnhance = async (action: string) => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content, action, templateType: templateId }),
      });
      const data = await res.json();
      if (data.processedText) {
        setContent(data.processedText);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    if (format === 'pdf') {
      await exportToPdf(previewRef.current, title);
    } else {
      await exportToDocx(title, content);
    }
  };

  return (
    <main 
      className="min-h-screen p-6 flex flex-col gap-6 transition-colors duration-200"
      style={{ backgroundColor: 'var(--bg-base)', color: 'var(--color-text)' }}
    >
      {/* Header Panel with Dynamic Palette Syncing */}
      <header className="flex justify-between items-center pb-2 border-b" style={{ borderColor: 'var(--border-ui)' }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase" style={{ color: 'var(--color-text)' }}>
            DocuCraft Studio Pro
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Intelligent layout theme playground workspace.
          </p>
        </div>
        
        {/* The Theme Switcher Toggle Control */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2.5 rounded-xl border transition-all duration-150 hover:scale-105 flex items-center justify-center shadow-sm"
          style={{ 
            backgroundColor: 'var(--bg-panel)', 
            borderColor: 'var(--border-ui)',
            color: 'var(--color-accent)'
          }}
          title={isDarkMode ? "Switch to Honeyed Linen Light Mode" : "Switch to Midnight Dark Mode"}
        >
          {isDarkMode ? <Sun className="w-5 h-5 animate-pulse" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      <Toolbar 
        currentTemplate={templateId} 
        onTemplateChange={setTemplateId} 
        onAiEnhance={handleAiEnhance} 
        onExport={handleExport}
        isLoading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 items-stretch">
        <div 
          className="rounded-xl border p-4 shadow-sm" 
          style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-ui)' }}
        >
          <Editor 
            title={title} 
            content={content} 
            onTitleChange={setTitle} 
            onContentChange={setContent} 
          />
        </div>
        <Preview 
          ref={previewRef}
          title={title} 
          content={content} 
          templateId={templateId} 
        />
      </div>
    </main>
  );
}
'use client';
import React from 'react';
import { TemplateId } from '@/utils/types';
import { templates } from '@/templates';
import { Sparkles, FileText, Download } from 'lucide-react';

interface ToolbarProps {
  currentTemplate: TemplateId;
  onTemplateChange: (id: TemplateId) => void;
  onAiEnhance: (action: string) => void;
  onExport: (format: 'pdf' | 'docx') => void;
  isLoading: boolean;
}

export default function Toolbar({ currentTemplate, onTemplateChange, onAiEnhance, onExport, isLoading }: ToolbarProps) {
  return (
    <div 
      className="p-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border shadow-md transition-colors duration-200"
      style={{ 
        backgroundColor: 'var(--bg-panel)', 
        borderColor: 'var(--border-ui)',
        color: 'var(--color-text)' 
      }}
    >
      <div className="flex items-center gap-4">
        <label 
          className="text-sm font-medium flex items-center gap-1 transition-colors duration-200"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <FileText className="w-4 h-4" /> Layout Template:
        </label>
        <select 
          value={currentTemplate} 
          onChange={(e) => onTemplateChange(e.target.value as TemplateId)}
          className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 transition-colors duration-200"
          style={{
            backgroundColor: 'var(--bg-base)',
            borderColor: 'var(--border-ui)',
            color: 'var(--color-text)'
          }}
        >
          {Object.values(templates).map((t) => (
            <option key={t.id} value={t.id} style={{ backgroundColor: 'var(--bg-base)', color: 'var(--color-text)' }}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onAiEnhance('professional')}
          disabled={isLoading}
          className="text-white px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 transition disabled:opacity-50 shadow-sm"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          <Sparkles className="w-4 h-4 text-amber-200" /> {isLoading ? 'Refining...' : 'AI Professional Polish'}
        </button>
        <button
          onClick={() => onAiEnhance('summarize')}
          disabled={isLoading}
          className="border px-3 py-1.5 rounded text-sm font-medium transition disabled:opacity-50 shadow-sm"
          style={{ 
            backgroundColor: 'var(--bg-base)', 
            borderColor: 'var(--border-ui)',
            color: 'var(--color-text)'
          }}
        >
          AI Summarize
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => onExport('pdf')}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1 transition shadow-sm"
        >
          <Download className="w-4 h-4" /> PDF
        </button>
        <button 
          onClick={() => onExport('docx')}
          className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1 transition shadow-sm"
        >
          <Download className="w-4 h-4" /> DOCX
        </button>
      </div>
    </div>
  );
}
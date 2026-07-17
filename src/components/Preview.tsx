'use client';
import React, { forwardRef } from 'react';
import { TemplateId } from '@/utils/types';

interface PreviewProps {
  title: string;
  content: string;
  templateId: TemplateId;
}

const Preview = forwardRef<HTMLDivElement, PreviewProps>(({ title, content, templateId }, ref) => {
  // Helper to parse dynamic inline markdown bolding **text** into JSX elements
  const renderInlineStyles = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Cleans out structural block formatting characters from the string completely
  const cleanLineText = (line: string) => {
    return line
      .replace(/^[-*]\s+/, '') // Remove bullet asterisks or dashes from the start
      .replace(/^#+\s+/, '')   // Remove H1/H2 hash symbols
      .trim();
  };

  const lines = content.split('\n').map(line => line.trim()).filter(Boolean);

  // 1. DYNAMIC RESUME LAYOUT ARCHITECTURE
  if (templateId === 'resume') {
    const bodyStartIndex = lines.findIndex(line => line.startsWith('**')) === -1 
      ? 1 
      : lines.findIndex(line => line.startsWith('**'));

    return (
      <div 
        className="flex flex-col h-full border rounded-xl p-4 shadow-sm min-h-[500px] transition-colors duration-200"
        style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-ui)' }}
      >
        <span className="text-xs font-mono mb-2 uppercase tracking-wider transition-colors duration-200" style={{ color: 'var(--color-text-muted)' }}>
          Real-Time Canvas Preview
        </span>
        <div 
          ref={ref} 
          className="flex-1 bg-white text-slate-900 shadow-inner overflow-y-auto font-sans text-left"
          style={{ 
            minHeight: '297mm',
            paddingTop: '1in',
            paddingBottom: '1in',
            paddingLeft: '1in',
            paddingRight: '1in'
          }}
        >
          {/* Document Title Header */}
          <div className="border-b border-slate-300 pb-2 text-left mb-4">
            <h1 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold">
              {title.replace(/\*\*/g, '')}
            </h1>
          </div>

          {/* Candidate Identification Information */}
          <div className="text-left mb-4">
            {lines.length > 0 && (
              <h2 className="text-xl font-extrabold uppercase tracking-wide text-slate-900 mb-1">
                {lines[0].includes('|') ? "Ahana Sarkar" : lines[0].replace(/\*\*/g, '')}
              </h2>
            )}
            {lines.length > 1 && !lines[1].includes('**') && (
              <p className="text-xs text-slate-600 tracking-tight">{renderInlineStyles(lines[1])}</p>
            )}
            {lines.length > 2 && !lines[2].includes('**') && (
              <p className="text-xs text-slate-600 tracking-tight">{renderInlineStyles(lines[2])}</p>
            )}
          </div>

          {/* Iterative Section Builder Loop */}
          <div className="space-y-4 text-xs leading-relaxed">
            {lines.slice(bodyStartIndex).map((line, idx) => {
              const isSectionHeader = line.startsWith('**') && line.endsWith('**') && !line.includes('|');
              const isBulletPoint = line.startsWith('*') || line.startsWith('-');

              if (isSectionHeader) {
                return (
                  <h3 key={idx} className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pt-2 pb-0.5 mt-4 block clear-both">
                    {line.replace(/\*\*/g, '')}
                  </h3>
                );
              }

              if (isBulletPoint) {
                return (
                  <div key={idx} className="flex items-start gap-2 pl-3 text-slate-700 my-0.5">
                    <span className="text-slate-500 select-none">•</span>
                    <span className="flex-1">{renderInlineStyles(cleanLineText(line))}</span>
                  </div>
                );
              }

              return (
                <p key={idx} className="text-slate-700 font-normal pl-1 my-1">
                  {renderInlineStyles(line)}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 2. DYNAMIC BUSINESS LETTER LAYOUT ARCHITECTURE
  if (templateId === 'letter') {
    return (
      <div 
        className="flex flex-col h-full border rounded-xl p-4 shadow-sm min-h-[500px] transition-colors duration-200"
        style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-ui)' }}
      >
        <span className="text-xs font-mono mb-2 uppercase tracking-wider transition-colors duration-200" style={{ color: 'var(--color-text-muted)' }}>
          Real-Time Canvas Preview
        </span>
        <div 
          ref={ref} 
          className="flex-1 bg-white text-slate-900 shadow-inner overflow-y-auto font-serif text-left"
          style={{ 
            minHeight: '297mm',
            paddingTop: '1in',
            paddingBottom: '1in',
            paddingLeft: '1in',
            paddingRight: '1in'
          }}
        >
          {/* Document Title Header Block */}
          <div className="border-b border-slate-300 pb-2 text-left mb-6">
            <h1 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold">
              {title.replace(/\*\*/g, '')}
            </h1>
          </div>

          {/* Letter Body Content with Traditional Spacing Rules */}
          <div className="space-y-4 text-xs leading-relaxed text-slate-800 font-normal">
            {lines.map((line, idx) => {
              if (line.toUpperCase().startsWith('**SUBJECT:') || line.toUpperCase().startsWith('SUBJECT:')) {
                return (
                  <p key={idx} className="font-bold text-slate-900 uppercase tracking-wide my-4">
                    {line.replace(/\*\*/g, '')}
                  </p>
                );
              }

              return (
                <p key={idx} className="text-justify">
                  {renderInlineStyles(line)}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 3. DYNAMIC ACADEMIC / PROJECT REPORT LAYOUT ARCHITECTURE
  if (templateId === 'report') {
    return (
      <div 
        className="flex flex-col h-full border rounded-xl p-4 shadow-sm min-h-[500px] transition-colors duration-200"
        style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-ui)' }}
      >
        <span className="text-xs font-mono mb-2 uppercase tracking-wider transition-colors duration-200" style={{ color: 'var(--color-text-muted)' }}>
          Real-Time Canvas Preview
        </span>
        <div 
          ref={ref} 
          className="flex-1 bg-white text-slate-900 shadow-inner overflow-y-auto font-sans text-left"
          style={{ 
            minHeight: '297mm',
            paddingTop: '1in',
            paddingBottom: '1in',
            paddingLeft: '1in',
            paddingRight: '1in'
          }}
        >
          {/* Formal Report Layout Header Line */}
          <div className="border-b-2 border-slate-900 pb-3 mb-6 flex justify-between items-end">
            <h2 className="text-sm font-bold tracking-tight text-slate-900 uppercase">
              {title.replace(/\*\*/g, '')}
            </h2>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Technical Report</span>
          </div>

          {/* Report Body Content Framework */}
          <div className="space-y-3 text-xs leading-relaxed text-slate-800 font-normal">
            {lines.map((line, idx) => {
              const isNumberedHeader = line.startsWith('**') && line.endsWith('**') && /^\d/.test(line.replace(/\*\*/g, ''));
              const isBulletPoint = line.startsWith('*') || line.startsWith('-');

              if (isNumberedHeader) {
                return (
                  <h3 key={idx} className="text-xs font-bold text-slate-900 uppercase tracking-wide pt-3 pb-1 mt-4 block clear-both">
                    {line.replace(/\*\*/g, '')}
                  </h3>
                );
              }

              if (isBulletPoint) {
                return (
                  <div key={idx} className="flex items-start gap-2 pl-4 text-slate-700 my-1 text-justify">
                    <span className="text-slate-900 select-none font-bold">-</span>
                    <span className="flex-1">{renderInlineStyles(cleanLineText(line))}</span>
                  </div>
                );
              }

              return (
                <p key={idx} className="text-justify indent-4 my-1.5">
                  {renderInlineStyles(line)}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 4. GENERAL FALLBACK CANVAS LAYOUT CONTAINER
  return (
    <div 
      className="flex flex-col h-full border rounded-xl p-4 shadow-sm min-h-[500px] transition-colors duration-200"
      style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-ui)' }}
    >
      <span className="text-xs font-mono mb-2 uppercase tracking-wider transition-colors duration-200" style={{ color: 'var(--color-text-muted)' }}>
        Real-Time Canvas Preview
      </span>
      <div 
        ref={ref} 
        className="flex-1 bg-white text-slate-900 shadow-inner overflow-y-auto font-sans text-left"
        style={{ 
          paddingTop: '1in',
          paddingBottom: '1in',
          paddingLeft: '1in',
          paddingRight: '1in'
        }}
      >
        <div className="border-b border-slate-300 pb-3 mb-4 text-center">
          <h2 className="text-lg font-bold tracking-tight text-slate-800 uppercase">
            {title.replace(/\*\*/g, '')}
          </h2>
        </div>
        <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
          {lines.map((line, idx) => (
            <p key={idx} className="my-1">{renderInlineStyles(line)}</p>
          ))}
        </div>
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';

export default Preview;
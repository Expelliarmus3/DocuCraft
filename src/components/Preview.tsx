'use client';
import React, { forwardRef } from 'react';
import { TemplateId } from '@/utils/types';
import { ResumeTemplate } from '../templates/ResumeTemplate';
import { LetterTemplate } from '../templates/LetterTemplate';
import { ReportTemplate } from '../templates/ReportTemplate';

interface PreviewProps {
  title: string;
  content: string;
  templateId: TemplateId;
}

const Preview = forwardRef<HTMLDivElement, PreviewProps>(({ title, content, templateId }, ref) => {
  
  const renderInlineStyles = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const cleanLineText = (line: string) => {
    return line.replace(/^[-*]\s+/, '').replace(/^#+\s+/, '').trim();
  };

  const lines = content.split('\n').map(line => line.trim()).filter(Boolean);

  const renderTemplateContent = () => {
    switch (templateId) {
      case 'resume':
        return <ResumeTemplate lines={lines} renderInlineStyles={renderInlineStyles} cleanLineText={cleanLineText} />;
      case 'letter':
        return <LetterTemplate lines={lines} renderInlineStyles={renderInlineStyles} />;
      case 'report':
        return <ReportTemplate lines={lines} renderInlineStyles={renderInlineStyles} cleanLineText={cleanLineText} />;
      default:
        return (
          <div className="space-y-2 text-xs text-slate-700 leading-relaxed font-sans">
            {lines.map((line, idx) => (
              <p key={idx} className="my-1">{renderInlineStyles(line)}</p>
            ))}
          </div>
        );
    }
  };

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
        className="flex-1 bg-white text-slate-900 shadow-inner overflow-y-auto"
        style={{ 
          minHeight: '297mm',
          paddingTop: '1in',
          paddingBottom: '1in',
          paddingLeft: '1in',
          paddingRight: '1in'
        }}
      >
        <div className={`border-b pb-2 text-left mb-5 ${templateId === 'report' ? 'border-b-2 border-slate-900' : 'border-slate-300'}`}>
          <div className="flex justify-between items-end">
            <h1 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
              {title.replace(/\*\*/g, '') || 'Untitled Project Blueprint'}
            </h1>
            {templateId === 'report' && (
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Technical Report</span>
            )}
          </div>
        </div>

        {renderTemplateContent()}
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';

export default Preview;
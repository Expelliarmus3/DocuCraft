'use client';
import React from 'react';

interface TemplateProps {
  lines: string[];
  renderInlineStyles: (text: string) => React.ReactNode[];
}

export const LetterTemplate: React.FC<TemplateProps> = ({ lines, renderInlineStyles }) => {
  return (
    <div className="font-serif text-left text-slate-800 space-y-4 text-xs leading-relaxed">
      {lines.map((line, idx) => {
        if (line.toUpperCase().startsWith('**SUBJECT:') || line.toUpperCase().startsWith('SUBJECT:')) {
          return (
            <p key={idx} className="font-bold text-slate-900 uppercase tracking-wide my-4 border-l-2 border-slate-800 pl-2">
              {line.replace(/\*\*/g, '')}
            </p>
          );
        }
        return (
          <p key={idx} className="text-justify whitespace-pre-line">
            {renderInlineStyles(line)}
          </p>
        );
      })}
    </div>
  );
};
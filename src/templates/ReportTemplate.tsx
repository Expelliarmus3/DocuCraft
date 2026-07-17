'use client';
import React from 'react';

interface TemplateProps {
  lines: string[];
  renderInlineStyles: (text: string) => React.ReactNode[];
  cleanLineText: (line: string) => string;
}

export const ReportTemplate: React.FC<TemplateProps> = ({ lines, renderInlineStyles, cleanLineText }) => {
  return (
    <div className="font-sans text-left text-slate-800 space-y-3 text-xs leading-relaxed">
      {lines.map((line, idx) => {
        const isNumberedHeader = line.startsWith('**') && line.endsWith('**') && /^\d/.test(line.replace(/\*\*/g, ''));
        const isBulletPoint = line.startsWith('*') || line.startsWith('-');

        if (isNumberedHeader) {
          return (
            <h3 key={idx} className="text-xs font-bold text-slate-900 uppercase tracking-wide pt-4 pb-1 mt-5 block border-b border-slate-100">
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
  );
};
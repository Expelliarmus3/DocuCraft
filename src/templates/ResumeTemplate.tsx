'use client';
import React from 'react';

interface TemplateProps {
  lines: string[];
  renderInlineStyles: (text: string) => React.ReactNode[];
  cleanLineText: (line: string) => string;
}

export const ResumeTemplate: React.FC<TemplateProps> = ({ lines, renderInlineStyles, cleanLineText }) => {
  const nameLine = lines.find(l => l.startsWith('**') && !l.includes('|') && !['SUMMARY', 'EDUCATION', 'EXPERIENCE', 'PROJECTS', 'SKILLS'].some(s => l.toUpperCase().includes(s))) || '';
  const contactLine = lines.find(l => l.includes('|') || l.includes('@')) || '';
  const bodyLines = lines.filter(line => line !== nameLine && line !== contactLine);

  return (
    <div className="font-sans text-left text-slate-900">
      <div className="text-left mb-5 border-b pb-3 border-slate-200">
        <h2 className="text-xl font-extrabold uppercase tracking-wide text-slate-900 mb-1">
          {nameLine ? nameLine.replace(/\*\*/g, '') : "Candidate Name"}
        </h2>
        {contactLine && (
          <p className="text-xs text-slate-600 tracking-tight">{renderInlineStyles(contactLine)}</p>
        )}
      </div>
      <div className="space-y-3 text-xs leading-relaxed">
        {bodyLines.map((line, idx) => {
          const isSectionHeader = line.startsWith('**') && line.endsWith('**');
          const isBulletPoint = line.startsWith('*') || line.startsWith('-');

          if (isSectionHeader) {
            return (
              <h3 key={idx} className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pt-3 pb-0.5 mt-4 block clear-both">
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
  );
};
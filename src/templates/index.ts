import { TemplateStyle } from '@/utils/types';

export const templates: Record<string, TemplateStyle> = {
  resume: {
    id: 'resume',
    name: 'Professional Resume',
    containerClass: 'p-12 font-sans max-w-2xl mx-auto bg-white text-gray-800',
    headingClass: 'text-3xl font-bold uppercase tracking-wide border-b-2 border-gray-900 pb-2 text-center mb-6',
    bodyClass: 'text-sm leading-relaxed space-y-4 whitespace-pre-line'
  },
  letter: {
    id: 'letter',
    name: 'Formal Business Letter',
    containerClass: 'p-16 font-serif max-w-2xl mx-auto bg-white text-gray-900',
    headingClass: 'text-xl font-semibold text-left mb-8 text-gray-800',
    bodyClass: 'text-base leading-loose space-y-6 whitespace-pre-line text-justify'
  },
  report: {
    id: 'report',
    name: 'Academic/Project Report',
    containerClass: 'p-14 font-sans max-w-2xl mx-auto bg-white text-gray-900',
    headingClass: 'text-2xl font-extrabold text-blue-900 mb-4 border-l-4 border-blue-900 pl-3',
    bodyClass: 'text-base leading-normal space-y-4 whitespace-pre-line'
  }
};
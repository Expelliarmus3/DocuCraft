export type TemplateId = 'resume' | 'letter' | 'report';

export interface DocumentData {
  title: string;
  content: string;
  templateId: TemplateId;
}

export interface TemplateStyle {
  id: TemplateId;
  name: string;
  containerClass: string;
  headingClass: string;
  bodyClass: string;
}
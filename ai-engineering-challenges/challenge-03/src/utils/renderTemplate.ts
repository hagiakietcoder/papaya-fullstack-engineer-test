import type { TemplateData } from '../types/template';

export function renderTemplate(template: string, data: TemplateData): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => data[key] ?? `{{${key}}}`);
}

export function renderSubject(subject: string, data: TemplateData): string {
  return renderTemplate(subject, data);
}

export function extractVariables(template: string): string[] {
  const matches = template.matchAll(/\{\{(\w+)\}\}/g);
  return [...new Set([...matches].map((match) => match[1]))];
}

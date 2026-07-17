import { saveAs } from 'file-saver';
import { Document, Paragraph, TextRun, Packer } from 'docx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportToDocx(title: string, content: string): Promise<void> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({ text: title, bold: true, size: 32 }),
          ],
        }),
        ...content.split('\n').map(line => new Paragraph({
          children: [new TextRun({ text: line, size: 24 })],
        }))
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${title.replace(/\s+/g, '_') || 'document'}.docx`);
}

export async function exportToPdf(element: HTMLDivElement | null, fileName: string): Promise<void> {
  if (!element) return;
  const canvas = await html2canvas(element, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save(`${fileName.replace(/\s+/g, '_') || 'document'}.pdf`);
}
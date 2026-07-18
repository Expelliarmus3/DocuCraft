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

  // 1. Temporarily back up original screen styles so the live playground UI doesn't break
  const originalWidth = element.style.width;
  const originalMaxWidth = element.style.maxWidth;
  const originalPadding = element.style.padding;
  const originalBoxShadow = element.style.boxShadow;
  const originalBackground = element.style.background;

  // 2. Force true A4 dimensions, margins, and presentation modes for the canvas capture
  element.style.width = '210mm';
  element.style.maxWidth = '210mm';
  element.style.padding = '20mm'; // Clean standard margins to stop text bleeding off the edge
  element.style.boxShadow = 'none'; // Strips out dark mode layout shadows
  element.style.background = '#ffffff'; // Guarantees a clean white printable page base

  try {
    // 3. Take a high-resolution snapshot targeted at the stabilized element area
    const canvas = await html2canvas(element, { 
      scale: 2, 
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: 0
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    const imgWidth = 210; // Full printable A4 span width
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // 4. Paint the canvas directly into the PDF frame
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${fileName.replace(/\s+/g, '_') || 'document'}.pdf`);
  } catch (error) {
    console.error('❌ PDF Generation Error:', error);
  } finally {
    // 5. Instantly restore the layout metrics back to their original state
    element.style.width = originalWidth;
    element.style.maxWidth = originalMaxWidth;
    element.style.padding = originalPadding;
    element.style.boxShadow = originalBoxShadow;
    element.style.background = originalBackground;
  }
}
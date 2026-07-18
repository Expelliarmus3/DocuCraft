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

  // 1. Temporarily back up original screen styles
  const originalWidth = element.style.width;
  const originalMaxWidth = element.style.maxWidth;
  const originalPadding = element.style.padding;
  const originalBoxShadow = element.style.boxShadow;
  const originalBackground = element.style.background;

  // 2. Force strict, stable A4 dimensions for the snapshot container
  element.style.width = '210mm';
  element.style.maxWidth = '210mm';
  element.style.padding = '20mm'; // Standard margins
  element.style.boxShadow = 'none'; // Clear interface shadows
  element.style.background = '#ffffff'; // Pristine printable background

  try {
    // 3. Capture high-res canvas payload
    const canvas = await html2canvas(element, { 
      scale: 2, 
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: 0
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    const imgWidth = 210; // Fixed A4 width[cite: 3]
    const pageHeight = 297; // Standard A4 height limit in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    // 4. Multi-page slice handling engine
    // Add the first slice onto page one
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Loop through remaining canvas heights and append new sheets as needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // 5. Trigger download payload[cite: 3]
    pdf.save(`${fileName.replace(/\s+/g, '_') || 'document'}.pdf`);
  } catch (error) {
    console.error('❌ PDF Generation Error:', error);
  } finally {
    // 6. Instantly restore responsive layout integrity[cite: 3]
    element.style.width = originalWidth;
  }
}
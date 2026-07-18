import { saveAs } from 'file-saver';
import { Document, Paragraph, TextRun, Packer } from 'docx';
import jsPDF from 'jspdf';

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

  // 1. Temporarily isolate original workspace views[cite: 3]
  const originalWidth = element.style.width;
  const originalMaxWidth = element.style.maxWidth;
  const originalPadding = element.style.padding;
  const originalBackground = element.style.background;
  const originalColor = element.style.color;

  // 2. Clamp element to strict, clean printable variables before parsing[cite: 3]
  element.style.width = '170mm'; // Shrink slightly to account for the PDF target page padding
  element.style.maxWidth = '170mm';
  element.style.padding = '0mm';
  element.style.background = '#ffffff'; // Force clean sheet backing[cite: 3]
  element.style.color = '#000000';      // Ensure clear print text clarity

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  try {
    // 3. Use native structural HTML pagination parser engine
    await pdf.html(element, {
      callback: function (doc) {
        doc.save(`${fileName.replace(/\s+/g, '_') || 'document'}.pdf`);
      },
      x: 20, // Clean 20mm left margin padding alignment
      y: 20, // Clean 20mm top margin padding alignment
      autoPaging: 'text', // Automatically monitors element nodes and cleanly splits lines across pages
      width: 170, // Matches width target definition inside container frame layout
      windowWidth: 794 // Sets viewport emulation base structure
    });
  } catch (error) {
    console.error('❌ Advanced PDF Generation Error:', error);
  } finally {
    // 4. Instantly restore pristine workspace layout classes[cite: 3]
    element.style.width = originalWidth;
    element.style.maxWidth = originalMaxWidth;
    element.style.padding = originalPadding;
    element.style.background = originalBackground;
    element.style.color = originalColor;
  }
}
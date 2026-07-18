import { saveAs } from "file-saver";
import { Document, Paragraph, TextRun, Packer } from "docx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportToDocx(
  title: string,
  content: string
): Promise<void> {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: title,
                bold: true,
                size: 32,
              }),
            ],
          }),

          ...content.split("\n").map(
            (line) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: 24,
                  }),
                ],
              })
          ),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${title.replace(/\s+/g, "_") || "document"}.docx`);
}

export async function exportToPdf(
  element: HTMLDivElement | null,
  fileName: string
): Promise<void> {
  if (!element) return;

  try {
    // Save original styles
    const original = {
      height: element.style.height,
      maxHeight: element.style.maxHeight,
      overflow: element.style.overflow,
    };

    // Expand element to full height
    element.style.height = `${element.scrollHeight}px`;
    element.style.maxHeight = "none";
    element.style.overflow = "visible";

    // Wait one frame so browser re-renders
    await new Promise((resolve) => requestAnimationFrame(resolve));

    // Capture the entire element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",

      width: element.scrollWidth,
      height: element.scrollHeight,

      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,

      scrollX: 0,
      scrollY: 0,
    });

    // Restore styles
    element.style.height = original.height;
    element.style.maxHeight = original.maxHeight;
    element.style.overflow = original.overflow;

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Remaining pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pdfHeight;
    }

    pdf.save(`${fileName.replace(/\s+/g, "_") || "document"}.pdf`);
  } catch (error) {
    console.error("PDF Export Error:", error);
  }
}
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

// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

export async function exportToPdf(
  element: HTMLDivElement | null,
  fileName: string
): Promise<void> {
  if (!element) return;

  try {
    // Clone the element instead of modifying the original
    const clone = element.cloneNode(true) as HTMLElement;

    clone.style.position = "fixed";
    clone.style.left = "-100000px";
    clone.style.top = "0";
    clone.style.width = `${element.offsetWidth}px`;

    // Important: let the content determine its own height
    clone.style.height = "auto";
    clone.style.maxHeight = "none";
    clone.style.minHeight = "0";
    clone.style.overflow = "visible";

    // Remove scrolling from every child
    clone.querySelectorAll<HTMLElement>("*").forEach((el) => {
      const style = window.getComputedStyle(el);

      if (
        style.overflow === "auto" ||
        style.overflow === "scroll" ||
        style.overflowY === "auto" ||
        style.overflowY === "scroll"
      ) {
        el.style.overflow = "visible";
        el.style.overflowY = "visible";
        el.style.maxHeight = "none";
        el.style.height = "auto";
      }
    });

    document.body.appendChild(clone);

    // Wait for browser layout
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: 0,
      width: clone.scrollWidth,
      height: clone.scrollHeight,
      windowWidth: clone.scrollWidth,
      windowHeight: clone.scrollHeight,
    });

    document.body.removeChild(clone);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const imgData = canvas.toDataURL("image/png");

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
  } catch (err) {
    console.error("PDF Export Error:", err);
  }
}
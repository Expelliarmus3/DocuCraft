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

  saveAs(
    blob,
    `${title.replace(/\s+/g, "_") || "document"}.docx`
  );
}




export async function exportToPdf(
  element: HTMLDivElement | null,
  fileName: string
): Promise<void> {

  if (!element) return;


  let clone: HTMLElement | null = null;


  try {


    // ----------------------------
    // Clone DOM
    // ----------------------------

    clone = element.cloneNode(true) as HTMLElement;


    clone.style.position = "fixed";
    clone.style.left = "-100000px";
    clone.style.top = "0";

    clone.style.width =
      `${element.clientWidth}px`;

    clone.style.height = "auto";

    clone.style.maxHeight = "none";

    clone.style.minHeight = "0";

    clone.style.overflow = "visible";


    // ----------------------------
    // ONLY remove overflow traps
    // ----------------------------

    clone
      .querySelectorAll<HTMLElement>("*")
      .forEach((el)=>{

        const style =
          window.getComputedStyle(el);


        if(
          style.overflow === "auto" ||
          style.overflow === "scroll" ||
          style.overflowY === "auto" ||
          style.overflowY === "scroll"
        ){

          el.style.overflow = "visible";

          el.style.overflowY = "visible";

          el.style.height = "auto";

          el.style.maxHeight = "none";

        }

      });



    document.body.appendChild(clone);



    // wait for layout calculation

    await new Promise((resolve)=>
      requestAnimationFrame(resolve)
    );



    // ----------------------------
    // HTML -> Canvas
    // ----------------------------

    const canvas = await html2canvas(
      clone,
      {

        scale: 2,

        useCORS:true,

        backgroundColor:"#ffffff",


        scrollX:0,

        scrollY:0,


        width:
          clone.scrollWidth,


        height:
          clone.scrollHeight,


        windowWidth:
          clone.scrollWidth,


        windowHeight:
          clone.scrollHeight,


      }
    );



    document.body.removeChild(clone);

    clone=null;



    // ----------------------------
    // PDF Creation
    // ----------------------------

    const pdf = new jsPDF({

      orientation:"portrait",

      unit:"mm",

      format:"a4",

    });



    const pdfWidth =
      pdf.internal.pageSize.getWidth();


    const pdfHeight =
      pdf.internal.pageSize.getHeight();



    const pageHeightPx =
      Math.floor(
        canvas.width *
        pdfHeight /
        pdfWidth
      );



    let offset = 0;

    let page = 0;



    while(offset < canvas.height){


      const height =
        Math.min(
          pageHeightPx,
          canvas.height - offset
        );



      const pageCanvas =
        document.createElement("canvas");


      pageCanvas.width =
        canvas.width;


      pageCanvas.height =
        height;



      const ctx =
        pageCanvas.getContext("2d");


      if(!ctx) break;



      ctx.drawImage(

        canvas,

        0,
        offset,

        canvas.width,
        height,

        0,
        0,

        canvas.width,
        height

      );



      const img =
        pageCanvas.toDataURL(
          "image/png"
        );



      const imgHeight =
        height *
        pdfWidth /
        canvas.width;



      if(page > 0){
        pdf.addPage();
      }



      pdf.addImage(

        img,

        "PNG",

        0,

        0,

        pdfWidth,

        imgHeight

      );



      offset += height;

      page++;

    }



    pdf.save(
      `${fileName.replace(/\s+/g,"_") || "document"}.pdf`
    );



  }
  catch(error){

    console.error(
      "PDF Export Error:",
      error
    );

  }
  finally{


    if(
      clone &&
      document.body.contains(clone)
    ){

      document.body.removeChild(clone);

    }

  }

}
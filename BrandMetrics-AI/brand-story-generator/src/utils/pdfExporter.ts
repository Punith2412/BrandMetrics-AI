import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Converts a hidden print container into a clean multi-page PDF
 * and triggers a browser download.
 */
export async function exportBrandKitPDF(
  elementId: string = "brand-print-package",
  fileName: string = "brand-kit.pdf"
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Print container #${elementId} not found`);
    return;
  }

  // Temporarily make it visible for capture (off-screen)
  const originalStyle = element.style.cssText;
  element.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    width: 794px;
    background: white;
    color: black;
    display: block;
    z-index: -1;
  `;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Additional pages if content is long
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(fileName);
  } catch (err) {
    console.error("PDF export failed:", err);
    throw err;
  } finally {
    // Restore original style
    element.style.cssText = originalStyle;
  }
}

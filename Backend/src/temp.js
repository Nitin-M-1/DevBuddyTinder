const fs = require('fs');
const pdf = require('pdf-img-convert');

// Path to the input PDF
const pdfPath = 'project.pdf';

// Convert all pages to image buffers
(async () => {
  try {
    const outputImages = await pdf.convert(pdfPath);

    outputImages.forEach((imageBuffer, index) => {
      fs.writeFileSync(`page-${index + 1}.png`, imageBuffer);
    });

    console.log("PDF converted to images successfully ✅");
  } catch (err) {
    console.error("Error during conversion:", err);
  }
})();
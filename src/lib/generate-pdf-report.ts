
import jsPDF from 'jspdf';
import type { Vehicle } from './types';
import { formatCurrency } from './utils';

async function imageToDataURL(url: string): Promise<string> {
  // Use a proxy or a serverless function in production to bypass CORS issues if they arise.
  // For development, many image hosts are permissive.
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error(`Failed to convert image to data URL from ${url}`, error);
    // Return a placeholder for a broken image
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QxZDVlMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIj48L2NpcmNsZT48bGluZSB4MT0iNC45MyIgeTE9IjQuOTMiIHgyPSIxOS4wNyIgeTI9IjE5LjA3Ij48L2xpbmU+PC9zdmc+';
  }
}

export async function generateVehicleReport(vehicle: Vehicle, allImages: string[]) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 20;

  // --- Header ---
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(41, 98, 255); // Primary color
  doc.text(`${vehicle.make} ${vehicle.model}`, margin, y);
  y += 8;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // Muted foreground
  doc.text(`${vehicle.year} | ${vehicle.variant}`, margin, y);
  
  y += 12;

  // --- Price ---
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(41, 98, 255);
  doc.text(formatCurrency(vehicle.price), pageWidth - margin, y, { align: 'right' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Price', pageWidth - margin, y - 5, { align: 'right' });

  y += 15;

  // --- Main Image ---
  if (vehicle.img_front) {
    try {
      const imgData = await imageToDataURL(vehicle.img_front);
      const imgProps = doc.getImageProperties(imgData);
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      doc.addImage(imgData, 'JPEG', margin, y, imgWidth, imgHeight);
      y += imgHeight + 10;
    } catch(e) {
      console.error("Failed to add main image to PDF", e);
    }
  }

  // --- Details Section ---
  const addDetailRow = (yPos: number, ...details: {label: string, value: any}[]) => {
    const colWidth = (pageWidth - margin * 2) / details.length;
    details.forEach((detail, index) => {
        if(detail.value) {
            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.text(detail.label, margin + (index * colWidth), yPos);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(30, 41, 59); // Foreground
            doc.text(String(detail.value), margin + (index * colWidth), yPos + 5);
        }
    });
    return yPos + 15;
  }

  y = addDetailRow(y, 
    { label: 'Reg. Year', value: vehicle.regYear },
    { label: 'KMs Driven', value: vehicle.kmsDriven ? `${vehicle.kmsDriven.toLocaleString('en-IN')} km` : 'N/A' },
    { label: 'Fuel Type', value: vehicle.fuelType }
  );

  y = addDetailRow(y,
    { label: 'Ownership', value: vehicle.ownership },
    { label: 'Transmission', value: vehicle.transmission },
    { label: 'Color', value: vehicle.color }
  );

  y = addDetailRow(y,
    { label: 'Insurance', value: vehicle.insurance },
    { label: 'Service History', value: vehicle.serviceHistory },
    { label: 'RTO', value: vehicle.rtoState }
  );

  if (y > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = 20;
  }
  
  // --- Image Gallery ---
  y += 5;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(41, 98, 255);
  doc.text('Vehicle Image Gallery', margin, y);
  y += 10;

  const imageSize = (pageWidth - margin * 2 - 10) / 3; // 3 images per row with 5mm gap
  let x = margin;

  for (let i = 0; i < allImages.length && i < 9; i++) {
    const imageUrl = allImages[i];
    if (y + imageSize > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
        x = margin;
    }
    try {
        const imgData = await imageToDataURL(imageUrl);
        doc.addImage(imgData, 'JPEG', x, y, imageSize, imageSize * 0.75);
    } catch(e) {
        doc.rect(x, y, imageSize, imageSize * 0.75);
        doc.text('Image failed to load', x + 5, y + 20);
    }

    x += imageSize + 5;
    if (i % 3 === 2) { // Move to next row after 3 images
        x = margin;
        y += (imageSize * 0.75) + 5;
    }
  }


  // --- Footer ---
  const pageCount = doc.internal.pages.length;
  for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
      doc.text('Report generated by Trusted Vehicles Marketplace', margin, doc.internal.pageSize.getHeight() - 10);
  }


  doc.save(`${vehicle.make}_${vehicle.model}_Report.pdf`);
}

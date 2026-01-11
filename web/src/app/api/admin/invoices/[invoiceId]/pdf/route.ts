import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import sql from '@/lib/db';
import fs from 'fs';
import path from 'path';

// Load logo from public folder
const getLogoBase64 = (): string => {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo-color.png');
    const logoBuffer = fs.readFileSync(logoPath);
    return `data:image/png;base64,${logoBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Failed to load logo:', error);
    return '';
  }
};

interface InvoiceItem {
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  line_total: number;
}

// Business information - customize this
const BUSINESS = {
  name: 'Miquel A. Riudavets Mercadal',
  nif: '41.497.721-V',
  address: 'Caseriu Trebaluger, 26 - 07720 ES CASTELL',
  phone: '656.92.13.14',
  bankAccount: 'ES XX XXXX XXXX XXXX XXXX XXXX', // Cta. La Caixa
  services: 'Arreglos de Carpinteria, Pintado y Barnizado en General (Paredes Interiores, Exteriores, y Carpinteria)',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const { invoiceId } = await params;

    // Fetch invoice with client
    const invoices = await sql`
      SELECT 
        i.id, i.number, i.issue_date, i.subtotal, i.tax_rate, i.tax_amount, i.total, i.notes, i.labor_total,
        c.name as client_name, c.nif as client_nif, c.phone as client_phone,
        c.address_line1 as client_address, c.city as client_city, c.postal_code as client_postal_code
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.id
      WHERE i.id = ${invoiceId}
    `;

    if (invoices.length === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const invoice = invoices[0];

    // Fetch invoice items
    const items = await sql`
      SELECT description, quantity, unit, unit_price, line_total
      FROM invoice_items
      WHERE invoice_id = ${invoiceId}
      ORDER BY id ASC
    ` as unknown as InvoiceItem[];

    // Create PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // Colors
    const headerGreen = '#2d5016';
    const lightGray = '#f5f5f5';
    const darkGray = '#4a4a4a';
    

    // Helper functions
    const drawLine = (y1: number, y2?: number) => {
      doc.setDrawColor(100);
      doc.setLineWidth(0.3);
      doc.line(margin, y1, pageWidth - margin, y2 ?? y1);
    };

    // ========== HEADER ==========
    // Main logo
    const logoBase64 = getLogoBase64();
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', margin, y, 30, 30);
    }

    // Business name (large, green)
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(24);
    doc.setTextColor(headerGreen);
    doc.text(BUSINESS.name, 50, y + 10);

    // Business details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(darkGray);
    doc.text(`N.I.F. ${BUSINESS.nif}`, 50, y + 18);
    doc.text(BUSINESS.address, 50, y + 23);
    doc.text(`Móvil: ${BUSINESS.phone}`, 50, y + 28);

    y += 40;

    // Invoice number and date boxes
    doc.setFillColor(lightGray);
    doc.rect(margin, y, 50, 8, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('Nº Factura:', margin + 2, y + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.text(String(invoice.number), margin + 25, y + 5.5);

    y += 12;
    doc.setFillColor(lightGray);
    doc.rect(margin, y, 50, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Fecha:', margin + 2, y + 5.5);
    doc.setFont('helvetica', 'normal');
    const issueDate = new Date(invoice.issue_date as string).toLocaleDateString('es-ES');
    doc.text(issueDate, margin + 25, y + 5.5);

    // Services description (right side)
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(headerGreen);
    const servicesX = 100;
    doc.text('Arreglos de Carpintería,', servicesX, y - 8);
    doc.text('Pintado y Barnizado en General', servicesX, y - 3);
    doc.text('(Paredes Interiores, Exteriores,', servicesX, y + 2);
    doc.text('y Carpintería)', servicesX, y + 7);

    y += 20;

    // ========== CLIENT DATA ==========
    doc.setFillColor(lightGray);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text('DATOS CLIENTE:', margin + 2, y + 5);
    y += 9;

    // Client info table
    const clientBoxHeight = 7;
    const col1Width = 25;
    const col2Width = 62;
    const col3Width = 25;
    const col4Width = contentWidth - col1Width - col2Width - col3Width;

    // Row 1: NOMBRE
    doc.setFillColor(lightGray);
    doc.rect(margin, y, col1Width, clientBoxHeight, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('NOMBRE:', margin + 2, y + 5);
    doc.rect(margin + col1Width, y, col2Width + col3Width + col4Width, clientBoxHeight, 'S');
    doc.setFont('helvetica', 'normal');
    doc.text(String(invoice.client_name || ''), margin + col1Width + 2, y + 5);
    y += clientBoxHeight;

    // Row 2: N.I.F. | TELEFONO
    doc.setFillColor(lightGray);
    doc.rect(margin, y, col1Width, clientBoxHeight, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('N.I.F.:', margin + 2, y + 5);
    doc.rect(margin + col1Width, y, col2Width, clientBoxHeight, 'S');
    doc.setFont('helvetica', 'normal');
    doc.text(String(invoice.client_nif || ''), margin + col1Width + 2, y + 5);

    doc.setFillColor(lightGray);
    doc.rect(margin + col1Width + col2Width, y, col3Width, clientBoxHeight, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('TELEFONO:', margin + col1Width + col2Width + 2, y + 5);
    doc.rect(margin + col1Width + col2Width + col3Width, y, col4Width, clientBoxHeight, 'S');
    doc.setFont('helvetica', 'normal');
    doc.text(String(invoice.client_phone || ''), margin + col1Width + col2Width + col3Width + 2, y + 5);
    y += clientBoxHeight;

    // Row 3: DOMICILIO | POBLACION
    doc.setFillColor(lightGray);
    doc.rect(margin, y, col1Width, clientBoxHeight, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('DOMICILIO:', margin + 2, y + 5);
    doc.rect(margin + col1Width, y, col2Width, clientBoxHeight, 'S');
    doc.setFont('helvetica', 'normal');
    doc.text(String(invoice.client_address || ''), margin + col1Width + 2, y + 5);

    doc.setFillColor(lightGray);
    doc.rect(margin + col1Width + col2Width, y, col3Width, clientBoxHeight, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('POBLACION:', margin + col1Width + col2Width + 2, y + 5);
    doc.rect(margin + col1Width + col2Width + col3Width, y, col4Width, clientBoxHeight, 'S');
    doc.setFont('helvetica', 'normal');
    const population = invoice.client_postal_code
      ? `${invoice.client_postal_code} ${invoice.client_city || ''}`
      : String(invoice.client_city || '');
    doc.text(population, margin + col1Width + col2Width + col3Width + 2, y + 5);
    y += clientBoxHeight + 10;

    // ========== ITEMS TABLE ==========
    const tableStartY = y;
    const colConcepto = 90;
    const colUnidad = 25;
    const colPrecio = 30;
    const colTotal = contentWidth - colConcepto - colUnidad - colPrecio;

    // Table header
    doc.setFillColor(200, 200, 200);
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('CONCEPTO', margin + colConcepto / 2, y + 5.5, { align: 'center' });
    doc.text('UNIDAD', margin + colConcepto + colUnidad / 2, y + 5.5, { align: 'center' });
    doc.text('PRECIO', margin + colConcepto + colUnidad + colPrecio / 2, y + 5.5, { align: 'center' });
    doc.text('TOTAL', margin + colConcepto + colUnidad + colPrecio + colTotal / 2, y + 5.5, { align: 'center' });
    y += 8;

    // Draw vertical lines for table
    const drawTableLines = (startY: number, endY: number) => {
      doc.setDrawColor(150);
      doc.setLineWidth(0.2);
      doc.line(margin, startY, margin, endY);
      doc.line(margin + colConcepto, startY, margin + colConcepto, endY);
      doc.line(margin + colConcepto + colUnidad, startY, margin + colConcepto + colUnidad, endY);
      doc.line(margin + colConcepto + colUnidad + colPrecio, startY, margin + colConcepto + colUnidad + colPrecio, endY);
      doc.line(pageWidth - margin, startY, pageWidth - margin, endY);
    };

    // Items
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const rowHeight = 7;
    const maxRows = 15;
    let rowCount = 0;

    for (const item of items) {
      if (rowCount >= maxRows) break;
      doc.rect(margin, y, contentWidth, rowHeight, 'S');
      doc.text(String(item.description || ''), margin + 2, y + 5);
      doc.text(String(item.unit || ''), margin + colConcepto + colUnidad / 2, y + 5, { align: 'center' });
      doc.text(Number(item.unit_price).toFixed(2), margin + colConcepto + colUnidad + colPrecio - 2, y + 5, { align: 'right' });
      doc.text(Number(item.line_total).toFixed(2), margin + contentWidth - 2, y + 5, { align: 'right' });
      y += rowHeight;
      rowCount++;
    }

    // Add labor row if exists
    const laborTotal = Number(invoice.labor_total) || 0;
    if (laborTotal > 0 && rowCount < maxRows) {
      doc.rect(margin, y, contentWidth, rowHeight, 'S');
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL MANO DE OBRA', margin + colConcepto / 2, y + 5, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.text('-', margin + colConcepto + colUnidad / 2, y + 5, { align: 'center' });
      doc.text('-', margin + colConcepto + colUnidad + colPrecio - 2, y + 5, { align: 'right' });
      doc.text(laborTotal.toFixed(2), margin + contentWidth - 2, y + 5, { align: 'right' });
      y += rowHeight;
      rowCount++;
    }

    // Empty rows to fill the table
    while (rowCount < maxRows) {
      doc.rect(margin, y, contentWidth, rowHeight, 'S');
      doc.text('-', margin + contentWidth - 2, y + 5, { align: 'right' });
      y += rowHeight;
      rowCount++;
    }

    drawTableLines(tableStartY, y);

    // ========== TOTALS ==========
    y += 5;
    const totalsX = margin + colConcepto;
    const totalsWidth = contentWidth - colConcepto;
    const valueX = pageWidth - margin - 5;

    // Base Imponible
    doc.setFillColor(200, 200, 200);
    doc.rect(totalsX, y, totalsWidth - 30, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('BASE IMPONIBLE', totalsX + (totalsWidth - 30) / 2, y + 5, { align: 'center' });
    doc.rect(pageWidth - margin - 30, y, 30, 7, 'S');
    doc.setFont('helvetica', 'normal');
    doc.text(`${Number(invoice.subtotal).toFixed(2)} €`, valueX, y + 5, { align: 'right' });
    y += 7;

    // IVA
    const taxRate = Number(invoice.tax_rate) || 21;
    doc.setFillColor(200, 200, 200);
    doc.rect(totalsX, y, totalsWidth - 30, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text(`IVA ${taxRate} %`, totalsX + (totalsWidth - 30) / 2, y + 5, { align: 'center' });
    doc.rect(pageWidth - margin - 30, y, 30, 7, 'S');
    doc.setFont('helvetica', 'normal');
    doc.text(`${Number(invoice.tax_amount).toFixed(2)} €`, valueX, y + 5, { align: 'right' });
    y += 7;

    // Total
    doc.setFillColor(200, 200, 200);
    doc.rect(totalsX, y, totalsWidth - 30, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL FACTURA - EUROS', totalsX + (totalsWidth - 30) / 2, y + 5, { align: 'center' });
    doc.rect(pageWidth - margin - 30, y, 30, 7, 'S');
    doc.text(`${Number(invoice.total).toFixed(2)} €`, valueX, y + 5, { align: 'right' });

    // Bank account (bottom left)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Cta. La Caixa -', margin, y + 5);

    // Generate PDF buffer
    const pdfBuffer = doc.output('arraybuffer');

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="factura-${invoice.number}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Error generating PDF' }, { status: 500 });
  }
}

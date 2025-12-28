import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { Response } from 'express';
import { reportService } from './reportService';

export const exportService = {
  // Export Inventory to Excel
  exportInventoryToExcel: async (res: Response) => {
    const report = await reportService.getInventoryValueReport();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory Report');

    // Set column widths
    worksheet.columns = [
      { header: 'SKU', key: 'sku', width: 15 },
      { header: 'Product Name', key: 'name', width: 30 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Supplier', key: 'supplier', width: 25 },
      { header: 'Current Stock', key: 'currentStock', width: 15 },
      { header: 'Unit Price', key: 'unitPrice', width: 15 },
      { header: 'Stock Value', key: 'stockValue', width: 15 },
      { header: 'Reorder Level', key: 'reorderLevel', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Add data
    report.products.forEach(product => {
      worksheet.addRow({
        sku: product.sku,
        name: product.name,
        category: product.category,
        supplier: product.supplier,
        currentStock: product.currentStock,
        unitPrice: product.unitPrice,
        stockValue: product.stockValue.toFixed(2),
        reorderLevel: product.reorderLevel,
        status: product.needsReorder ? 'LOW STOCK' : 'OK'
      });
    });

    // Add summary at the bottom
    worksheet.addRow([]);
    worksheet.addRow(['SUMMARY']);
    worksheet.addRow(['Total Products:', report.summary.totalProducts]);
    worksheet.addRow(['Total Stock Value:', `$${report.summary.totalStockValue}`]);
    worksheet.addRow(['Total Items:', report.summary.totalItems]);

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=inventory-report-${new Date().toISOString().split('T')[0]}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  },

  // Export Low Stock Report to Excel
  exportLowStockToExcel: async (res: Response) => {
    const report = await reportService.getLowStockReport();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Low Stock Report');

    worksheet.columns = [
      { header: 'SKU', key: 'sku', width: 15 },
      { header: 'Product Name', key: 'name', width: 30 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Supplier', key: 'supplier', width: 25 },
      { header: 'Current Stock', key: 'currentStock', width: 15 },
      { header: 'Reorder Level', key: 'reorderLevel', width: 15 },
      { header: 'Deficit', key: 'deficit', width: 15 },
      { header: 'Unit Price', key: 'unitPrice', width: 15 },
      { header: 'Reorder Cost', key: 'reorderCost', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF0000' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Add data with conditional formatting
    report.products.forEach(product => {
      const row = worksheet.addRow({
        sku: product.sku,
        name: product.name,
        category: product.category,
        supplier: product.supplier,
        currentStock: product.currentStock,
        reorderLevel: product.reorderLevel,
        deficit: product.deficit,
        unitPrice: product.unitPrice,
        reorderCost: product.estimatedReorderCost.toFixed(2),
        status: product.status
      });

      // Highlight out of stock in red
      if (product.currentStock === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFC7CE' }
        };
      }
    });

    // Add summary
    worksheet.addRow([]);
    worksheet.addRow(['SUMMARY']);
    worksheet.addRow(['Total Low Stock Products:', report.summary.totalLowStockProducts]);
    worksheet.addRow(['Out of Stock:', report.summary.outOfStock]);
    worksheet.addRow(['Total Reorder Cost:', `$${report.summary.totalEstimatedReorderCost}`]);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=low-stock-report-${new Date().toISOString().split('T')[0]}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  },

  // Export Stock Movements to Excel
  exportStockMovementsToExcel: async (res: Response, startDate: Date, endDate: Date) => {
    const report = await reportService.getStockMovementReport(startDate, endDate);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Stock Movements');

    worksheet.columns = [
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Product', key: 'product', width: 30 },
      { header: 'SKU', key: 'sku', width: 15 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Quantity', key: 'quantity', width: 15 },
      { header: 'Notes', key: 'notes', width: 40 },
      { header: 'Created By', key: 'createdBy', width: 20 }
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    report.movements.forEach(movement => {
      worksheet.addRow({
        date: new Date(movement.createdAt).toLocaleString(),
        product: movement.product.name,
        sku: movement.product.sku,
        type: movement.type,
        quantity: movement.quantity,
        notes: movement.notes || '',
        createdBy: movement.createdBy
      });
    });

    // Add summary
    worksheet.addRow([]);
    worksheet.addRow(['SUMMARY']);
    worksheet.addRow(['Total Movements:', report.totalMovements]);
    Object.entries(report.summaryByType).forEach(([type, data]: [string, any]) => {
      worksheet.addRow([`${type}:`, `Count: ${data.count}, Quantity: ${data.totalQuantity}`]);
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=stock-movements-${startDate.toISOString().split('T')[0]}-to-${endDate.toISOString().split('T')[0]}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  },

  // Export to PDF
  exportInventoryToPDF: async (res: Response) => {
    const report = await reportService.getInventoryValueReport();

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=inventory-report-${new Date().toISOString().split('T')[0]}.pdf`
    );

    doc.pipe(res);

    // Title
    doc.fontSize(20).text('Inventory Value Report', { align: 'center' });
    doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown();

    // Summary Box
    doc.fontSize(14).text('Summary', { underline: true });
    doc.fontSize(11);
    doc.text(`Total Products: ${report.summary.totalProducts}`);
    doc.text(`Total Stock Value: $${report.summary.totalStockValue}`);
    doc.text(`Total Items: ${report.summary.totalItems}`);
    doc.moveDown();

    // Category Breakdown
    doc.fontSize(14).text('By Category', { underline: true });
    doc.fontSize(10);
    report.byCategory.forEach((cat: any) => {
      doc.text(
        `${cat.category}: ${cat.products} products, ${cat.totalQuantity} items, $${cat.totalValue.toFixed(2)}`
      );
    });
    doc.moveDown();

    // Products Table Header
    doc.fontSize(14).text('Products', { underline: true });
    doc.fontSize(9);

    let y = doc.y;
    const tableTop = y;
    const col1 = 50;
    const col2 = 150;
    const col3 = 250;
    const col4 = 320;
    const col5 = 390;
    const col6 = 460;

    // Table Header
    doc.font('Helvetica-Bold');
    doc.text('SKU', col1, tableTop);
    doc.text('Product', col2, tableTop);
    doc.text('Category', col3, tableTop);
    doc.text('Stock', col4, tableTop);
    doc.text('Price', col5, tableTop);
    doc.text('Value', col6, tableTop);
    doc.font('Helvetica');

    // Draw line under header
    doc.moveTo(col1, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    y = tableTop + 20;

    // Table Rows
    report.products.slice(0, 30).forEach((product: any) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      doc.text(product.sku, col1, y, { width: 90 });
      doc.text(product.name, col2, y, { width: 90 });
      doc.text(product.category, col3, y, { width: 60 });
      doc.text(product.currentStock.toString(), col4, y);
      doc.text(`$${product.unitPrice.toFixed(2)}`, col5, y);
      doc.text(`$${product.stockValue.toFixed(2)}`, col6, y);

      y += 20;
    });

    doc.end();
  }
};
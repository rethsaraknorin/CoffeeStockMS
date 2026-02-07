import nodemailer from 'nodemailer';
import { reportService } from './reportService';

// Configure email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

export const notificationService = {
  sendApprovalRequestEmail: async (
    recipientEmail: string,
    payload: { username: string; email: string; approvalUrl: string }
  ) => {
    const transporter = createTransporter();

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h2 style="color: #2c3e50;">New User Approval Needed</h2>
          <p>A new user has signed up and needs admin approval.</p>
          <ul>
            <li><strong>Username:</strong> ${payload.username}</li>
            <li><strong>Email:</strong> ${payload.email}</li>
          </ul>
          <p>
            <a href="${payload.approvalUrl}" style="display:inline-block;padding:10px 14px;background:#2c3e50;color:#fff;text-decoration:none;border-radius:6px;">
              Approve User
            </a>
          </p>
          <p style="color:#666;margin-top:20px;">
            If the button doesn't work, copy and paste this link:
            <br />
            ${payload.approvalUrl}
          </p>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: recipientEmail,
      subject: 'Admin Approval Required - New User Signup',
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    return { message: 'Approval email sent' };
  },
  // Send Low Stock Alert Email
  sendLowStockAlert: async (recipientEmail: string) => {
    const report = await reportService.getLowStockReport();

    if (report.summary.totalLowStockProducts === 0) {
      return { message: 'No low stock products to report' };
    }

    const transporter = createTransporter();

    // Build HTML email
    let productsHTML = report.products.map(p => `
      <tr style="${p.status === 'OUT_OF_STOCK' ? 'background-color: #ffcccc;' : ''}">
        <td style="padding: 8px; border: 1px solid #ddd;">${p.name}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${p.sku}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${p.currentStock}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${p.reorderLevel}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${p.deficit}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">$${p.estimatedReorderCost.toFixed(2)}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${p.status}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h2 style="color: #d9534f;">⚠️ Low Stock Alert</h2>
          <p>This is an automated alert about products that are running low on stock.</p>
          
          <h3>Summary</h3>
          <ul>
            <li><strong>Total Low Stock Products:</strong> ${report.summary.totalLowStockProducts}</li>
            <li><strong>Out of Stock:</strong> ${report.summary.outOfStock}</li>
            <li><strong>Estimated Reorder Cost:</strong> $${report.summary.totalEstimatedReorderCost}</li>
          </ul>

          <h3>Products Requiring Attention</h3>
          <table style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">SKU</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Current</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Reorder</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Deficit</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Cost</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${productsHTML}
            </tbody>
          </table>

          <p style="margin-top: 20px; color: #666;">
            <small>Generated: ${new Date().toLocaleString()}</small>
          </p>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: recipientEmail,
      subject: `⚠️ Low Stock Alert - ${report.summary.totalLowStockProducts} Products Need Attention`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);

    return {
      message: 'Low stock alert email sent successfully',
      productsCount: report.summary.totalLowStockProducts
    };
  },

  // Send Daily Summary Email
  sendDailySummary: async (recipientEmail: string) => {
    const dashboard = await reportService.getDashboardOverview();
    const transporter = createTransporter();

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h2 style="color: #5cb85c;">📊 Daily Inventory Summary</h2>
          <p>Here's your daily inventory snapshot for ${new Date().toLocaleDateString()}.</p>
          
          <h3>Overview</h3>
          <table style="border-collapse: collapse;">
            <tr>
              <td style="padding: 8px;"><strong>Total Products:</strong></td>
              <td style="padding: 8px;">${dashboard.overview.totalProducts}</td>
            </tr>
            <tr>
              <td style="padding: 8px;"><strong>Total Stock Value:</strong></td>
              <td style="padding: 8px;">$${dashboard.overview.totalStockValue}</td>
            </tr>
            <tr style="${dashboard.overview.lowStockCount > 0 ? 'background-color: #fff3cd;' : ''}">
              <td style="padding: 8px;"><strong>Low Stock Products:</strong></td>
              <td style="padding: 8px;">${dashboard.overview.lowStockCount}</td>
            </tr>
            <tr style="${dashboard.overview.outOfStockCount > 0 ? 'background-color: #f8d7da;' : ''}">
              <td style="padding: 8px;"><strong>Out of Stock:</strong></td>
              <td style="padding: 8px;">${dashboard.overview.outOfStockCount}</td>
            </tr>
          </table>

          <h3>Today's Activity</h3>
          <p><strong>Stock Movements:</strong> ${dashboard.movements.today}</p>
          
          <h3>This Month</h3>
          <p><strong>Total Movements:</strong> ${dashboard.movements.thisMonth}</p>

          ${dashboard.overview.lowStockCount > 0 ? `
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <h4 style="color: #856404; margin-top: 0;">⚠️ Action Required</h4>
              <p>You have ${dashboard.overview.lowStockCount} products running low on stock.</p>
            </div>
          ` : ''}

          <p style="margin-top: 20px; color: #666;">
            <small>Generated: ${new Date().toLocaleString()}</small>
          </p>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: recipientEmail,
      subject: `📊 Daily Inventory Summary - ${new Date().toLocaleDateString()}`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);

    return { message: 'Daily summary email sent successfully' };
  }
};

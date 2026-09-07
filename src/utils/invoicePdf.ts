import { format } from 'date-fns';
import type { Invoice } from '@/types/invoice';

export function printInvoiceDocument(invoice: Invoice): void {
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) {
    window.print();
    return;
  }

  const currencyFormatter = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { padding: 40px; color: #1a1a1a; background: #fff; line-height: 1.5; font-size: 14px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #5e6ad2; padding-bottom: 24px; margin-bottom: 32px; }
        .logo { font-size: 24px; font-weight: 800; color: #5e6ad2; letter-spacing: -0.5px; }
        .invoice-title { text-align: right; }
        .invoice-title h1 { font-size: 28px; font-weight: 700; color: #111; margin-bottom: 4px; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .badge-paid { background: #dcfce7; color: #15803d; }
        .badge-pending { background: #fef9c3; color: #a16207; }
        .badge-overdue { background: #fee2e2; color: #b91c1c; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
        .meta-label { font-size: 11px; text-transform: uppercase; color: #666; font-weight: 600; margin-bottom: 4px; }
        .meta-value { font-size: 14px; font-weight: 500; color: #111; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
        th { text-align: left; padding: 10px 12px; background: #f8fafc; border-bottom: 2px solid #e2e8f0; font-size: 12px; text-transform: uppercase; color: #475569; }
        td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
        .text-right { text-align: right; }
        .totals { margin-left: auto; width: 300px; }
        .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #475569; }
        .totals-row.grand-total { border-top: 2px solid #5e6ad2; margin-top: 8px; padding-top: 10px; font-size: 16px; font-weight: 700; color: #111; }
        .footer { margin-top: 60px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">FREIGHTFOX</div>
          <p style="color: #64748b; font-size: 12px; margin-top: 4px;">Automated Freight & Invoice Solutions</p>
        </div>
        <div class="invoice-title">
          <h1>INVOICE</h1>
          <p class="meta-value">${invoice.invoiceNumber}</p>
          <div style="margin-top: 6px;">
            <span class="badge badge-${invoice.status.toLowerCase()}">${invoice.status}</span>
          </div>
        </div>
      </div>

      <div class="grid">
        <div>
          <div class="meta-label">Billed To</div>
          <div class="meta-value" style="font-size: 15px; font-weight: 600;">${invoice.clientName}</div>
          <div style="color: #64748b; margin-top: 2px;">${invoice.clientAddress}</div>
          <div style="color: #64748b;">${invoice.clientEmail}</div>
        </div>
        <div style="text-align: right;">
          <div style="margin-bottom: 12px;">
            <div class="meta-label">Invoice Date</div>
            <div class="meta-value">${format(new Date(invoice.date), 'MMM dd, yyyy')}</div>
          </div>
          <div>
            <div class="meta-label">Due Date</div>
            <div class="meta-value">${format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</div>
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="text-right">Qty / Hours</th>
            <th class="text-right">Rate</th>
            <th class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.lineItems.map(item => `
            <tr>
              <td style="font-weight: 500;">${item.description}</td>
              <td class="text-right">${item.quantity}</td>
              <td class="text-right">${currencyFormatter(item.rate)}</td>
              <td class="text-right font-medium">${currencyFormatter(item.amount)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <div class="totals-row">
          <span>Subtotal:</span>
          <span>${currencyFormatter(invoice.subtotal)}</span>
        </div>
        <div class="totals-row">
          <span>Tax (10%):</span>
          <span>${currencyFormatter(invoice.tax)}</span>
        </div>
        <div class="totals-row grand-total">
          <span>Total Due:</span>
          <span>${currencyFormatter(invoice.total)}</span>
        </div>
      </div>

      <div class="footer">
        <p>Thank you for your business. For billing queries, contact support@freightfox.ai</p>
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

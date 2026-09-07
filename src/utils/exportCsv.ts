import { format } from 'date-fns';
import type { Invoice } from '@/types/invoice';

function escapeCsv(val: string | number | undefined | null): string {
  const stringVal = String(val ?? '');
  if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
    return `"${stringVal.replace(/"/g, '""')}"`;
  }
  return stringVal;
}

function downloadBlob(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportInvoicesToCsv(invoices: Invoice[], filenamePrefix = 'invoices'): void {
  if (invoices.length === 0) return;

  const headers = [
    'Invoice Number',
    'Client Name',
    'Client Email',
    'Client Address',
    'Date',
    'Due Date',
    'Status',
    'Subtotal',
    'Tax',
    'Total'
  ];

  const rows = invoices.map(inv => [
    escapeCsv(inv.invoiceNumber),
    escapeCsv(inv.clientName),
    escapeCsv(inv.clientEmail),
    escapeCsv(inv.clientAddress),
    escapeCsv(format(new Date(inv.date), 'yyyy-MM-dd')),
    escapeCsv(format(new Date(inv.dueDate), 'yyyy-MM-dd')),
    escapeCsv(inv.status),
    inv.subtotal.toFixed(2),
    inv.tax.toFixed(2),
    inv.total.toFixed(2),
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
  const filename = `${filenamePrefix}_${format(new Date(), 'yyyy-MM-dd_HHmm')}.csv`;
  downloadBlob(csvContent, filename);
}

export function exportSingleInvoiceToCsv(invoice: Invoice): void {
  const headers = ['Invoice Number', 'Client', 'Date', 'Due Date', 'Status', 'Total'];
  const row = [
    escapeCsv(invoice.invoiceNumber),
    escapeCsv(invoice.clientName),
    escapeCsv(format(new Date(invoice.date), 'yyyy-MM-dd')),
    escapeCsv(format(new Date(invoice.dueDate), 'yyyy-MM-dd')),
    escapeCsv(invoice.status),
    invoice.total.toFixed(2),
  ].join(',');

  const csvContent = [headers.join(','), row].join('\n');
  downloadBlob(csvContent, `${invoice.invoiceNumber}.csv`);
}

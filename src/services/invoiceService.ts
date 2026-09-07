import type { DashboardStats, Invoice } from '@/types/invoice';
import { mockInvoices } from '@/data/mockData';

// Instant in-memory mock service (zero artificial delay)
let invoices = [...mockInvoices];

export const invoiceService = {
  async getInvoices(): Promise<Invoice[]> {
    return [...invoices];
  },

  async getInvoiceById(id: string): Promise<Invoice | null> {
    const invoice = invoices.find(inv => inv.id === id);
    return invoice ? { ...invoice } : null;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    return invoices.reduce((stats, invoice) => {
      stats.totalInvoices += 1;
      stats.totalAmount += invoice.total;
      
      if (invoice.status === 'Paid') {
        stats.paidAmount += invoice.total;
        stats.paidCount += 1;
      } else if (invoice.status === 'Pending') {
        stats.pendingAmount += invoice.total;
        stats.pendingCount += 1;
      } else if (invoice.status === 'Overdue') {
        stats.overdueAmount += invoice.total;
        stats.overdueCount += 1;
      }
      
      return stats;
    }, {
      totalInvoices: 0,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      overdueAmount: 0,
      paidCount: 0,
      pendingCount: 0,
      overdueCount: 0,
    });
  },

  async updateInvoiceStatus(id: string, status: Invoice['status']): Promise<Invoice> {
    const index = invoices.findIndex(inv => inv.id === id);
    if (index === -1) throw new Error('Invoice not found');
    
    invoices[index] = { ...invoices[index], status };
    return { ...invoices[index] };
  },

  async deleteInvoices(ids: string[]): Promise<void> {
    invoices = invoices.filter(inv => !ids.includes(inv.id));
  }
};

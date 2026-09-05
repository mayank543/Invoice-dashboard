import type { Invoice, InvoiceStatus } from '@/types/invoice';

const generateMockInvoices = (): Invoice[] => {
  const invoices: Invoice[] = [];
  const statuses: InvoiceStatus[] = ['Paid', 'Pending', 'Overdue'];
  const companies = ['Acme Corp', 'Globex', 'Soylent Corp', 'Initech', 'Umbrella Corp', 'Stark Industries', 'Wayne Enterprises', 'Massive Dynamic'];

  for (let i = 1; i <= 50; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    
    // Dates relative to today
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - Math.floor(Math.random() * 30));
    
    const dueDateObj = new Date(dateObj);
    dueDateObj.setDate(dueDateObj.getDate() + 15);

    if (status === 'Overdue') {
      dueDateObj.setDate(new Date().getDate() - Math.floor(Math.random() * 10) - 1);
    } else if (status === 'Pending') {
      dueDateObj.setDate(new Date().getDate() + Math.floor(Math.random() * 10) + 1);
    }

    const lineItems = [
      {
        id: `item-${i}-1`,
        description: 'Web Development Services',
        quantity: Math.floor(Math.random() * 40) + 10,
        rate: 150,
        amount: 0,
      },
      {
        id: `item-${i}-2`,
        description: 'UI/UX Design',
        quantity: Math.floor(Math.random() * 20) + 5,
        rate: 120,
        amount: 0,
      }
    ];

    let subtotal = 0;
    lineItems.forEach(item => {
      item.amount = item.quantity * item.rate;
      subtotal += item.amount;
    });

    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    invoices.push({
      id: `INV-${1000 + i}`,
      invoiceNumber: `INV-${1000 + i}`,
      clientName: company,
      clientEmail: `billing@${company.toLowerCase().replace(' ', '')}.com`,
      clientAddress: `${100 + i} Business Rd, Suite ${i}, Tech City`,
      date: dateObj.toISOString(),
      dueDate: dueDateObj.toISOString(),
      status,
      subtotal,
      tax,
      total,
      lineItems
    });
  }

  // Sort descending by date initially
  return invoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const mockInvoices = generateMockInvoices();

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useInvoiceDetails } from '@/hooks/useInvoices';
import { useRole } from '@/context/RoleContext';
import { invoiceService } from '@/services/invoiceService';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { format } from 'date-fns';
import { ArrowLeft, Download, Printer, ChevronDown, Check, FileSpreadsheet } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ThinkingOrb } from 'thinking-orbs';
import { printInvoiceDocument } from '@/utils/invoicePdf';
import { exportSingleInvoiceToCsv } from '@/utils/exportCsv';
import type { InvoiceStatus } from '@/types/invoice';

export function InvoiceDetails() {
  const { id } = useParams<{ id: string }>();
  const { invoice: initialInvoice, loading, error } = useInvoiceDetails(id);
  const { permissions } = useRole();
  const [currentInvoice, setCurrentInvoice] = useState(initialInvoice);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Sync state when initialInvoice loads
  const invoice = currentInvoice || initialInvoice;

  const handleStatusChange = async (newStatus: InvoiceStatus) => {
    if (!invoice || updatingStatus || !permissions.canEditStatus) return;
    try {
      setUpdatingStatus(true);
      const updated = await invoiceService.updateInvoiceStatus(invoice.id, newStatus);
      setCurrentInvoice(updated);
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-72 items-center justify-center gap-4 text-ink-subtle">
        <ThinkingOrb state="searching" size={64} />
        <span className="text-xs font-medium text-ink-subtle tracking-wide">Loading invoice details...</span>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h2 className="text-display-md text-ink">Invoice Not Found</h2>
        <p className="text-ink-subtle">{error || 'Unable to locate the specified invoice.'}</p>
        <Link to="/invoices" className={buttonVariants()}>Back to Invoices</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/invoices" className={buttonVariants({ variant: "outline", size: "icon" })}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-headline text-ink font-semibold">Invoice {invoice.invoiceNumber}</h2>
              
              {/* Role-based status dropdown or static badge */}
              {permissions.canEditStatus ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
                      <StatusBadge status={invoice.status} />
                      <ChevronDown className="h-3 w-3 text-ink-subtle" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-surface-2 border-border text-ink">
                    {(['Paid', 'Pending', 'Overdue'] as InvoiceStatus[]).map((st) => (
                      <DropdownMenuItem
                        key={st}
                        onClick={() => handleStatusChange(st)}
                        className={`text-xs cursor-pointer flex items-center justify-between ${
                          invoice.status === st ? 'text-primary font-medium bg-surface-3' : 'text-ink'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <StatusBadge status={st} />
                        </div>
                        {invoice.status === st && <Check className="h-3.5 w-3.5 text-primary ml-2" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <StatusBadge status={invoice.status} />
              )}
            </div>
            <p className="text-body-sm text-ink-subtle mt-1">
              Created on {format(new Date(invoice.date), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => exportSingleInvoiceToCsv(invoice)}
            className="border-border bg-surface-1 text-ink hover:bg-surface-2 text-xs"
          >
            <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5 text-ink-subtle" />
            CSV
          </Button>
          <Button 
            variant="outline"
            onClick={() => printInvoiceDocument(invoice)}
            className="border-border bg-surface-1 text-ink hover:bg-surface-2 text-xs"
          >
            <Printer className="mr-1.5 h-3.5 w-3.5 text-ink-subtle" />
            Print
          </Button>
          <Button 
            onClick={() => printInvoiceDocument(invoice)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors text-xs"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-surface-1 border-border">
          <CardHeader>
            <CardTitle className="text-card-title text-ink font-medium">Bill To</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body font-medium text-ink">{invoice.clientName}</p>
            <p className="text-body-sm text-ink-subtle mt-1">{invoice.clientAddress}</p>
            <p className="text-body-sm text-ink-subtle mt-1">{invoice.clientEmail}</p>
          </CardContent>
        </Card>
        <Card className="bg-surface-1 border-border">
          <CardHeader>
            <CardTitle className="text-card-title text-ink font-medium">Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-body-sm text-ink-subtle">Due Date</span>
              <span className="text-body font-medium text-ink">{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-body-sm text-ink-subtle">Amount Due</span>
              <span className="text-body font-medium font-mono text-ink">{formatCurrency(invoice.total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-surface-1 border-border">
        <CardHeader>
          <CardTitle className="text-card-title text-ink font-medium">Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-surface-2/40 hover:bg-transparent">
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.lineItems.map((item) => (
                <TableRow key={item.id} className="border-b border-border hover:bg-surface-2/30">
                  <TableCell className="font-medium text-ink">{item.description}</TableCell>
                  <TableCell className="text-right text-ink-subtle">{item.quantity}</TableCell>
                  <TableCell className="text-right font-mono text-ink-subtle">{formatCurrency(item.rate)}</TableCell>
                  <TableCell className="text-right font-medium font-mono text-ink">{formatCurrency(item.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-8 flex justify-end">
            <div className="w-full max-w-sm space-y-3">
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-ink-subtle text-body-sm">Subtotal</span>
                <span className="text-ink font-mono font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-ink-subtle text-body-sm">Tax (10%)</span>
                <span className="text-ink font-mono font-medium">{formatCurrency(invoice.tax)}</span>
              </div>
              <div className="flex justify-between text-headline text-ink pt-2 font-semibold">
                <span>Total</span>
                <span className="font-mono text-primary">{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

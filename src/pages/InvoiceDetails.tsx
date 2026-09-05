import { useParams, Link } from 'react-router-dom';
import { useInvoiceDetails } from '@/hooks/useInvoices';
import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { format } from 'date-fns';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function InvoiceDetails() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading, error } = useInvoiceDetails(id);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-[250px]" />
        </div>
        <Card>
          <CardHeader><Skeleton className="h-6 w-[150px]" /></CardHeader>
          <CardContent><Skeleton className="h-[200px] w-full" /></CardContent>
        </Card>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h2 className="text-display-md text-ink">Invoice Not Found</h2>
        <p className="text-ink-subtle">{error}</p>
          <Link to="/invoices" className={buttonVariants()}>Back to Invoices</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/invoices" className={buttonVariants({ variant: "outline", size: "icon" })}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-4">
              <h2 className="text-headline text-ink">Invoice {invoice.invoiceNumber}</h2>
              <StatusBadge status={invoice.status} />
            </div>
            <p className="text-body-sm text-ink-subtle mt-1">
              Created on {format(new Date(invoice.date), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-card-title text-ink">Bill To</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body font-medium text-ink">{invoice.clientName}</p>
            <p className="text-body-sm text-ink-subtle mt-1">{invoice.clientAddress}</p>
            <p className="text-body-sm text-ink-subtle mt-1">{invoice.clientEmail}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-card-title text-ink">Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-body-sm text-ink-subtle">Due Date</span>
              <span className="text-body font-medium text-ink">{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-body-sm text-ink-subtle">Amount Due</span>
              <span className="text-body font-medium text-ink">{formatCurrency(invoice.total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-card-title text-ink">Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.lineItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.rate)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-8 flex justify-end">
            <div className="w-full max-w-sm space-y-4">
              <div className="flex justify-between border-b border-border pb-4">
                <span className="text-ink-subtle text-body-sm">Subtotal</span>
                <span className="text-ink text-body font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-4">
                <span className="text-ink-subtle text-body-sm">Tax (10%)</span>
                <span className="text-ink text-body font-medium">{formatCurrency(invoice.tax)}</span>
              </div>
              <div className="flex justify-between text-headline text-ink pt-2">
                <span>Total</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

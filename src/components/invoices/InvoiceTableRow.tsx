import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Eye, Download, MoreHorizontal, Trash } from 'lucide-react';
import type { Invoice } from '@/types/invoice';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Checkbox } from '@/components/ui/checkbox';
import { TableRow, TableCell } from '@/components/ui/table';
import { buttonVariants } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface InvoiceTableRowProps {
  invoice: Invoice;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onExportSingle: (invoice: Invoice) => void;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const InvoiceTableRow: React.FC<InvoiceTableRowProps> = React.memo(({
  invoice,
  isSelected,
  onToggleSelect,
  onDelete,
  onExportSingle,
}) => {
  return (
    <TableRow 
      data-state={isSelected && "selected"}
      className="hover:bg-surface-2/40 transition-colors border-b border-border"
    >
      <TableCell className="text-center">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(invoice.id)}
          aria-label={`Select invoice ${invoice.invoiceNumber}`}
        />
      </TableCell>
      <TableCell className="font-mono text-xs font-medium text-ink">
        <Link to={`/invoices/${invoice.id}`} className="hover:text-primary transition-colors">
          {invoice.invoiceNumber}
        </Link>
      </TableCell>
      <TableCell className="font-medium text-ink">{invoice.clientName}</TableCell>
      <TableCell className="text-ink-subtle text-xs">{format(new Date(invoice.date), 'MMM dd, yyyy')}</TableCell>
      <TableCell>
        <StatusBadge status={invoice.status} />
      </TableCell>
      <TableCell className="text-right font-medium font-mono text-ink">
        {currencyFormatter.format(invoice.total)}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8 text-ink-subtle hover:text-ink hover:bg-surface-2" })}>
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-surface-2 border-border text-ink">
            <DropdownMenuItem className="p-0">
              <Link to={`/invoices/${invoice.id}`} className="flex w-full items-center text-xs px-2 py-1.5 cursor-pointer">
                <Eye className="mr-2 h-3.5 w-3.5 text-ink-subtle" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onExportSingle(invoice)}
              className="text-xs cursor-pointer"
            >
              <Download className="mr-2 h-3.5 w-3.5 text-ink-subtle" />
              Download CSV
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(invoice.id)}
              className="text-xs text-destructive hover:text-destructive cursor-pointer"
            >
              <Trash className="mr-2 h-3.5 w-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
});

InvoiceTableRow.displayName = 'InvoiceTableRow';

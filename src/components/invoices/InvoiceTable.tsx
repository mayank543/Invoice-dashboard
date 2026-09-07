import React from 'react';
import type { Invoice, SortField, SortOrder } from '@/types/invoice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { InvoiceTableRow } from './InvoiceTableRow';

interface InvoiceTableProps {
  invoices: Invoice[];
  selectedIds: Set<string>;
  isAllPageSelected: boolean;
  onTogglePageSelection: () => void;
  onToggleSelect: (id: string) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onDeleteSingle: (id: string) => void;
  onExportSingle: (invoice: Invoice) => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = React.memo(({
  invoices,
  selectedIds,
  isAllPageSelected,
  onTogglePageSelection,
  onToggleSelect,
  sortField,
  sortOrder,
  onSort,
  onDeleteSingle,
  onExportSingle,
}) => {
  return (
    <div className="rounded-lg border border-border bg-surface-1 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-surface-2/40 hover:bg-transparent">
            <TableHead className="w-12 text-center">
              <Checkbox 
                checked={isAllPageSelected}
                onCheckedChange={onTogglePageSelection}
                aria-label="Select all on page"
              />
            </TableHead>
            <TableHead>Invoice</TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => onSort('clientName')} 
                className={`-ml-2.5 h-8 text-xs font-medium hover:text-ink ${
                  sortField === 'clientName' ? 'text-primary' : 'text-ink-subtle'
                }`}
              >
                Client
                {sortField === 'clientName' ? (
                  sortOrder === 'asc' ? <ArrowUp className="ml-1.5 h-3.5 w-3.5" /> : <ArrowDown className="ml-1.5 h-3.5 w-3.5" />
                ) : (
                  <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => onSort('date')} 
                className={`-ml-2.5 h-8 text-xs font-medium hover:text-ink ${
                  sortField === 'date' ? 'text-primary' : 'text-ink-subtle'
                }`}
              >
                Date
                {sortField === 'date' ? (
                  sortOrder === 'asc' ? <ArrowUp className="ml-1.5 h-3.5 w-3.5" /> : <ArrowDown className="ml-1.5 h-3.5 w-3.5" />
                ) : (
                  <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => onSort('status')} 
                className={`-ml-2.5 h-8 text-xs font-medium hover:text-ink ${
                  sortField === 'status' ? 'text-primary' : 'text-ink-subtle'
                }`}
              >
                Status
                {sortField === 'status' ? (
                  sortOrder === 'asc' ? <ArrowUp className="ml-1.5 h-3.5 w-3.5" /> : <ArrowDown className="ml-1.5 h-3.5 w-3.5" />
                ) : (
                  <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                )}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button 
                variant="ghost" 
                onClick={() => onSort('total')} 
                className={`-mr-2.5 h-8 text-xs font-medium justify-end w-full hover:text-ink ${
                  sortField === 'total' ? 'text-primary' : 'text-ink-subtle'
                }`}
              >
                Amount
                {sortField === 'total' ? (
                  sortOrder === 'asc' ? <ArrowUp className="ml-1.5 h-3.5 w-3.5" /> : <ArrowDown className="ml-1.5 h-3.5 w-3.5" />
                ) : (
                  <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                )}
              </Button>
            </TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-ink-subtle">
                No invoices found matching your criteria.
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <InvoiceTableRow
                key={invoice.id}
                invoice={invoice}
                isSelected={selectedIds.has(invoice.id)}
                onToggleSelect={onToggleSelect}
                onDelete={onDeleteSingle}
                onExportSingle={onExportSingle}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
});

InvoiceTable.displayName = 'InvoiceTable';

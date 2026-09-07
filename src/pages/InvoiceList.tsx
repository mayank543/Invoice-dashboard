import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInvoices } from '@/hooks/useInvoices';
import type { InvoiceStatus } from '@/types/invoice';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Eye, 
  MoreHorizontal, 
  Search, 
  Trash,
  Check
} from 'lucide-react';

type SortField = 'date' | 'dueDate' | 'clientName' | 'total' | 'status';
type SortOrder = 'asc' | 'desc';

interface SortOption {
  label: string;
  field: SortField;
  order: SortOrder;
}

const SORT_OPTIONS: SortOption[] = [
  { label: 'Date: Newest first', field: 'date', order: 'desc' },
  { label: 'Date: Oldest first', field: 'date', order: 'asc' },
  { label: 'Amount: High to Low', field: 'total', order: 'desc' },
  { label: 'Amount: Low to High', field: 'total', order: 'asc' },
  { label: 'Client: A → Z', field: 'clientName', order: 'asc' },
  { label: 'Client: Z → A', field: 'clientName', order: 'desc' },
  { label: 'Due Date: Earliest first', field: 'dueDate', order: 'asc' },
  { label: 'Due Date: Latest first', field: 'dueDate', order: 'desc' },
  { label: 'Status: A → Z', field: 'status', order: 'asc' },
];

export function InvoiceList() {
  const { invoices, loading, deleteInvoices } = useInvoices();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'All'>('All');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset to first page when search, status, or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter(inv => {
        const matchesSearch = 
          inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
          inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let aVal: any = a[sortField];
        let bVal: any = b[sortField];

        if (sortField === 'date' || sortField === 'dueDate') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }

        if (typeof aVal === 'string') {
          return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [invoices, searchTerm, statusFilter, sortField, sortOrder]);

  // Total pages and clamping
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  // Paginated slice
  const paginatedInvoices = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredInvoices.slice(startIndex, startIndex + pageSize);
  }, [filteredInvoices, safeCurrentPage, pageSize]);

  // Selection handlers scoped to the current page
  const isAllPageSelected = 
    paginatedInvoices.length > 0 && 
    paginatedInvoices.every(inv => selectedIds.has(inv.id));

  const togglePageSelection = () => {
    const newSelected = new Set(selectedIds);
    if (isAllPageSelected) {
      paginatedInvoices.forEach(inv => newSelected.delete(inv.id));
    } else {
      paginatedInvoices.forEach(inv => newSelected.add(inv.id));
    }
    setSelectedIds(newSelected);
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.size} selected invoice(s)?`)) {
      await deleteInvoices(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const handleDeleteSingle = async (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      await deleteInvoices([id]);
      if (selectedIds.has(id)) {
        const next = new Set(selectedIds);
        next.delete(id);
        setSelectedIds(next);
      }
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const exportData = selectedIds.size > 0
      ? filteredInvoices.filter(inv => selectedIds.has(inv.id))
      : filteredInvoices;

    if (exportData.length === 0) {
      alert('No invoices available to export.');
      return;
    }

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

    const escapeCsv = (val: string | number | undefined | null) => {
      const stringVal = String(val ?? '');
      if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
        return `"${stringVal.replace(/"/g, '""')}"`;
      }
      return stringVal;
    };

    const csvRows = [
      headers.join(','),
      ...exportData.map(inv => [
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
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoices_${format(new Date(), 'yyyy-MM-dd_HHmm')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const currentSortOption = useMemo(() => {
    return SORT_OPTIONS.find(opt => opt.field === sortField && opt.order === sortOrder);
  }, [sortField, sortOrder]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Helper to generate page numbers with ellipsis
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (safeCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (safeCurrentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, '...', totalPages];
  }, [safeCurrentPage, totalPages]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-ink-subtle">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading invoices...</span>
        </div>
      </div>
    );
  }

  const startRecord = filteredInvoices.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endRecord = Math.min(safeCurrentPage * pageSize, filteredInvoices.length);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-display-lg text-ink">Invoices</h2>
          <p className="text-subhead text-ink-subtle mt-1">Manage and track your customer billings and payments.</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <Button variant="destructive" onClick={handleDeleteSelected}>
              <Trash className="mr-2 h-4 w-4" />
              Delete ({selectedIds.size})
            </Button>
          )}
          <Button 
            onClick={handleExportCSV}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors"
          >
            <Download className="mr-2 h-4 w-4" />
            {selectedIds.size > 0 ? `Export Selected (${selectedIds.size})` : 'Export CSV'}
          </Button>
        </div>
      </div>

      {/* Filter & Sorting Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-ink-subtle" />
          <Input
            placeholder="Search clients or invoice number..."
            className="pl-8 bg-surface-1 text-ink border-border focus-visible:ring-primary/40"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Dedicated Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ variant: "outline", className: "gap-2 border-border bg-surface-1 hover:bg-surface-2 text-ink text-xs font-medium" })}>
              <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
              <span>Sort: <strong className="font-semibold text-ink">{currentSortOption?.label ?? 'Custom'}</strong></span>
              <ChevronDown className="h-3.5 w-3.5 text-ink-subtle" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-surface-2 border-border text-ink">
              {SORT_OPTIONS.map((opt) => {
                const isSelected = sortField === opt.field && sortOrder === opt.order;
                return (
                  <DropdownMenuItem
                    key={`${opt.field}-${opt.order}`}
                    onClick={() => {
                      setSortField(opt.field);
                      setSortOrder(opt.order);
                    }}
                    className={`cursor-pointer text-xs flex items-center justify-between py-2 px-2.5 rounded-md ${
                      isSelected ? 'text-primary font-medium bg-surface-3' : 'text-ink hover:bg-surface-3'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary ml-2" />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ variant: "outline", className: "border-border bg-surface-1 hover:bg-surface-2 text-ink text-xs font-medium" })}>
              Status: <span className="text-primary font-semibold ml-1">{statusFilter}</span>
              <ChevronDown className="ml-1.5 h-3.5 w-3.5 text-ink-subtle" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-surface-2 border-border text-ink">
              {(['All', 'Paid', 'Pending', 'Overdue'] as const).map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={statusFilter === status}
                  onCheckedChange={() => setStatusFilter(status)}
                  className="text-xs cursor-pointer"
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-lg border border-border bg-surface-1 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-surface-2/40 hover:bg-transparent">
              <TableHead className="w-12 text-center">
                <Checkbox 
                  checked={isAllPageSelected}
                  onCheckedChange={togglePageSelection}
                  aria-label="Select all on page"
                />
              </TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort('clientName')} 
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
                  onClick={() => handleSort('date')} 
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
                  onClick={() => handleSort('status')} 
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
                  onClick={() => handleSort('total')} 
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
            {paginatedInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-ink-subtle">
                  No invoices found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              paginatedInvoices.map((invoice) => (
                <TableRow 
                  key={invoice.id} 
                  data-state={selectedIds.has(invoice.id) && "selected"}
                  className="hover:bg-surface-2/40 transition-colors border-b border-border"
                >
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={selectedIds.has(invoice.id)}
                      onCheckedChange={() => toggleSelection(invoice.id)}
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
                  <TableCell className="text-right font-medium font-mono text-ink">{formatCurrency(invoice.total)}</TableCell>
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
                          onClick={() => {
                            // Quick download single invoice as JSON or CSV
                            const row = [
                              'Invoice Number,Client,Date,Due Date,Status,Total',
                              `"${invoice.invoiceNumber}","${invoice.clientName}","${format(new Date(invoice.date), 'yyyy-MM-dd')}","${format(new Date(invoice.dueDate), 'yyyy-MM-dd')}","${invoice.status}",${invoice.total.toFixed(2)}`
                            ].join('\n');
                            const blob = new Blob([row], { type: 'text/csv;charset=utf-8;' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `${invoice.invoiceNumber}.csv`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                          }}
                          className="text-xs cursor-pointer"
                        >
                          <Download className="mr-2 h-3.5 w-3.5 text-ink-subtle" />
                          Download CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteSingle(invoice.id)}
                          className="text-xs text-destructive hover:text-destructive cursor-pointer"
                        >
                          <Trash className="mr-2 h-3.5 w-3.5" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1 py-2">
        <div className="flex items-center gap-3 text-xs text-ink-subtle">
          <span>
            Showing <strong className="font-semibold text-ink">{startRecord}</strong> to{' '}
            <strong className="font-semibold text-ink">{endRecord}</strong> of{' '}
            <strong className="font-semibold text-ink">{filteredInvoices.length}</strong> invoices
          </span>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-ink-tertiary">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-surface-1 border border-border rounded text-ink text-xs px-2 py-1 outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            disabled={safeCurrentPage <= 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="h-8 px-2.5 text-xs border-border bg-surface-1 text-ink hover:bg-surface-2 disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {pageNumbers.map((p, idx) => {
              if (p === '...') {
                return (
                  <span key={`ellipsis-${idx}`} className="px-1 text-xs text-ink-tertiary select-none">
                    ...
                  </span>
                );
              }
              const pageNum = Number(p);
              const isActive = pageNum === safeCurrentPage;
              return (
                <Button
                  key={pageNum}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`h-8 min-w-8 px-2 text-xs transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground font-semibold hover:bg-primary/90' 
                      : 'border-border bg-surface-1 text-ink-subtle hover:text-ink hover:bg-surface-2'
                  }`}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={safeCurrentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="h-8 px-2.5 text-xs border-border bg-surface-1 text-ink hover:bg-surface-2 disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

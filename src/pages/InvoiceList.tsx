import { useState, useMemo, useEffect, useCallback } from 'react';
import { useInvoices } from '@/hooks/useInvoices';
import type { Invoice, InvoiceStatus, SortField, SortOrder } from '@/types/invoice';
import { Button } from '@/components/ui/button';
import { Download, Trash } from 'lucide-react';
import { ThinkingOrb } from 'thinking-orbs';
import { InvoiceToolbar } from '@/components/invoices/InvoiceToolbar';
import { InvoiceTable } from '@/components/invoices/InvoiceTable';
import { InvoicePagination } from '@/components/invoices/InvoicePagination';
import { exportInvoicesToCsv, exportSingleInvoiceToCsv } from '@/utils/exportCsv';

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

  // Reset to first page when search, status filter, or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, pageSize]);

  const handleSort = useCallback((field: SortField) => {
    setSortField(prevField => {
      if (prevField === field) {
        setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
        return field;
      }
      setSortOrder('asc');
      return field;
    });
  }, []);

  const handleToolbarSortChange = useCallback((field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
  }, []);

  // Filter and sort invoices
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

  // Total pages and safe clamped current page
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  // Current page slice
  const paginatedInvoices = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredInvoices.slice(startIndex, startIndex + pageSize);
  }, [filteredInvoices, safeCurrentPage, pageSize]);

  // Selection handlers
  const isAllPageSelected = useMemo(() => {
    return paginatedInvoices.length > 0 && paginatedInvoices.every(inv => selectedIds.has(inv.id));
  }, [paginatedInvoices, selectedIds]);

  const togglePageSelection = useCallback(() => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      const allSelected = paginatedInvoices.length > 0 && paginatedInvoices.every(inv => prev.has(inv.id));
      if (allSelected) {
        paginatedInvoices.forEach(inv => next.delete(inv.id));
      } else {
        paginatedInvoices.forEach(inv => next.add(inv.id));
      }
      return next;
    });
  }, [paginatedInvoices]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Deletion handlers
  const handleDeleteSelected = useCallback(async () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.size} selected invoice(s)?`)) {
      await deleteInvoices(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  }, [selectedIds, deleteInvoices]);

  const handleDeleteSingle = useCallback(async (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      await deleteInvoices([id]);
      setSelectedIds(prev => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [deleteInvoices]);

  // Export handlers
  const handleExportBulk = useCallback(() => {
    const exportData = selectedIds.size > 0
      ? filteredInvoices.filter(inv => selectedIds.has(inv.id))
      : filteredInvoices;

    if (exportData.length === 0) {
      alert('No invoices available to export.');
      return;
    }

    exportInvoicesToCsv(exportData);
  }, [selectedIds, filteredInvoices]);

  const handleExportSingle = useCallback((invoice: Invoice) => {
    exportSingleInvoiceToCsv(invoice);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-72 items-center justify-center gap-4 text-ink-subtle">
        <ThinkingOrb state="searching" size={64} />
        <span className="text-xs font-medium text-ink-subtle tracking-wide">Loading invoices...</span>
      </div>
    );
  }

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
            onClick={handleExportBulk}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors"
          >
            <Download className="mr-2 h-4 w-4" />
            {selectedIds.size > 0 ? `Export Selected (${selectedIds.size})` : 'Export CSV'}
          </Button>
        </div>
      </div>

      {/* Filter & Sorting Toolbar */}
      <InvoiceToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleToolbarSortChange}
      />

      {/* Invoices Table */}
      <InvoiceTable
        invoices={paginatedInvoices}
        selectedIds={selectedIds}
        isAllPageSelected={isAllPageSelected}
        onTogglePageSelection={togglePageSelection}
        onToggleSelect={toggleSelection}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        onDeleteSingle={handleDeleteSingle}
        onExportSingle={handleExportSingle}
      />

      {/* Pagination Footer */}
      <InvoicePagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalRecords={filteredInvoices.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}

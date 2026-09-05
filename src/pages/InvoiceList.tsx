import { useState, useMemo } from 'react';
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
import { ArrowUpDown, ChevronDown, Download, Eye, MoreHorizontal, Search, Trash } from 'lucide-react';

type SortField = 'date' | 'dueDate' | 'clientName' | 'total' | 'status';
type SortOrder = 'asc' | 'desc';

export function InvoiceList() {
  const { invoices, loading, deleteInvoices } = useInvoices();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'All'>('All');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
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

  const toggleAll = () => {
    if (selectedIds.size === filteredInvoices.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredInvoices.map(inv => inv.id)));
    }
  };

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter(inv => {
        const matchesSearch = inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
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

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [invoices, searchTerm, statusFilter, sortField, sortOrder]);

  const handleDeleteSelected = async () => {
    if (confirm('Are you sure you want to delete selected invoices?')) {
      await deleteInvoices(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return <div>Loading...</div>; // Skeleton can be added here
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-display-lg text-ink">Invoices</h2>
          <p className="text-subhead text-ink-subtle mt-2">Manage your invoices here.</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <Button variant="destructive" onClick={handleDeleteSelected}>
              <Trash className="mr-2 h-4 w-4" />
              Delete ({selectedIds.size})
            </Button>
          )}
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-ink-subtle" />
          <Input
            placeholder="Search clients or invoice number..."
            className="pl-8 bg-surface-1 text-ink border-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "outline", className: "ml-auto" })}>
              Status: {statusFilter} <ChevronDown className="ml-2 h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {['All', 'Paid', 'Pending', 'Overdue'].map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={statusFilter === status}
                onCheckedChange={() => setStatusFilter(status as InvoiceStatus | 'All')}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg border border-border bg-surface-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">
                <Checkbox 
                  checked={selectedIds.size > 0 && selectedIds.size === filteredInvoices.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('clientName')} className="-ml-4 h-8 data-[state=open]:bg-accent">
                  Client
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('date')} className="-ml-4 h-8 data-[state=open]:bg-accent">
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('status')} className="-ml-4 h-8 data-[state=open]:bg-accent">
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => handleSort('total')} className="-mr-4 h-8 data-[state=open]:bg-accent justify-end w-full">
                  Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No invoices found.
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} data-state={selectedIds.has(invoice.id) && "selected"}>
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={selectedIds.has(invoice.id)}
                      onCheckedChange={() => toggleSelection(invoice.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell>{format(new Date(invoice.date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(invoice.total)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8" })}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Link to={`/invoices/${invoice.id}`} className="flex w-full items-center">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="mr-2 h-4 w-4" />
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
    </div>
  );
}

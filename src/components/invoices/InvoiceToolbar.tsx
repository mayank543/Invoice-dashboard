import React, { useMemo } from 'react';
import type { InvoiceStatus, SortField, SortOrder } from '@/types/invoice';
import { Input } from '@/components/ui/input';
import { buttonVariants } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, ChevronDown, Search, Check } from 'lucide-react';

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

import type { DateRange } from 'react-day-picker';
import { DateRangeFilter } from './DateRangeFilter';

interface InvoiceToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: InvoiceStatus | 'All';
  onStatusFilterChange: (status: InvoiceStatus | 'All') => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export const InvoiceToolbar: React.FC<InvoiceToolbarProps> = React.memo(({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortField,
  sortOrder,
  onSortChange,
  dateRange,
  onDateRangeChange,
}) => {
  const currentSortOption = useMemo(() => {
    return SORT_OPTIONS.find(opt => opt.field === sortField && opt.order === sortOrder);
  }, [sortField, sortOrder]);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-ink-subtle" />
        <Input
          placeholder="Search clients or invoice number..."
          className="pl-8 bg-surface-1 text-ink border-border focus-visible:ring-primary/40"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
        {/* Date Range Filter */}
        <DateRangeFilter dateRange={dateRange} onDateRangeChange={onDateRangeChange} />

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
                  onClick={() => onSortChange(opt.field, opt.order)}
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
                onCheckedChange={() => onStatusFilterChange(status)}
                className="text-xs cursor-pointer"
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
});

InvoiceToolbar.displayName = 'InvoiceToolbar';

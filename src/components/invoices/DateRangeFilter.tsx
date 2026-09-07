import React from 'react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import type { DateRange } from 'react-day-picker';

interface DateRangeFilterProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = React.memo(({
  dateRange,
  onDateRangeChange,
}) => {
  const hasFilter = Boolean(dateRange?.from);

  const presets = [
    {
      label: 'Last 7 Days',
      getRange: (): DateRange => ({ from: subDays(new Date(), 7), to: new Date() }),
    },
    {
      label: 'Last 30 Days',
      getRange: (): DateRange => ({ from: subDays(new Date(), 30), to: new Date() }),
    },
    {
      label: 'This Month',
      getRange: (): DateRange => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }),
    },
    {
      label: 'Last 90 Days',
      getRange: (): DateRange => ({ from: subDays(new Date(), 90), to: new Date() }),
    },
  ];

  return (
    <div className="flex items-center gap-1">
      <Popover>
        <PopoverTrigger 
          className={buttonVariants({ 
            variant: "outline", 
            className: `gap-2 border-border bg-surface-1 hover:bg-surface-2 text-ink text-xs font-medium ${
              hasFilter ? 'border-primary/40 text-primary' : ''
            }` 
          })}
        >
          <CalendarIcon className={`h-3.5 w-3.5 ${hasFilter ? 'text-primary' : 'text-ink-subtle'}`} />
          <span>
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  <span className="text-ink">{format(dateRange.from, 'MMM dd')}</span>
                  <span className="text-ink-subtle mx-1">→</span>
                  <span className="text-ink">{format(dateRange.to, 'MMM dd, yyyy')}</span>
                </>
              ) : (
                <>Since <span className="text-ink">{format(dateRange.from, 'MMM dd, yyyy')}</span></>
              )
            ) : (
              'Date: All Time'
            )}
          </span>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[260px] p-3 bg-surface-2 border-border text-ink shadow-2xl rounded-xl">
          <div className="flex flex-col gap-2.5">
            {/* Quick presets */}
            <div className="grid grid-cols-2 gap-1.5 pb-2.5 border-b border-border w-full">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="xs"
                  onClick={() => onDateRangeChange(preset.getRange())}
                  className="text-[11px] h-6 px-2 bg-surface-1 border-border text-ink-subtle hover:text-ink hover:bg-surface-3 transition-colors w-full justify-center"
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            {/* Calendar */}
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from || new Date()}
              selected={dateRange}
              onSelect={onDateRangeChange}
              numberOfMonths={1}
              className="rounded-md border-0 bg-transparent text-ink p-0 w-full"
            />

            {/* Clear button in popover */}
            {hasFilter && (
              <div className="flex justify-end pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => onDateRangeChange(undefined)}
                  className="text-xs text-destructive hover:bg-destructive/10"
                >
                  Clear Date Range
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Quick clear button next to trigger */}
      {hasFilter && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDateRangeChange(undefined)}
          className="h-8 w-8 text-ink-subtle hover:text-ink hover:bg-surface-2"
          title="Clear date filter"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
});

DateRangeFilter.displayName = 'DateRangeFilter';

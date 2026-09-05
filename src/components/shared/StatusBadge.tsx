import { Badge } from '@/components/ui/badge';
import type { InvoiceStatus } from '@/types/invoice';

interface StatusBadgeProps {
  status: InvoiceStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'Paid':
      return <Badge variant="default" className="bg-surface-2 text-success hover:bg-surface-2/80 border-transparent rounded-pill px-2 py-0.5 text-caption font-medium">Paid</Badge>;
    case 'Pending':
      return <Badge variant="secondary" className="bg-surface-2 text-ink-muted hover:bg-surface-2/80 border-transparent rounded-pill px-2 py-0.5 text-caption font-medium">Pending</Badge>;
    case 'Overdue':
      return <Badge variant="destructive" className="bg-surface-2 text-ink-muted hover:bg-surface-2/80 border-transparent rounded-pill px-2 py-0.5 text-caption font-medium">Overdue</Badge>;
    default:
      return <Badge variant="outline" className="rounded-pill px-2 py-0.5 text-caption">{status}</Badge>;
  }
}

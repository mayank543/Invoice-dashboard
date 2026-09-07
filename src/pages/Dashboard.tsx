import { useDashboardStats, useInvoices } from '@/hooks/useInvoices';
import { StatCard } from '@/components/shared/StatCard';
import { FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { ThinkingOrb } from 'thinking-orbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Dashboard() {
  const { stats, loading } = useDashboardStats();
  const { invoices } = useInvoices();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading || !stats) {
    return (
      <div className="flex flex-col h-72 items-center justify-center gap-4 text-ink-subtle">
        <ThinkingOrb state="searching" size={64} />
        <span className="text-xs font-medium text-ink-subtle tracking-wide">Loading dashboard...</span>
      </div>
    );
  }

  const recentInvoices = invoices.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-display-md text-ink">Dashboard</h2>
        <p className="text-subhead text-ink-subtle mt-2">Overview of your invoice statistics.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Invoices"
          value={formatCurrency(stats.totalAmount)}
          description={`${stats.totalInvoices} total invoices`}
          icon={FileText}
        />
        <StatCard
          title="Paid Amount"
          value={formatCurrency(stats.paidAmount)}
          description={`${stats.paidCount} paid invoices`}
          icon={CheckCircle2}
        />
        <StatCard
          title="Pending Amount"
          value={formatCurrency(stats.pendingAmount)}
          description={`${stats.pendingCount} pending invoices`}
          icon={Clock}
        />
        <StatCard
          title="Overdue Amount"
          value={formatCurrency(stats.overdueAmount)}
          description={`${stats.overdueCount} overdue invoices`}
          icon={AlertCircle}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-body font-medium text-ink">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.map(invoice => (
                <div key={invoice.id} className="flex items-center justify-between border-b border-border last:border-0 pb-4 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-body-sm font-medium leading-none text-ink">{invoice.clientName}</p>
                    <p className="text-caption text-ink-subtle">
                      {invoice.invoiceNumber}
                    </p>
                  </div>
                  <div className="text-body-sm font-medium text-ink">
                    {formatCurrency(invoice.total)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

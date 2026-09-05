import { useDashboardStats, useInvoices } from '@/hooks/useInvoices';
import { StatCard } from '@/components/shared/StatCard';
import { FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
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
      <div className="space-y-6">
        <div>
          <h2 className="text-display-lg text-ink">Dashboard</h2>
          <p className="text-subhead text-ink-subtle mt-2">Overview of your invoice statistics.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[120px] mb-2" />
                <Skeleton className="h-4 w-[80px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const recentInvoices = invoices.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-display-lg text-ink">Dashboard</h2>
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
        <Card className="col-span-4 lg:col-span-4 bg-surface-1 border-border">
          <CardHeader>
            <CardTitle className="text-card-title text-ink">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentInvoices.map(invoice => (
                <div key={invoice.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-body font-medium leading-none text-ink">{invoice.clientName}</p>
                    <p className="text-body-sm text-ink-subtle">
                      {invoice.invoiceNumber}
                    </p>
                  </div>
                  <div className="ml-auto text-body font-medium text-ink">
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

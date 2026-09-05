import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
}

export function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-body font-medium text-ink">{title}</CardTitle>
        <Icon className="h-4 w-4 text-ink-subtle" />
      </CardHeader>
      <CardContent>
        <div className="text-display-md text-[32px]">{value}</div>
        {description && (
          <p className="text-caption text-ink-subtle mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

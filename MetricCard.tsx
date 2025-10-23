import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: 'default' | 'success' | 'primary';
}

export const MetricCard = ({ title, value, icon: Icon, trend, variant = 'default' }: MetricCardProps) => {
  const bgClass = variant === 'success' 
    ? 'bg-accent/10' 
    : variant === 'primary' 
    ? 'bg-primary/10' 
    : 'bg-secondary';

  const iconColor = variant === 'success'
    ? 'text-accent'
    : variant === 'primary'
    ? 'text-primary'
    : 'text-foreground';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground">{trend}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${bgClass}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

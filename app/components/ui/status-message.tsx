
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatusMessageProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export function StatusMessage({ icon: Icon, title, description, className }: StatusMessageProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <Icon className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground max-w-md">{description}</p>
      )}
    </div>
  );
}

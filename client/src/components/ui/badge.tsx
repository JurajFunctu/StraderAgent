import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all-smooth focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 badge-pill',
  {
    variants: {
      variant: {
        default: 'bg-blue-500/20 text-blue-200 border border-blue-400/30',
        secondary: 'bg-purple-500/20 text-purple-200 border border-purple-400/30',
        destructive: 'bg-red-500/20 text-red-200 border border-red-400/30',
        outline: 'text-foreground border border-white/20',
        success: 'bg-green-500/20 text-green-200 border border-green-400/30',
        warning: 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30',
        info: 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

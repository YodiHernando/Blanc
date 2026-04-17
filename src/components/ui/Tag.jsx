import React from 'react';
import { cn } from '../../lib/utils';

export function Tag({ children, type, className }) {
  const styles = {
    energyHigh: "bg-red-50 text-red-600 border border-red-100",
    energyMedium: "bg-yellow-50 text-yellow-600 border border-yellow-200",
    energyLow: "bg-green-50 text-green-600 border border-green-100",
    context: "bg-zen-muted text-zen-text/70",
    time: "bg-zen-bg border border-zen-muted text-zen-text/70"
  };

  return (
    <span className={cn(
      "px-2.5 py-1 text-[11px] font-medium rounded-full whitespace-nowrap",
      styles[type] || styles.context,
      className
    )}>
      {children}
    </span>
  );
}

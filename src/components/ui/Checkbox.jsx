import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

export function Checkbox({ checked, onChange, className }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "flex shrink-0 items-center justify-center w-5 h-5 rounded-full border border-zen-text/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zen-accent/50",
        checked ? "bg-zen-accent border-zen-accent" : "hover:border-zen-text/40 bg-transparent",
        className
      )}
    >
      <motion.div
        initial={false}
        animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <Check className="w-3 h-3 text-white" strokeWidth={3} />
      </motion.div>
    </button>
  );
}

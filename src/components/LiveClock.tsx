import React, { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface LiveClockProps {
  compact?: boolean;
  className?: string;
  variant?: 'default' | 'navy';
}

export const LiveClock: React.FC<LiveClockProps> = ({
  compact = false,
  className = '',
  variant = 'default',
}) => {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const formattedDate = now.toLocaleDateString(undefined, {
    weekday: compact ? 'short' : 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = now.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const isNavy = variant === 'navy';

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-3 rounded-xl border px-3.5 py-2 text-xs font-mono tabular-nums ${
        isNavy
          ? 'border-[#1E335C] bg-[#071127] text-slate-300'
          : 'border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 text-slate-700 dark:text-slate-300'
      } ${className}`}
      aria-label="Current live date and time"
    >
      <span className="inline-flex items-center gap-1.5">
        <Calendar className={`w-3.5 h-3.5 shrink-0 ${isNavy ? 'text-sky-400' : 'text-blue-600 dark:text-blue-400'}`} />
        <span className={`font-medium ${isNavy ? 'text-slate-100' : 'text-slate-900 dark:text-white'}`}>{formattedDate}</span>
      </span>
      <span aria-hidden="true" className={isNavy ? 'text-blue-900' : 'text-slate-300 dark:text-slate-700'}>
        |
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span className={`font-semibold ${isNavy ? 'text-white' : 'text-slate-950 dark:text-white'}`}>{formattedTime}</span>
      </span>
    </div>
  );
};

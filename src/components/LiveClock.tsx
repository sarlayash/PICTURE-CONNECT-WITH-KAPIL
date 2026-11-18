import React, { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface LiveClockProps {
  compact?: boolean;
  className?: string;
}

export const LiveClock: React.FC<LiveClockProps> = ({
  compact = false,
  className = '',
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

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 px-3.5 py-2 text-xs font-mono tabular-nums text-slate-700 dark:text-slate-300 ${className}`}
      aria-label="Current live date and time"
    >
      <span className="inline-flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
        <span className="font-medium text-slate-900 dark:text-white">{formattedDate}</span>
      </span>
      <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
        |
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span className="font-semibold text-slate-950 dark:text-white">{formattedTime}</span>
      </span>
    </div>
  );
};

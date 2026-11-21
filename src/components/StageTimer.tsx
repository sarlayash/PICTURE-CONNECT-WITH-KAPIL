import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface TimerPreset {
  label: string;
  seconds: number;
}

interface StageTimerProps {
  initialSeconds: number;
  presets?: TimerPreset[];
  label?: string;
  onTick?: (remaining: number) => void;
  onExpire?: () => void;
  onStart?: () => void;
  onReset?: () => void;
  compact?: boolean;
}

function playChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.55);
    window.setTimeout(() => {
      ctx.close().catch(() => {});
    }, 700);
  } catch {
    // Ignore audio context restrictions if blocked
  }
}

export const StageTimer: React.FC<StageTimerProps> = ({
  initialSeconds,
  presets,
  label = 'Activity Timer',
  onTick,
  onExpire,
  onStart,
  onReset,
  compact = false,
}) => {
  const [duration, setDuration] = useState(initialSeconds);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const expiredRef = useRef(false);
  const remainingRef = useRef(initialSeconds);
  const onTickRef = useRef(onTick);
  const onExpireRef = useRef(onExpire);
  const soundEnabledRef = useRef(soundEnabled);

  onTickRef.current = onTick;
  onExpireRef.current = onExpire;
  soundEnabledRef.current = soundEnabled;
  remainingRef.current = remaining;

  useEffect(() => {
    setDuration(initialSeconds);
    setRemaining(initialSeconds);
    remainingRef.current = initialSeconds;
    setRunning(false);
    expiredRef.current = false;
  }, [initialSeconds]);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      const next = Math.max(0, remainingRef.current - 1);
      remainingRef.current = next;
      setRemaining(next);
      onTickRef.current?.(next);
      if (next === 0 && !expiredRef.current) {
        expiredRef.current = true;
        setRunning(false);
        if (soundEnabledRef.current) playChime();
        onExpireRef.current?.();
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const isUrgent = remaining > 0 && remaining <= 10;
  const isDone = remaining === 0;

  const statusText = isDone
    ? 'TIME UP'
    : isUrgent
    ? 'URGENT'
    : running
    ? 'RUNNING'
    : 'READY';

  const statusClasses = isDone
    ? 'text-red-700 dark:text-red-400'
    : isUrgent
    ? 'text-amber-700 dark:text-amber-400'
    : running
    ? 'text-emerald-700 dark:text-emerald-400'
    : 'text-slate-500 dark:text-slate-400';

  const handleToggle = () => {
    if (remaining === 0) {
      setRemaining(duration);
      expiredRef.current = false;
      setRunning(true);
      onStart?.();
      return;
    }
    if (!running) {
      onStart?.();
    }
    setRunning((r) => !r);
  };

  const handleReset = () => {
    setRunning(false);
    setRemaining(duration);
    expiredRef.current = false;
    onReset?.();
  };

  const handlePreset = (sec: number) => {
    setRunning(false);
    setDuration(sec);
    setRemaining(sec);
    expiredRef.current = false;
    onReset?.();
  };

  return (
    <div className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{label}</span>
            <span aria-hidden="true">·</span>
            <span className={`font-mono font-semibold ${statusClasses}`}>{statusText}</span>
          </div>
          <div className={`font-mono tabular-nums font-semibold tracking-tight ${compact ? 'text-2xl mt-0.5' : 'text-3xl mt-1'} ${isDone ? 'text-red-600 dark:text-red-400' : isUrgent ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-slate-100'}`}>
            {formatted}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggle}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{running ? 'Pause' : remaining === 0 ? 'Restart' : 'Start'}</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset timer"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setSoundEnabled((s) => !s)}
            aria-label={soundEnabled ? 'Mute chime' : 'Enable chime'}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {presets && presets.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {presets.map((p) => {
            const active = duration === p.seconds;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => handlePreset(p.seconds)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

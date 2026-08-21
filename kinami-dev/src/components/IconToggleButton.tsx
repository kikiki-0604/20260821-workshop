interface IconToggleButtonProps {
  enabled: boolean;
  onIcon: string;
  offIcon: string;
  label: string;
  onToggle: () => void;
}

export function IconToggleButton({ enabled, onIcon, offIcon, label, onToggle }: IconToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-md ring-2 ring-white/60 transition hover:scale-110 active:scale-95 sm:h-12 sm:w-12 sm:text-2xl dark:bg-indigo-900/70 dark:ring-fuchsia-500/20"
    >
      {enabled ? onIcon : offIcon}
    </button>
  );
}

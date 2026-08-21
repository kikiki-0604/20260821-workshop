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
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow transition hover:scale-105 active:scale-95 dark:bg-indigo-900/70"
    >
      {enabled ? onIcon : offIcon}
    </button>
  );
}

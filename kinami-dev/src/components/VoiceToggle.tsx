interface VoiceToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function VoiceToggle({ enabled, onToggle }: VoiceToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="キャラクターボイスの切り替え"
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow transition hover:scale-105 active:scale-95 dark:bg-slate-700"
    >
      {enabled ? '🗣️' : '🤐'}
    </button>
  );
}

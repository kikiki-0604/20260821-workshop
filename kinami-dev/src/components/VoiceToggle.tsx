import { IconToggleButton } from './IconToggleButton';

interface VoiceToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function VoiceToggle({ enabled, onToggle }: VoiceToggleProps) {
  return (
    <IconToggleButton
      enabled={enabled}
      onIcon="🗣️"
      offIcon="🤐"
      label="キャラクターボイスの切り替え"
      onToggle={onToggle}
    />
  );
}

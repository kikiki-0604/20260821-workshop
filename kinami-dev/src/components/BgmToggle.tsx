import { IconToggleButton } from './IconToggleButton';

interface BgmToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function BgmToggle({ enabled, onToggle }: BgmToggleProps) {
  return (
    <IconToggleButton
      enabled={enabled}
      onIcon="🎵"
      offIcon="🔇"
      label="BGMの再生切り替え"
      onToggle={onToggle}
    />
  );
}

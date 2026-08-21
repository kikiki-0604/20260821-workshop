import { IconToggleButton } from './IconToggleButton';

interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function DarkModeToggle({ isDark, onToggle }: DarkModeToggleProps) {
  return (
    <IconToggleButton
      enabled={isDark}
      onIcon="🌙"
      offIcon="☀️"
      label="ダークモード切り替え"
      onToggle={onToggle}
    />
  );
}

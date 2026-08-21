import type { GameMode, Player, PlayerNames } from '../types';

export function playerLabel(player: Player, mode: GameMode, names: PlayerNames): string {
  if (mode === 'pvp') {
    const name = names[player]?.trim();
    if (name) return name;
  }
  return player === 'black' ? '黒' : '白';
}

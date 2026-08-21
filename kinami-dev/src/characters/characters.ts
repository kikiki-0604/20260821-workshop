import { pickRandom } from '../utils/random';
import type { CharacterId } from '../types';

export interface CharacterDef {
  id: CharacterId;
  name: string;
  tagline: string;
  lines: string[];
}

export const CHARACTER_IDS: CharacterId[] = ['cat', 'dog', 'bird', 'fish'];

export const CHARACTERS: Record<CharacterId, CharacterDef> = {
  cat: {
    id: 'cat',
    name: 'ネコ',
    tagline: '自信家でちょっぴり生意気',
    lines: [
      'ここだニャ！',
      '決まりだニャ！',
      '甘いニャ〜',
      'その手は読めてるニャ',
      'ふふん、いただきッ',
      'まだまだこれからだニャ',
      'にゃんて綺麗な一手',
      '隙あり！',
    ],
  },
  dog: {
    id: 'dog',
    name: 'イヌ',
    tagline: '元気いっぱい素直な性格',
    lines: [
      'よし、ここだ！',
      '決めるぞー！',
      'がんばるワン！',
      'その手、いただき！',
      'まだまだ負けないワン！',
      'よーし、いい調子！',
      '次はどこかな〜？',
      '全力でいくワン！',
    ],
  },
  bird: {
    id: 'bird',
    name: 'トリ',
    tagline: '陽気でちょっぴりおちゃめ',
    lines: [
      'ピピッ、ここに決めた！',
      '高いところから見えてたよ〜',
      'ナイスな一手でしょ？',
      'さぁ、どうする？',
      '空から狙ってたんだ！',
      'ちょこっと一手！',
      'びっくりした？',
      'これで形勢逆転かな',
    ],
  },
  fish: {
    id: 'fish',
    name: 'サカナ',
    tagline: 'マイペースでのんびり屋',
    lines: [
      'ぷくぷく…ここにしようかな',
      'のんびり考えて…これだ',
      '水面に波紋が広がるよ',
      'すいすい〜っと一手',
      'まぁ焦らずいこう',
      'この一手、悪くないでしょ？',
      'ふわ〜、決まったかな',
      '静かに、でも確実に',
    ],
  },
};

export function randomLine(id: CharacterId): string {
  return pickRandom(CHARACTERS[id].lines);
}

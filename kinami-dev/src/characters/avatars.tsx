import birdImg from '../assets/characters/bird.jpg';
import catImg from '../assets/characters/cat.jpg';
import dogImg from '../assets/characters/dog.jpg';
import fishImg from '../assets/characters/fish.jpg';
import type { CharacterId } from '../types';

interface AvatarProps {
  size?: number;
}

interface ImageAvatarConfig {
  src: string;
  alt: string;
  objectPosition: string;
  zoom: number;
}

// Hand-picked framing per photo so each character's face fills the circular
// avatar nicely instead of showing the full (mostly whitespace) illustration.
const AVATAR_CONFIG: Record<CharacterId, ImageAvatarConfig> = {
  cat: { src: catImg, alt: 'ネコ', objectPosition: '50% 30%', zoom: 1.3 },
  dog: { src: dogImg, alt: 'イヌ', objectPosition: '50% 28%', zoom: 1.3 },
  bird: { src: birdImg, alt: 'トリ', objectPosition: '50% 36%', zoom: 1.25 },
  fish: { src: fishImg, alt: 'サカナ', objectPosition: '42% 46%', zoom: 1.4 },
};

export function CharacterAvatar({ id, size = 56 }: { id: CharacterId } & AvatarProps) {
  const config = AVATAR_CONFIG[id];
  return (
    <span
      className="block overflow-hidden rounded-full bg-white shadow-inner ring-2 ring-white/80 dark:ring-slate-900/50"
      style={{ width: size, height: size }}
    >
      <img
        src={config.src}
        alt={config.alt}
        className="h-full w-full object-cover"
        style={{ objectPosition: config.objectPosition, transform: `scale(${config.zoom})` }}
        draggable={false}
      />
    </span>
  );
}

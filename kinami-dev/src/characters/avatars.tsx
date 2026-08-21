import birdImg from '../assets/characters/bird.jpg';
import catImg from '../assets/characters/cat.jpg';
import dogImg from '../assets/characters/dog.jpg';
import fishImg from '../assets/characters/fish.jpg';
import type { CharacterId } from '../types';

interface AvatarProps {
  /** Fixed pixel size. Ignored when `className` includes width/height utilities. */
  size?: number;
  /** Extra classes on the circular frame — pass Tailwind size utilities here for responsive avatars. */
  className?: string;
  /** Classes controlling the ring/border around the frame. */
  ringClassName?: string;
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

export function CharacterAvatar({
  id,
  size = 56,
  className = '',
  ringClassName = 'ring-4 ring-white dark:ring-slate-900/60',
}: { id: CharacterId } & AvatarProps) {
  const config = AVATAR_CONFIG[id];
  const hasSizeClass = /\bh-\d/.test(className) && /\bw-\d/.test(className);
  return (
    <span
      className={`block overflow-hidden rounded-full bg-white shadow-lg ${ringClassName} ${className}`}
      style={hasSizeClass ? undefined : { width: size, height: size }}
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

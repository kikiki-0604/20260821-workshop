import { useId } from 'react';
import type { CharacterId } from '../types';

interface AvatarProps {
  size?: number;
}

export function CatAvatar({ size = 56 }: AvatarProps) {
  const gradientId = `catFur-${useId()}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="ネコ">
      <defs>
        <radialGradient id={gradientId} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ffdfae" />
          <stop offset="100%" stopColor="#f0a35a" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#${gradientId})`} />
      <path d="M16 32 L29 6 L38 34 Z" fill="#f0a35a" />
      <path d="M84 32 L71 6 L62 34 Z" fill="#f0a35a" />
      <path d="M21 29 L29 13 L34 30 Z" fill="#ffc3d9" />
      <path d="M79 29 L71 13 L66 30 Z" fill="#ffc3d9" />
      <ellipse cx="38" cy="53" rx="7" ry="9" fill="#2b2320" />
      <ellipse cx="62" cy="53" rx="7" ry="9" fill="#2b2320" />
      <circle cx="40.5" cy="50" r="2.2" fill="#fff" />
      <circle cx="64.5" cy="50" r="2.2" fill="#fff" />
      <circle cx="30" cy="61" r="6" fill="#ffb3c6" opacity="0.5" />
      <circle cx="70" cy="61" r="6" fill="#ffb3c6" opacity="0.5" />
      <path d="M46 63 L54 63 L50 67 Z" fill="#c2685a" />
      <path
        d="M50 67 Q50 71 45 72 M50 67 Q50 71 55 72"
        stroke="#7a4a3a"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M8 56 L28 54 M8 63 L28 59 M92 56 L72 54 M92 63 L72 59"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

export function DogAvatar({ size = 56 }: AvatarProps) {
  const gradientId = `dogFur-${useId()}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="イヌ">
      <defs>
        <radialGradient id={gradientId} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ffe4b8" />
          <stop offset="100%" stopColor="#d99a5b" />
        </radialGradient>
      </defs>
      <path d="M12 40 Q4 68 24 80 Q18 56 26 38 Z" fill="#c98849" />
      <path d="M88 40 Q96 68 76 80 Q82 56 74 38 Z" fill="#c98849" />
      <circle cx="50" cy="52" r="46" fill={`url(#${gradientId})`} />
      <ellipse cx="50" cy="70" rx="24" ry="18" fill="#fff6ea" opacity="0.7" />
      <ellipse cx="38" cy="50" rx="6.5" ry="8.5" fill="#2b2320" />
      <ellipse cx="62" cy="50" rx="6.5" ry="8.5" fill="#2b2320" />
      <circle cx="40" cy="47" r="2" fill="#fff" />
      <circle cx="64" cy="47" r="2" fill="#fff" />
      <ellipse cx="50" cy="63" rx="7" ry="5.5" fill="#3a2a22" />
      <path
        d="M50 68 Q50 73 44 74 M50 68 Q50 73 56 74"
        stroke="#7a4a3a"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="50" cy="78" rx="6" ry="4" fill="#ff8fa3" opacity="0.85" />
    </svg>
  );
}

export function BirdAvatar({ size = 56 }: AvatarProps) {
  const gradientId = `birdFeather-${useId()}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="トリ">
      <defs>
        <radialGradient id={gradientId} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#bfe8ff" />
          <stop offset="100%" stopColor="#6fb8e6" />
        </radialGradient>
      </defs>
      <path d="M38 8 L46 20 L34 20 Z" fill="#f6c453" />
      <path d="M50 4 L58 18 L44 18 Z" fill="#ffd97a" />
      <path d="M62 8 L66 20 L54 20 Z" fill="#f6c453" />
      <circle cx="50" cy="52" r="45" fill={`url(#${gradientId})`} />
      <ellipse cx="22" cy="55" rx="9" ry="14" fill="#5aa3d1" opacity="0.8" />
      <ellipse cx="78" cy="55" rx="9" ry="14" fill="#5aa3d1" opacity="0.8" />
      <ellipse cx="38" cy="50" rx="8" ry="9.5" fill="#fff" />
      <ellipse cx="62" cy="50" rx="8" ry="9.5" fill="#fff" />
      <circle cx="39" cy="51" r="4.4" fill="#2b2320" />
      <circle cx="63" cy="51" r="4.4" fill="#2b2320" />
      <circle cx="40.5" cy="49" r="1.6" fill="#fff" />
      <circle cx="64.5" cy="49" r="1.6" fill="#fff" />
      <path d="M43 62 L57 62 L50 72 Z" fill="#f6923d" />
      <circle cx="32" cy="66" r="5" fill="#ffb3c6" opacity="0.55" />
      <circle cx="68" cy="66" r="5" fill="#ffb3c6" opacity="0.55" />
    </svg>
  );
}

export function FishAvatar({ size = 56 }: AvatarProps) {
  const gradientId = `fishScale-${useId()}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="サカナ">
      <defs>
        <radialGradient id={gradientId} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ffb27a" />
          <stop offset="100%" stopColor="#f5793e" />
        </radialGradient>
      </defs>
      <path d="M88 50 L100 34 L100 66 Z" fill="#f5793e" />
      <path d="M20 20 Q10 34 20 50 Q10 66 20 80 Q40 88 62 78 Q40 70 34 50 Q40 30 62 22 Q40 12 20 20 Z" fill="#ffe3cf" opacity="0.55" />
      <circle cx="46" cy="50" r="42" fill={`url(#${gradientId})`} />
      <path d="M12 40 Q2 50 12 60 Q18 50 12 40 Z" fill="#f5793e" />
      <ellipse cx="30" cy="46" rx="8" ry="9" fill="#fff" />
      <circle cx="31" cy="47" r="4.6" fill="#2b2320" />
      <circle cx="32.5" cy="45" r="1.6" fill="#fff" />
      <path
        d="M20 66 Q30 74 42 68"
        stroke="#c2461f"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="72" cy="24" r="3.5" fill="#bfe8ff" opacity="0.8" />
      <circle cx="80" cy="16" r="2.2" fill="#bfe8ff" opacity="0.7" />
      <circle cx="60" cy="60" r="7" fill="#ffcba8" opacity="0.5" />
    </svg>
  );
}

const AVATAR_MAP: Record<CharacterId, (props: AvatarProps) => JSX.Element> = {
  cat: CatAvatar,
  dog: DogAvatar,
  bird: BirdAvatar,
  fish: FishAvatar,
};

export function CharacterAvatar({ id, size = 56 }: { id: CharacterId } & AvatarProps) {
  const AvatarComponent = AVATAR_MAP[id];
  return <AvatarComponent size={size} />;
}

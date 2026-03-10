interface PlanetIconProps {
  level?: number;
  destination?: string;
  className?: string;
  alt?: string;
  animated?: boolean;
}

const PLANET_CONFIG: Record<number, { image: string; label: string }> = {
  1: { image: '/images/moon.png', label: 'Moon' },
  2: { image: '/images/mars.png', label: 'Mars' },
  3: { image: '/images/jupiter.png', label: 'Jupiter' },
  4: { image: '/images/saturn.png', label: 'Saturn' },
  5: { image: '/images/venus.png', label: 'Venus' },
  6: { image: '/images/uranus.png', label: 'Uranus' },
  7: { image: '/images/neptune.png', label: 'Neptune' },
  8: { image: '/images/mercury.png', label: 'Mercury' },
  9: { image: '/images/pluto.png', label: 'Pluto' },
  10: { image: '/images/sun.png', label: 'Sun' },
};

export function PlanetIcon({ level, destination, className = 'text-4xl', alt, animated = false }: PlanetIconProps) {
  // Map destination names to levels
  const destinationToLevel: Record<string, number> = {
    'moon': 1,
    'mars': 2,
    'jupiter': 3,
    'saturn': 4,
    'venus': 5,
    'uranus': 6,
    'neptune': 7,
    'mercury': 8,
    'pluto': 9,
    'sun': 10
  };
  
  const resolvedLevel = level ?? (destination ? destinationToLevel[destination.toLowerCase()] : 1);
  const config = PLANET_CONFIG[resolvedLevel || 1];
  
  // Fallback to emoji for levels without images
  if (!config) {
    return <span className={className} role="img" aria-label={alt || 'Planet'}>🪐</span>;
  }

  // Static version
  if (!animated) {
    return (
      <span className={`inline-flex items-center justify-center ${className}`} style={{ lineHeight: 1 }}>
        <img src={config.image} alt={alt || config.label} className="w-[1em] h-[1em] object-contain" />
      </span>
    );
  }

  // Animated version (for story preview)
  return (
    <span className={`inline-flex items-center justify-center ${className} relative`} style={{ lineHeight: 1 }} role="img" aria-label={alt || config.label}>
      {/* Glow effect */}
      <span 
        className="absolute rounded-full planet-glow"
        style={{
          width: '3em',
          height: '3em',
          background: 'radial-gradient(circle, rgba(255,255,220,0.3) 0%, rgba(255,255,200,0.1) 40%, transparent 70%)',
          filter: 'blur(6px)'
        }}
      />
      
      {/* Planet image with float animation */}
      <img 
        src={config.image}
        alt={alt || config.label}
        className="object-contain relative planet-float"
        style={{ width: '2.2em', height: '2.2em', zIndex: 1, filter: 'drop-shadow(0 0 8px rgba(255,255,200,0.5))' }}
      />
      
      {/* Sparkles */}
      <span className="absolute planet-sparkle" style={{ top: '-8%', right: '8%', zIndex: 2 }}>
        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
          <path d="M5 0L5.5 4.5L10 5L5.5 5.5L5 10L4.5 5.5L0 5L4.5 4.5L5 0Z" fill="rgba(255,255,255,0.9)"/>
        </svg>
      </span>
      <span className="absolute planet-sparkle-2" style={{ bottom: '12%', left: '2%', zIndex: 2 }}>
        <svg width="6" height="6" viewBox="0 0 10 10" fill="none">
          <path d="M5 0L5.5 4.5L10 5L5.5 5.5L5 10L4.5 5.5L0 5L4.5 4.5L5 0Z" fill="rgba(255,255,255,0.8)"/>
        </svg>
      </span>

      <style>{`
        .planet-float { animation: planetFloat 4s ease-in-out infinite; }
        .planet-glow { animation: planetGlow 3s ease-in-out infinite; }
        .planet-sparkle { animation: planetSparkle 2s ease-in-out infinite; }
        .planet-sparkle-2 { animation: planetSparkle 2.5s ease-in-out infinite 0.7s; }
        @keyframes planetFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes planetGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }
        @keyframes planetSparkle {
          0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
      `}</style>
    </span>
  );
}

export default PlanetIcon;


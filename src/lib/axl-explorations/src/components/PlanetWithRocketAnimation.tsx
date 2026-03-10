import { PlanetIcon } from './ui/PlanetIcon';

interface PlanetWithRocketAnimationProps {
  level: number;
  planetSize?: string; // e.g., "text-6xl sm:text-7xl md:text-8xl"
  containerSize?: {
    width: string;
    height: string;
  };
  orbitSize?: {
    width: string;
    height: string;
  };
  rocketSize?: {
    width: string;
    height: string;
  };
  showOrbitPath?: boolean;
  className?: string;
}

export function PlanetWithRocketAnimation({
  level,
  planetSize = "text-6xl sm:text-7xl md:text-8xl",
  containerSize = {
    width: 'clamp(120px, 30vw, 200px)',
    height: 'clamp(120px, 30vw, 200px)'
  },
  orbitSize = {
    width: 'clamp(100px, 25vw, 180px)',
    height: 'clamp(100px, 25vw, 180px)'
  },
  rocketSize = {
    width: 'clamp(20px, 5vw, 32px)',
    height: 'clamp(28px, 7vw, 44px)'
  },
  showOrbitPath = true,
  className = ""
}: PlanetWithRocketAnimationProps) {
  return (
    <>
      <style>{`
        /* Orbiting rocket around planet */
        .rocket-orbit {
          animation: orbitMoon 10s linear infinite;
          transform-origin: center center;
        }
        @keyframes orbitMoon {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        /* Rocket flame flicker */
        .flame-flicker {
          animation: flameFlicker 0.2s ease-in-out infinite alternate;
        }
        @keyframes flameFlicker {
          0% { transform: scaleY(0.9) scaleX(1); opacity: 0.85; }
          100% { transform: scaleY(1.15) scaleX(0.85); opacity: 1; }
        }
      `}</style>
      <div className={`relative flex items-center justify-center ${className}`} 
           style={{ 
             width: containerSize.width, 
             height: containerSize.height, 
             display: 'flex', 
             alignItems: 'center', 
             justifyContent: 'center' 
           }}>
        <PlanetIcon level={level} className={planetSize} animated />
        
        {/* Orbit path (optional visual) */}
        {showOrbitPath && (
          <div 
            className="absolute rounded-full border border-white/10"
            style={{ 
              width: orbitSize.width, 
              height: orbitSize.height 
            }}
          />
        )}
        
        {/* Orbiting rocket container */}
        <div 
          className="absolute rocket-orbit"
          style={{ 
            width: orbitSize.width, 
            height: orbitSize.height 
          }}
        >
          {/* Rocket positioned at edge, pointing tangent to orbit */}
          <div 
            className="absolute"
            style={{ 
              top: '50%', 
              left: '100%', 
              transform: 'translate(-50%, -50%)'
            }}
          >
            <svg 
              width={rocketSize.width} 
              height={rocketSize.height} 
              viewBox="0 0 20 28" 
              fill="none"
            >
              {/* Rocket body */}
              <ellipse cx="10" cy="12" rx="5" ry="9" fill="#e0e7ff"/>
              <ellipse cx="10" cy="12" rx="4" ry="7" fill="#c7d2fe"/>
              {/* Nose cone */}
              <path d="M10 1L14 8H6L10 1Z" fill="#f87171"/>
              {/* Window */}
              <circle cx="10" cy="10" r="2.5" fill="#60a5fa"/>
              <circle cx="10" cy="10" r="1.5" fill="#bfdbfe"/>
              {/* Fins */}
              <path d="M5 17L1 22L6 19Z" fill="#f87171"/>
              <path d="M15 17L19 22L14 19Z" fill="#f87171"/>
              {/* Flame */}
              <g className="flame-flicker" style={{ transformOrigin: '10px 22px' }}>
                <ellipse cx="10" cy="23" rx="3" ry="4" fill="#fbbf24"/>
                <ellipse cx="10" cy="24" rx="2" ry="3" fill="#fb923c"/>
                <ellipse cx="10" cy="25" rx="1" ry="2" fill="#fef3c7"/>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}


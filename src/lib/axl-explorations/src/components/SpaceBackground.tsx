import React from 'react';

interface SpaceBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function SpaceBackground({ children, className = '' }: SpaceBackgroundProps) {
  return (
    <>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes twinkleSlow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        /* Nebula drift animations */
        .nebula-drift {
          animation: nebulaDrift 25s ease-in-out infinite;
        }
        .nebula-drift-reverse {
          animation: nebulaDrift 30s ease-in-out infinite reverse;
        }
        @keyframes nebulaDrift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          33% { transform: translate(25px, -15px) scale(1.03); opacity: 0.28; }
          66% { transform: translate(-15px, 10px) scale(0.97); opacity: 0.22; }
        }
        
        /* Aurora wave animations */
        .aurora-wave {
          animation: auroraWave 8s ease-in-out infinite;
        }
        .aurora-wave-2 {
          animation: auroraWave 10s ease-in-out infinite reverse;
        }
        @keyframes auroraWave {
          0%, 100% { opacity: 0.6; transform: skewY(-3deg) translateX(0); }
          50% { opacity: 1; transform: skewY(-2deg) translateX(20px); }
        }
        
        /* Cosmic dust float */
        .dust-float {
          animation: dustFloat linear infinite;
        }
        @keyframes dustFloat {
          0% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(60px, -25px); opacity: 0.4; }
          100% { transform: translate(120px, 10px); opacity: 0; }
        }
        
        /* Shooting star with trail */
        .shooting-star {
          animation: shootingStarTrail linear infinite;
        }
        @keyframes shootingStarTrail {
          0% { transform: translate(0, 0) rotate(-45deg) scale(0); opacity: 0; }
          5% { transform: translate(15px, 15px) rotate(-45deg) scale(1); opacity: 1; }
          100% { transform: translate(350px, 350px) rotate(-45deg) scale(0.3); opacity: 0; }
        }
        
        /* Galaxy rotation */
        .galaxy-rotate {
          animation: galaxyRotate 100s linear infinite;
        }
        @keyframes galaxyRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Depth layers for perspective */
        .depth-layer-far {
          transform: translateZ(-100px) scale(1.1);
          transform-style: preserve-3d;
        }
        .depth-layer-mid {
          transform: translateZ(-50px) scale(1.05);
          transform-style: preserve-3d;
        }
        
        /* Light rays */
        .light-ray {
          animation: lightRayPulse 6s ease-in-out infinite;
        }
        .light-ray-2 {
          animation: lightRayPulse 8s ease-in-out infinite;
        }
        @keyframes lightRayPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        
        /* Floating light orbs */
        .light-orb {
          animation: orbFloat ease-in-out infinite;
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          25% { transform: translate(15px, -20px) scale(1.1); opacity: 0.5; }
          50% { transform: translate(-10px, -30px) scale(0.9); opacity: 0.4; }
          75% { transform: translate(20px, -15px) scale(1.05); opacity: 0.45; }
        }
        
        /* Sparkle burst */
        .sparkle-burst {
          animation: sparkleBurst 3s ease-in-out infinite;
        }
        @keyframes sparkleBurst {
          0%, 100% { opacity: 0; transform: scale(0.3) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        
        /* Comet */
        .comet {
          animation: cometFly 12s linear infinite;
        }
        @keyframes cometFly {
          0% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(120vw, 40vh); opacity: 0; }
        }
        
        /* Constellation */
        .constellation {
          animation: constellationGlow 4s ease-in-out infinite;
        }
        @keyframes constellationGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        /* Tiny galaxy */
        .tiny-galaxy {
          animation: galaxyTwinkle 5s ease-in-out infinite;
        }
        @keyframes galaxyTwinkle {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
      `}</style>
      <div className={`relative ${className}`} style={{
        background: 'radial-gradient(ellipse at bottom, #1a1a2e 0%, #16213e 25%, #0f0c29 50%, #000000 100%)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        perspective: '1000px',
        perspectiveOrigin: '50% 50%'
      }}>
        {/* Aurora effect at edges */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute aurora-wave"
            style={{
              top: 0,
              left: '-10%',
              width: '120%',
              height: '30%',
              background: 'linear-gradient(180deg, rgba(34, 211, 238, 0.08) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 100%)',
              filter: 'blur(20px)',
              transform: 'skewY(-3deg)'
            }}
          />
          <div 
            className="absolute aurora-wave-2"
            style={{
              bottom: 0,
              right: '-10%',
              width: '120%',
              height: '25%',
              background: 'linear-gradient(0deg, rgba(236, 72, 153, 0.06) 0%, rgba(59, 130, 246, 0.04) 50%, transparent 100%)',
              filter: 'blur(25px)',
              transform: 'skewY(2deg)'
            }}
          />
        </div>

        {/* Deep space layer - furthest (tiny dim stars) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none depth-layer-far">
          {[...Array(50)].map((_, i) => (
            <div
              key={`star-far-${i}`}
              className="absolute rounded-full"
              style={{
                width: '1px',
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkleSlow ${4 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        {/* Galaxy Nebula Effects - mid depth */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none depth-layer-mid">
          {/* Purple nebula cloud 1 */}
          <div 
            className="absolute rounded-full opacity-25 blur-3xl nebula-drift"
            style={{
              width: '650px',
              height: '650px',
              background: 'radial-gradient(circle, rgba(138, 43, 226, 0.4) 0%, rgba(88, 28, 135, 0.15) 50%, transparent 70%)',
              top: '5%',
              left: '15%'
            }}
          />
          {/* Blue nebula cloud 2 */}
          <div 
            className="absolute rounded-full opacity-20 blur-3xl nebula-drift-reverse"
            style={{
              width: '550px',
              height: '550px',
              background: 'radial-gradient(circle, rgba(30, 144, 255, 0.35) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)',
              top: '55%',
              right: '10%'
            }}
          />
          {/* Pink nebula cloud 3 */}
          <div 
            className="absolute rounded-full opacity-18 blur-3xl nebula-drift"
            style={{
              width: '450px',
              height: '450px',
              background: 'radial-gradient(circle, rgba(255, 20, 147, 0.3) 0%, transparent 70%)',
              bottom: '15%',
              left: '45%',
              animationDelay: '5s'
            }}
          />
          {/* Cyan accent nebula */}
          <div 
            className="absolute rounded-full opacity-12 blur-3xl nebula-drift-reverse"
            style={{
              width: '350px',
              height: '350px',
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)',
              top: '40%',
              left: '5%'
            }}
          />
        </div>

        {/* Mid-layer stars - colored variety */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(35)].map((_, i) => (
            <div
              key={`star-mid-${i}`}
              className="absolute rounded-full animate-twinkle"
              style={{
                width: `${1.5 + Math.random() * 1.5}px`,
                height: `${1.5 + Math.random() * 1.5}px`,
                backgroundColor: i % 6 === 0 ? '#fef3c7' : i % 8 === 0 ? '#bfdbfe' : i % 10 === 0 ? '#c4b5fd' : 'white',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                boxShadow: `0 0 ${2 + Math.random() * 3}px 1px rgba(255, 255, 255, 0.5)`
              }}
            />
          ))}
        </div>

        {/* Foreground stars - brightest, closest */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={`star-near-${i}`}
              className="absolute rounded-full animate-twinkle"
              style={{
                width: `${3 + Math.random() * 2}px`,
                height: `${3 + Math.random() * 2}px`,
                backgroundColor: i % 3 === 0 ? '#fef3c7' : i % 4 === 0 ? '#e0e7ff' : 'white',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1.5 + Math.random() * 1.5}s`,
                boxShadow: '0 0 6px 3px rgba(255, 255, 255, 0.6), 0 0 12px 6px rgba(255, 255, 255, 0.2)'
              }}
            />
          ))}
          {/* Distant galaxy spiral */}
          <div 
            className="absolute rounded-full galaxy-rotate"
            style={{
              width: '700px',
              height: '700px',
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(255, 255, 255, 0.03) 10%, transparent 20%, rgba(139, 92, 246, 0.02) 30%, transparent 45%)',
              top: '-180px',
              right: '-180px',
              filter: 'blur(2px)',
              opacity: 0.6
            }}
          />
        </div>

        {/* Cosmic dust particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={`dust-${i}`}
              className="absolute rounded-full dust-float"
              style={{
                width: `${1 + Math.random() * 1.5}px`,
                height: `${1 + Math.random() * 1.5}px`,
                backgroundColor: `rgba(200, 200, 255, ${0.2 + Math.random() * 0.2})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${15 + Math.random() * 20}s`,
                animationDelay: `${Math.random() * 10}s`,
                filter: 'blur(0.5px)'
              }}
            />
          ))}
        </div>

        {/* Shooting stars with glowing trails */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={`shooting-star-${i}`}
              className="absolute shooting-star"
              style={{
                width: '3px',
                height: '3px',
                background: 'white',
                borderRadius: '50%',
                left: `${10 + i * 30}%`,
                top: `${5 + i * 18}%`,
                animationDuration: `${6 + i * 2}s`,
                animationDelay: `${i * 4}s`,
                boxShadow: '0 0 4px 2px rgba(255, 255, 255, 0.9), -10px 0 8px rgba(255, 255, 255, 0.4), -25px 0 15px rgba(255, 255, 255, 0.2), -45px 0 25px rgba(255, 255, 255, 0.1)'
              }}
            />
          ))}
        </div>

        {/* Light rays from corners */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute light-ray"
            style={{
              top: '-50%',
              left: '10%',
              width: '2px',
              height: '150%',
              background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.05) 60%, transparent 100%)',
              transform: 'rotate(25deg)',
              filter: 'blur(1px)'
            }}
          />
          <div 
            className="absolute light-ray-2"
            style={{
              top: '-50%',
              right: '20%',
              width: '1.5px',
              height: '140%',
              background: 'linear-gradient(180deg, transparent 0%, rgba(200,200,255,0.08) 40%, rgba(200,200,255,0.03) 70%, transparent 100%)',
              transform: 'rotate(-20deg)',
              filter: 'blur(1px)'
            }}
          />
          <div 
            className="absolute light-ray"
            style={{
              top: '-30%',
              left: '60%',
              width: '1px',
              height: '120%',
              background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.06) 35%, transparent 100%)',
              transform: 'rotate(15deg)',
              filter: 'blur(0.5px)',
              animationDelay: '2s'
            }}
          />
        </div>

        {/* Floating light orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={`orb-${i}`}
              className="absolute rounded-full light-orb"
              style={{
                width: `${8 + i * 4}px`,
                height: `${8 + i * 4}px`,
                background: `radial-gradient(circle, rgba(${180 + i * 15}, ${200 + i * 10}, 255, 0.3) 0%, transparent 70%)`,
                left: `${15 + i * 18}%`,
                top: `${20 + (i % 3) * 25}%`,
                filter: 'blur(2px)',
                animationDuration: `${8 + i * 3}s`,
                animationDelay: `${i * 2}s`
              }}
            />
          ))}
        </div>

        {/* Sparkle bursts */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={`sparkle-burst-${i}`}
              className="absolute sparkle-burst"
              style={{
                left: `${10 + i * 15}%`,
                top: `${15 + (i % 4) * 20}%`,
                animationDelay: `${i * 1.5}s`
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 0L6.8 5.2L12 6L6.8 6.8L6 12L5.2 6.8L0 6L5.2 5.2L6 0Z" fill="rgba(255,255,255,0.8)"/>
              </svg>
            </div>
          ))}
        </div>

        {/* Comet with long tail */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute comet" style={{ left: '-5%', top: '15%' }}>
            <div 
              className="absolute rounded-full"
              style={{
                width: '6px',
                height: '6px',
                background: 'white',
                boxShadow: '0 0 8px 4px rgba(255,255,255,0.8), 0 0 15px 8px rgba(200,220,255,0.4)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '6px',
                top: '2px',
                width: '80px',
                height: '2px',
                background: 'linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(200,220,255,0.3) 30%, rgba(150,180,255,0.1) 60%, transparent 100%)',
                filter: 'blur(1px)',
                transform: 'rotate(0deg)'
              }}
            />
          </div>
        </div>

        {/* Constellation pattern (subtle) */}
        <div className="absolute pointer-events-none constellation" style={{ top: '8%', left: '75%', opacity: 0.4 }}>
          <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
            <circle cx="10" cy="10" r="2" fill="white"/>
            <circle cx="40" cy="5" r="1.5" fill="white"/>
            <circle cx="70" cy="15" r="2" fill="white"/>
            <circle cx="55" cy="35" r="1.5" fill="white"/>
            <circle cx="25" cy="45" r="2" fill="white"/>
            <line x1="10" y1="10" x2="40" y2="5" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
            <line x1="40" y1="5" x2="70" y2="15" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
            <line x1="70" y1="15" x2="55" y2="35" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
            <line x1="55" y1="35" x2="25" y2="45" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
            <line x1="25" y1="45" x2="10" y2="10" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
          </svg>
        </div>

        {/* Tiny distant galaxies */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Spiral galaxy 1 */}
          <div className="absolute tiny-galaxy" style={{ top: '12%', left: '8%' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ opacity: 0.4 }}>
              <ellipse cx="10" cy="10" rx="8" ry="3" fill="url(#galaxy1)" transform="rotate(-30 10 10)"/>
              <circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.6)"/>
              <defs>
                <radialGradient id="galaxy1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.5)"/>
                  <stop offset="100%" stopColor="transparent"/>
                </radialGradient>
              </defs>
            </svg>
          </div>
          {/* Spiral galaxy 2 */}
          <div className="absolute tiny-galaxy" style={{ top: '25%', right: '12%', animationDelay: '1s' }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ opacity: 0.35 }}>
              <ellipse cx="10" cy="10" rx="7" ry="2.5" fill="url(#galaxy2)" transform="rotate(45 10 10)"/>
              <circle cx="10" cy="10" r="1.5" fill="rgba(200,220,255,0.6)"/>
              <defs>
                <radialGradient id="galaxy2">
                  <stop offset="0%" stopColor="rgba(200,220,255,0.5)"/>
                  <stop offset="100%" stopColor="transparent"/>
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full w-full flex flex-col">
          {children}
        </div>
      </div>
    </>
  );
}


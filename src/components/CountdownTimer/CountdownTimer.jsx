// import { useEffect, useState } from "react";

// const CountdownTimer = ({ initialCount = 3, onComplete }) => {
//   const [count, setCount] = useState(initialCount);

//   useEffect(() => {
//     if (count === 0) {
//       onComplete();
//       return;
//     }

//     const timer = setTimeout(() => {
//       setCount(count - 1);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [count, onComplete]);

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: "0px",
//         padding: "24px"
//       }}
//     >
//         {/* Countdown Number with magical animations */}
//         <div
//           key={count}
//           style={{
//             animation: "countdown-pop 0.5s ease-out",
//             flexShrink: 0,
//             marginBottom: "48px"
//           }}
//         >
//           <div style={{ position: "relative" }}>
//             {/* Multiple pulsing rings for magical effect */}
//             <div
//               style={{
//                 position: "absolute",
//                 inset: 0,
//                 borderRadius: "50%",
//                 background: "linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%)",
//                 animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
//                 opacity: 0.2
//               }}
//             />
//             <div
//               style={{
//                 position: "absolute",
//                 inset: 0,
//                 borderRadius: "50%",
//                 background: "linear-gradient(135deg, #A78BFA 0%, #F472B6 100%)",
//                 animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
//                 opacity: 0.25,
//                 animationDelay: "0.2s"
//               }}
//             />

//             {/* Main countdown circle with gradient */}
//             <div
//               style={{
//                 position: "relative",
//                 width: "224px",
//                 height: "224px",
//                 background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)",
//                 borderRadius: "50%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
//               }}
//             >
//               {/* Inner magical glow */}
//               <div
//                 style={{
//                   position: "absolute",
//                   inset: "24px",
//                   background: "linear-gradient(135deg, #93C5FD 0%, #C4B5FD 50%, #F9A8D4 100%)",
//                   borderRadius: "50%",
//                   opacity: 0.6,
//                   filter: "blur(32px)",
//                   animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
//                 }}
//               />

//               {/* The countdown number */}
//               <div
//                 style={{
//                   position: "relative",
//                   fontSize: "112px",
//                   fontWeight: 900,
//                   color: "white",
//                   filter: "drop-shadow(0 25px 25px rgba(0,0,0,0.15))",
//                   animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
//                 }}
//               >
//                 {count}
//               </div>
//             </div>

//             {/* Floating sparkles */}
//             <div
//               style={{
//                 position: "absolute",
//                 top: "-32px",
//                 right: "-32px",
//                 width: "64px",
//                 height: "64px",
//                 backgroundColor: "#FBBF24",
//                 borderRadius: "50%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 animation: "float 3s ease-in-out infinite",
//                 boxShadow: "0 10px 15px -3px rgba(251,191,36,0.4)"
//               }}
//             >
//               <span style={{ fontSize: "32px" }}>✨</span>
//             </div>
//             <div
//               style={{
//                 position: "absolute",
//                 top: "-32px",
//                 left: "-32px",
//                 width: "56px",
//                 height: "56px",
//                 backgroundColor: "#34D399",
//                 borderRadius: "50%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 animation: "float 3s ease-in-out infinite",
//                 animationDelay: "0.5s",
//                 boxShadow: "0 10px 15px -3px rgba(52,211,153,0.4)"
//               }}
//             >
//               <span style={{ fontSize: "28px" }}>💫</span>
//             </div>
//             <div
//               style={{
//                 position: "absolute",
//                 bottom: "-32px",
//                 right: "-32px",
//                 width: "56px",
//                 height: "56px",
//                 backgroundColor: "#F472B6",
//                 borderRadius: "50%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 animation: "float 3s ease-in-out infinite",
//                 animationDelay: "0.3s",
//                 boxShadow: "0 10px 15px -3px rgba(244,114,182,0.4)"
//               }}
//             >
//               <span style={{ fontSize: "28px" }}>⭐</span>
//             </div>
//             <div
//               style={{
//                 position: "absolute",
//                 bottom: "-32px",
//                 left: "-32px",
//                 width: "64px",
//                 height: "64px",
//                 backgroundColor: "#A78BFA",
//                 borderRadius: "50%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 animation: "float 3s ease-in-out infinite",
//                 animationDelay: "0.7s",
//                 boxShadow: "0 10px 15px -3px rgba(167,139,250,0.4)"
//               }}
//             >
//               <span style={{ fontSize: "32px" }}>🌟</span>
//             </div>

//             {/* Orbiting small stars */}
//             <div
//               style={{
//                 position: "absolute",
//                 inset: 0,
//                 animation: "spin-slow 10s linear infinite"
//               }}
//             >
//               <div
//                 style={{
//                   position: "absolute",
//                   top: 0,
//                   left: "50%",
//                   transform: "translate(-50%, -16px)",
//                   fontSize: "20px"
//                 }}
//               >
//                 ⭐
//               </div>
//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: 0,
//                   left: "50%",
//                   transform: "translate(-50%, 16px)",
//                   fontSize: "20px"
//                 }}
//               >
//                 ✨
//               </div>
//               <div
//                 style={{
//                   position: "absolute",
//                   left: 0,
//                   top: "50%",
//                   transform: "translate(-16px, -50%)",
//                   fontSize: "20px"
//                 }}
//               >
//                 💫
//               </div>
//               <div
//                 style={{
//                   position: "absolute",
//                   right: 0,
//                   top: "50%",
//                   transform: "translate(16px, -50%)",
//                   fontSize: "20px"
//                 }}
//               >
//                 🌟
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Progress dots - properly aligned */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             gap: "20px",
//             flexShrink: 0
//           }}
//         >
//           {[...Array(3)].map((_, index) => {
//             const colors = [
//               "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
//               "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
//               "linear-gradient(135deg, #EC4899 0%, #EF4444 100%)"
//             ];
//             const isActive = count <= index + 1;
//             return (
//               <div
//                 key={index}
//                 style={{
//                   borderRadius: "50%",
//                   transition: "all 0.5s ease-in-out",
//                   width: isActive ? "24px" : "16px",
//                   height: isActive ? "24px" : "16px",
//                   background: isActive ? colors[index] : "#D1D5DB",
//                   opacity: isActive ? 1 : 0.5,
//                   boxShadow: isActive ? "0 8px 16px rgba(0,0,0,0.2)" : "none",
//                   animation: isActive ? "bounce 1s ease-in-out infinite" : "none"
//                 }}
//               />
//             );
//           })}
//         </div>

//       <style>
//         {`
//           @keyframes countdown-pop {
//             0% {
//               transform: scale(0.8);
//               opacity: 0;
//             }
//             50% {
//               transform: scale(1.1);
//             }
//             100% {
//               transform: scale(1);
//               opacity: 1;
//             }
//           }

//           @keyframes ping {
//             75%, 100% {
//               transform: scale(2);
//               opacity: 0;
//             }
//           }

//           @keyframes pulse {
//             0%, 100% {
//               opacity: 1;
//             }
//             50% {
//               opacity: 0.7;
//             }
//           }

//           @keyframes float {
//             0%, 100% {
//               transform: translateY(0);
//             }
//             50% {
//               transform: translateY(-20px);
//             }
//           }

//           @keyframes spin-slow {
//             from {
//               transform: rotate(0deg);
//             }
//             to {
//               transform: rotate(360deg);
//             }
//           }

//           @keyframes bounce {
//             0%, 100% {
//               transform: translateY(0) scale(1.25);
//             }
//             50% {
//               transform: translateY(-10px) scale(1.25);
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default CountdownTimer;

import { useEffect, useState } from "react";

const CountdownTimer = ({ initialCount = 3, onComplete }) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    // <div className="flex-1 p-3 sm:p-4 md:p-5 bg-white/95 backdrop-blur-sm shadow-floating overflow-hidden flex flex-col rounded-2xl">
    <div className="flex-1 flex flex-col items-center justify-center space-y-4 sm:space-y-6 md:space-y-8 py-3 sm:py-4 md:py-6">
      {/* Countdown Number with magical animations */}
      <div key={count} className="animate-countdown-pop flex-shrink-0">
        <div className="relative">
          {/* Multiple pulsing rings for magical effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 animate-ping opacity-20"></div>
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 animate-ping opacity-25"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 to-blue-400 animate-ping opacity-15"
            style={{ animationDelay: "0.4s" }}
          ></div>

          {/* Main countdown circle with gradient - Responsive sizing */}
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
            {/* Inner magical glow */}
            <div className="absolute inset-4 sm:inset-6 bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 rounded-full opacity-60 blur-2xl animate-pulse"></div>

            {/* The countdown number - Responsive text */}
            <div className="relative text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white drop-shadow-2xl animate-pulse">
              {count}
            </div>
          </div>

          {/* Floating sparkles with different animations - Responsive sizing */}
          <div className="absolute -top-6 sm:-top-8 -right-6 sm:-right-8 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-yellow-400 rounded-full flex items-center justify-center animate-float shadow-xl">
            <span className="text-2xl sm:text-3xl md:text-4xl">✨</span>
          </div>
          <div
            className="absolute -top-6 sm:-top-8 -left-6 sm:-left-8 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-green-400 rounded-full flex items-center justify-center animate-float shadow-xl"
            style={{ animationDelay: "0.5s" }}
          >
            <span className="text-xl sm:text-2xl md:text-3xl">💫</span>
          </div>
          <div
            className="absolute -bottom-6 sm:-bottom-8 -right-6 sm:-right-8 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-pink-400 rounded-full flex items-center justify-center animate-float shadow-xl"
            style={{ animationDelay: "0.3s" }}
          >
            <span className="text-xl sm:text-2xl md:text-3xl">⭐</span>
          </div>
          <div
            className="absolute -bottom-6 sm:-bottom-8 -left-6 sm:-left-8 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-purple-400 rounded-full flex items-center justify-center animate-float shadow-xl"
            style={{ animationDelay: "0.7s" }}
          >
            <span className="text-2xl sm:text-3xl md:text-4xl">🌟</span>
          </div>

          {/* Orbiting small stars - Responsive sizing and positioning */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 sm:-translate-y-4 text-base sm:text-lg md:text-xl">
              ⭐
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3 sm:translate-y-4 text-base sm:text-lg md:text-xl">
              ✨
            </div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-3 sm:-translate-x-4 text-base sm:text-lg md:text-xl">
              💫
            </div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-3 sm:translate-x-4 text-base sm:text-lg md:text-xl">
              🌟
            </div>
          </div>
        </div>
      </div>

      {/* Progress dots with rainbow colors - Responsive sizing */}
      <div className="flex justify-center items-center gap-3 sm:gap-4 md:gap-5 flex-shrink-0">
        {[...Array(3)].map((_, index) => {
          const colors = [
            "from-blue-500 to-purple-500",
            "from-purple-500 to-pink-500",
            "from-pink-500 to-red-500",
          ];
          return (
            <div
              key={index}
              className={`rounded-full transition-all duration-500 transform ${
                count <= index + 1
                  ? `w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r ${colors[index]} scale-125 shadow-2xl animate-bounce`
                  : "w-3 h-3 sm:w-4 sm:h-4 bg-gray-300 opacity-50"
              }`}
            ></div>
          );
        })}
      </div>
    </div>
    // </div>
  );
};

export default CountdownTimer;

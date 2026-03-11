/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/lib/axl-explorations/src/**/*.{js,jsx,ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          glow: 'hsl(var(--primary-glow))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
          glow: 'hsl(var(--success-glow))'
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))'
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          foreground: 'hsl(var(--error-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        'purple-game': 'hsl(var(--purple-game))',
        'pink-game': 'hsl(var(--pink-game))',
        'teal-game': 'hsl(var(--teal-game))',
        'blue-game': 'hsl(var(--blue-game))',
        'green-game': 'hsl(var(--green-game))',
        'orange-game': 'hsl(var(--orange-game))',
        'sky-start': 'hsl(var(--sky-start))',
        'sky-end': 'hsl(var(--sky-end))',
      },
      backgroundImage: {
        'gradient-sky': 'var(--gradient-sky)',
        'gradient-rainbow': 'var(--gradient-rainbow)',
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-success': 'var(--gradient-success)',
        'gradient-warm': 'var(--gradient-warm)',
        'gradient-cool': 'var(--gradient-cool)',
        'gradient-playful': 'var(--gradient-playful)',
        'gradient-nature': 'var(--gradient-nature)'
      },
      boxShadow: {
        'magical': 'var(--shadow-magical)',
        'floating': 'var(--shadow-floating)',
        'success': 'var(--shadow-success)',
        'colorful': 'var(--shadow-colorful)'
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'float': 'float 3s ease-in-out infinite'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}






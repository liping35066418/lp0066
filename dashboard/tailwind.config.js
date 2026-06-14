/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'deep-space': '#0a1628',
        'space-2': '#0f1f3a',
        'space-3': '#162a4a',
        'neon-blue': '#00d4ff',
        'neon-cyan': '#00f5ff',
        'neon-green': '#00ff88',
        'neon-yellow': '#ffd93d',
        'neon-orange': '#ff6b35',
        'neon-red': '#ff3b5c',
        'neon-purple': '#8b5cf6',
        'glass': 'rgba(13, 27, 53, 0.6)',
        'glass-light': 'rgba(20, 42, 74, 0.45)',
      },
      fontFamily: {
        'tech': ['Orbitron', 'Rajdhani', 'sans-serif'],
        'display': ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'pulse-red': 'pulseRed 2s ease-in-out infinite',
        'glow-blue': 'glowBlue 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
      },
      keyframes: {
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 5px #ff3b5c, 0 0 10px #ff3b5c' },
          '50%': { boxShadow: '0 0 20px #ff3b5c, 0 0 40px #ff3b5c, 0 0 60px #ff3b5c' },
        },
        glowBlue: {
          '0%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.8), 0 0 40px rgba(0, 212, 255, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0, 212, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.05) 1px, transparent 1px)',
      },
      boxShadow: {
        'neon': '0 0 15px rgba(0, 212, 255, 0.3), inset 0 0 15px rgba(0, 212, 255, 0.05)',
        'neon-lg': '0 0 30px rgba(0, 212, 255, 0.4), inset 0 0 20px rgba(0, 212, 255, 0.08)',
        'card': '0 4px 30px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};

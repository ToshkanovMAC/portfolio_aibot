/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        bg2: '#111118',
        bg3: '#16161f',
        card: '#1a1a25',
        accent: '#6c63ff',
        accent2: '#a78bfa',
        accent3: '#38bdf8',
        text: '#f0f0ff',
        muted: '#8888aa',
        border: '#2a2a3a',
      },
      backgroundImage: {
        'grad': 'linear-gradient(135deg, #6c63ff 0%, #38bdf8 100%)',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      animation: {
        'blob-float': 'blobFloat 8s ease-in-out infinite alternate',
        'particle-float': 'particleFloat 3s ease-in-out infinite',
        'orbit-spin': 'orbitSpin 3s linear infinite',
        'orbit-spin-reverse': 'orbitSpin 2.5s linear infinite reverse',
        'orbit-spin-slow': 'orbitSpin 2s linear infinite',
        'dot-pulse': 'dotPulse 2s ease-in-out infinite',
        'sparkle-pulse': 'sparklePulse 2s ease-in-out infinite',
        'fade-up': 'fadeUp 0.7s forwards',
        'float-tech': 'floatTech 6s ease-in-out infinite',
        'float-tech-delayed': 'floatTech 8s ease-in-out infinite 1s',
        'float-tech-short': 'floatTech 7s ease-in-out infinite 0.5s',
        'float-tech-long': 'floatTech 9s ease-in-out infinite 1.5s',
        'float-tech-tw': 'floatTech 7.5s ease-in-out infinite 2s',
        'float-tech-node': 'floatTech 6.5s ease-in-out infinite 0.8s',
        'slow-spin': 'slowSpin 20s linear infinite',
        'slow-spin-reverse': 'slowSpin 15s linear infinite reverse',
      },
    },
  },
  plugins: [],
}

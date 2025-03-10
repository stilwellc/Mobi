import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'geist': ['var(--font-geist)'],
        'museo-moderno': ['var(--font-museo-moderno)'],
      },
      colors: {
        'mobi-burgundy': '#5A0028',
        'mobi-cream': '#F5F5F5',
        'mobi-black': '#1A1A1A',
      },
    },
  },
  plugins: [],
}

export default config 
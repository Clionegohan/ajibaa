import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'wa-red': '#B22222',
        'wa-orange': '#FF8C00',
        'wa-yellow': '#FFD700',
        'wa-green': '#228B22',
        'wa-blue': '#1E90FF',
        'wa-purple': '#9370DB',
        'wa-brown': '#8B4513',
        'wa-cream': '#FFF8DC',
        'wa-charcoal': '#36454F',
      },
      fontFamily: {
        'noto-jp': ['Noto Sans JP', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
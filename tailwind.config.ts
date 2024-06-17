import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  corePlugins: {
    preflight: true,
  },
  importart: '#__next',
  theme: {},
  plugins: [require('@tailwindcss/typography')],
};
export default config;

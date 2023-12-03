import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  corePlugins: {
    preflight: true,
  },
  importart: '#__next',
  theme: {},
  plugins: [],
};
export default config;

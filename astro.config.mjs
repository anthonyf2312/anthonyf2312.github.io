import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://anthonyf2312.github.io',
  devToolbar: { enabled: false },
  // A preview tool can assign a free port through PORT; a plain `npm run dev` keeps Astro's 4321.
  server: { port: Number(process.env.PORT) || 4321 },
});

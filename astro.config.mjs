// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: import.meta.env.DEV
        ? 'http://localhost:4321'
        : 'https://fascinating-semifreddo-0284e3.netlify.app', // TODO
    integrations: [
        sitemap(), 
    ],
});
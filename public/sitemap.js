// sitemap-generator.js

import { createSitemap } from 'sitemap';
import { writeFileSync } from 'fs';

const sm = createSitemap({
  hostname: 'https://www.codetoweb.tech',
  cacheTime: 600000,  // Cache the sitemap for 10 minutes
  urls: [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/about', changefreq: 'weekly', priority: 0.8 },
    { url: '/blog', changefreq: 'weekly', priority: 0.8 },
  ],
});

// Save the sitemap to a file in the 'public' directory
writeFileSync('./public/sitemap.xml', sm.toString());
import type { APIRoute } from 'astro';
import { site, absoluteUrl } from '../config/site';

export const GET: APIRoute = () => new Response(
  site.indexable
    ? `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`
    : 'User-agent: *\nDisallow: /\n',
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);

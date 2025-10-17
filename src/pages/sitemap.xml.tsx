import { GetServerSideProps } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://diagnoseme.vercel.app';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const pages = ['/', '/diagnose', '/about', '/contact'];

  const urls = pages
    .map((p) => {
      const url = `${SITE_URL.replace(/\/$/, '')}${p}`;
      return `  <url>\n    <loc>${url}</loc>\n  </url>`;
    })
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}

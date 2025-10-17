import Head from 'next/head';
import React from 'react';

const SITE_NAME = 'Diagnose Me';
// Default to your Vercel URL; can be overridden with NEXT_PUBLIC_SITE_URL
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://diagnoseme.vercel.app';
const DESCRIPTION = 'Diagnose Me - AI-powered preliminary health condition diagnosis from medical images.';

const SEO: React.FC<{ title?: string; description?: string; path?: string }> = ({
  title,
  description,
  path = '/',
}) => {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL.replace(/\/$/, '')}${path}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    'name': pageTitle,
    'url': url,
    'description': description || DESCRIPTION,
    'publisher': {
      '@type': 'Organization',
      'name': SITE_NAME,
      'url': SITE_URL,
    },
  };

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description || DESCRIPTION} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description || DESCRIPTION} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />

      {/* Primary canonical */}
      <link rel="canonical" href={url} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
};

export default SEO;

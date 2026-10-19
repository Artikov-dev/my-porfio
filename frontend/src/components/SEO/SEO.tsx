import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
}

export const SEO = ({ title, description, keywords, ogImage }: SEOProps) => {
  const { language } = useI18n();
  const { pathname } = useLocation();
  const canonicalUrl = `https://artikov.dev${pathname === '/' ? '/' : pathname}`;

  const { data: seoSettings } = useQuery({
    queryKey: ['seoSettings'],
    queryFn: async () => {
      const res = await api.get('/seo');
      return res.data.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const baseTitle = seoSettings?.title?.[language] || seoSettings?.title?.en || 'Roma Artikov | Portfolio';
  const baseDescription = seoSettings?.description?.[language] || seoSettings?.description?.en || 'Full Stack Engineer based in Uzbekistan';
  const baseKeywords = seoSettings?.keywords?.join(', ') || 'Roma Artikov, Full Stack, Developer, Uzbekistan';
  const baseOgImage = seoSettings?.og_image || 'https://artikov.dev/og_banner.jpg';

  const finalTitle = title ? `${title} | ${baseTitle.split('|')[0].trim()}` : baseTitle;
  const finalDescription = description || baseDescription;
  const finalKeywords = keywords ? keywords.join(', ') : baseKeywords;
  const finalOgImage = ogImage || baseOgImage;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:locale" content={language === 'uz' ? 'uz_UZ' : language === 'ru' ? 'ru_RU' : 'en_US'} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={finalOgImage} />
    </Helmet>
  );
};

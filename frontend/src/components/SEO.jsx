import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Componente SEO para gestión dinámica de metatags
 * Implementa las recomendaciones del informe de profesionalismo
 */
const SEO = ({
  title = "BlueSystem.io - Revolución Digital Empresarial",
  description = "No transformamos empresas. Redefinimos industrias. Consultoría SAP, IA y Automatización que catalizan revoluciones digitales.",
  keywords = "SAP, inteligencia artificial, automatización, consultoría empresarial, Office 365, desarrollo web, transformación digital",
  author = "BlueSystem.io",
  image = "/assets/og-image.jpg",
  url = "",
  type = "website",
  locale = "es_ES",
  siteName = "BlueSystem.io"
}) => {
  // URL completa para Open Graph
  const fullUrl = url ? `https://bluesystem.io${url}` : "https://bluesystem.io";
  const fullImage = image.startsWith('http') ? image : `https://bluesystem.io${image}`;

  return (
    <Helmet>
      {/* Metatags básicos */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="Spanish" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:creator" content="@BlueSystem_io" />
      
      {/* Enlaces canónicos */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Idiomas alternativos (preparado para internacionalización) */}
      <link rel="alternate" hrefLang="es" href={fullUrl} />
      <link rel="alternate" hrefLang="en" href={fullUrl.replace('bluesystem.io', 'bluesystem.io/en')} />
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />
      
      {/* Preconnect para optimización de rendimiento */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      
      {/* Manifest para PWA */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#1e40af" />
      
      {/* Favicons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    </Helmet>
  );
};

export default SEO; 
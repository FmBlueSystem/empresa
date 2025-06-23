import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Componente para Schema Markup (JSON-LD)
 * Implementa datos estructurados para mejorar SEO según recomendaciones del informe
 */
const SchemaMarkup = ({ type = 'organization', data = {} }) => {
  
  // Schema para la organización
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://bluesystem.io/#organization",
    "name": "BlueSystem.io",
    "alternateName": "BlueSystem",
    "url": "https://bluesystem.io",
    "logo": {
      "@type": "ImageObject",
      "url": "https://bluesystem.io/assets/logo.png",
      "width": 400,
      "height": 100
    },
    "description": "Revolución Digital Empresarial. Especialistas en SAP, IA y Automatización que catalizan transformaciones disruptivas.",
    "foundingDate": "2024",
    "founder": {
      "@type": "Person",
      "name": "Freddy Molina"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "MX",
      "addressLocality": "Ciudad de México"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+52-55-1234-5678",
      "contactType": "customer support",
      "availableLanguage": ["Spanish", "English"]
    },
    "sameAs": [
      "https://linkedin.com/company/bluesystem-io",
      "https://twitter.com/BlueSystem_io",
      "https://github.com/FmBlueSystem"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios de Transformación Digital",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Consultoría SAP",
            "description": "Implementación y optimización de soluciones SAP para maximizar eficiencia operativa"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Automatización con IA",
            "description": "Desarrollo de soluciones inteligentes que automatizan procesos empresariales"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Integraciones Office 365",
            "description": "Conectamos sistemas con el ecosistema Microsoft para colaboración eficiente"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Desarrollo Web Empresarial", 
            "description": "Aplicaciones web modernas, escalables y seguras para empresas"
          }
        }
      ]
    }
  };

  // Schema para página web
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `https://bluesystem.io${data.url || ''}#webpage`,
    "url": `https://bluesystem.io${data.url || ''}`,
    "name": data.title || "BlueSystem.io - Revolución Digital Empresarial",
    "description": data.description || "Especialistas en transformación digital que redefinimos industrias",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://bluesystem.io/#website"
    },
    "about": {
      "@id": "https://bluesystem.io/#organization"
    },
    "datePublished": data.datePublished || "2024-12-01",
    "dateModified": data.dateModified || "2024-12-01",
    "author": {
      "@id": "https://bluesystem.io/#organization"
    },
    "publisher": {
      "@id": "https://bluesystem.io/#organization"
    }
  };

  // Schema para el sitio web
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://bluesystem.io/#website",
    "url": "https://bluesystem.io",
    "name": "BlueSystem.io",
    "description": "Revolución Digital Empresarial",
    "publisher": {
      "@id": "https://bluesystem.io/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://bluesystem.io/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Schema para servicios específicos
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": data.serviceName || "Transformación Digital Empresarial",
    "description": data.serviceDescription || "Servicios especializados en SAP, IA y automatización",
    "provider": {
      "@id": "https://bluesystem.io/#organization"
    },
    "areaServed": {
      "@type": "Country",
      "name": "México"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios BlueSystem",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Consultoría SAP S/4HANA"
          }
        }
      ]
    }
  };

  // Schema para artículos de blog
  const articleSchema = data.article ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.article.title,
    "description": data.article.description,
    "author": {
      "@type": "Person",
      "name": data.article.author || "BlueSystem Team"
    },
    "publisher": {
      "@id": "https://bluesystem.io/#organization"
    },
    "datePublished": data.article.datePublished,
    "dateModified": data.article.dateModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://bluesystem.io${data.url}`
    },
    "image": data.article.image ? {
      "@type": "ImageObject",
      "url": data.article.image
    } : undefined
  } : null;

  // Seleccionar el schema apropiado
  let schema;
  switch (type) {
    case 'organization':
      schema = organizationSchema;
      break;
    case 'webpage':
      schema = webPageSchema;
      break;
    case 'website':
      schema = webSiteSchema;
      break;
    case 'service':
      schema = serviceSchema;
      break;
    case 'article':
      schema = articleSchema;
      break;
    default:
      schema = organizationSchema;
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema, null, 2)}
      </script>
    </Helmet>
  );
};

export default SchemaMarkup; 
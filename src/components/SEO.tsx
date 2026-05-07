import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { NATIVE_LANGUAGE_CODES } from "@/lib/languages";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  name?: string;
  image?: string;
}

const SEO = ({ 
  title, 
  description, 
  canonical, 
  type = "website", 
  name = "PDFNeo",
  image = "/og-image.png"
}: SEOProps) => {
  const { i18n } = useTranslation();
  const siteTitle = title ? `${title} | ${name}` : `${name} | Professional, Secure & Free PDF Tools`;
  const siteDescription = description || "Edit PDFs securely in your browser. No uploads, total privacy, and professional-grade performance. 100% free and open source.";
  const baseUrl = "https://pdfneo.vercel.app";
  const siteUrl = `${baseUrl}${canonical || ""}`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <link rel="canonical" href={siteUrl} />
      <html lang={i18n.language} />

      {/* Multilingual SEO (hreflang) */}
      <link rel="alternate" href={siteUrl} hrefLang="x-default" />
      {NATIVE_LANGUAGE_CODES.map((code) => (
        <link
          key={code}
          rel="alternate"
          href={`${siteUrl}${siteUrl.includes('?') ? '&' : '?'}lng=${code}`}
          hrefLang={code}
        />
      ))}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={`${baseUrl}${image}`} />
      <meta property="og:site_name" content={name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={`${baseUrl}${image}`} />
      <meta name="twitter:site" content="@PDFNeo" />
      <meta name="twitter:creator" content="@PDFNeo" />

      {/* JSON-LD structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === "website" ? "WebApplication" : "Article",
          "name": siteTitle,
          "description": siteDescription,
          "url": siteUrl,
          "image": `${baseUrl}${image}`,
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "author": {
            "@type": "Organization",
            "name": name,
            "url": baseUrl
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;

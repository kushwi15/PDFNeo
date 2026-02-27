import { Helmet } from "react-helmet-async";

interface SEOProps {
    title?: string;
    description?: string;
    canonical?: string;
    type?: string;
    name?: string;
}

const SEO = ({ title, description, canonical, type = "website", name = "PDFNeo" }: SEOProps) => {
    const siteTitle = title ? `${title} | ${name}` : `${name} | Professional & Secure PDF Tools`;
    const siteDescription = description || "Edit PDFs securely in your browser. No uploads, total privacy, and professional-grade performance.";
    const siteUrl = `https://pdfneo.vercel.app${canonical || ""}`;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{siteTitle}</title>
            <meta name="description" content={siteDescription} />
            <link rel="canonical" href={siteUrl} />

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={siteDescription} />
            <meta property="og:url" content={siteUrl} />

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={siteDescription} />

            {/* JSON-LD structured data */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": type === "website" ? "WebApplication" : "Article",
                    "name": siteTitle,
                    "description": siteDescription,
                    "url": siteUrl,
                    "applicationCategory": "BusinessApplication",
                    "operatingSystem": "Web",
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

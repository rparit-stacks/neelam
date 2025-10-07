export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Neelam Academy",
    description:
      "Neelam Academy offers premium ebooks and live courses for aspiring developers. Learn programming, web development, and more with expert guidance.",
    url: "https://helloneelammaam.com",
    logo: "https://helloneelammaam.com/logo.png",
    image: "https://helloneelammaam.com/logo.png",
    sameAs: [
      // Add your social media URLs here when available
      // "https://www.facebook.com/neelamacademy",
      // "https://twitter.com/neelamacademy",
      // "https://www.instagram.com/neelamacademy",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["English", "Hindi"],
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      offerCount: "10+",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Educational Products",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Ebooks",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Book",
                name: "Programming Ebooks",
              },
            },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Live Courses",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Course",
                name: "Web Development Courses",
              },
            },
          ],
        },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}


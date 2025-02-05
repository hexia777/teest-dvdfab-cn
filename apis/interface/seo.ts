export interface Seo {
  id: number
  title: string
  metaTitle: string
  metaDescription: string
  keywords: string
  structuredData: {
    name: string
    '@type': string
    offers: {
      '@type': string
      price: string
      priceCurrency: string
    }
    '@context': string
    aggregateRating: {
      '@type': string
      bestRating: string
      ratingCount: number
      ratingValue: string
      worstRating: string
    }
    operatingSystem: string
    applicationCategory: string
  }
  meta?: any[]
  script?: any[]
  metaImage: {
    data: any
  }
}

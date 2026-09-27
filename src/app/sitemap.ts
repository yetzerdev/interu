import type { MetadataRoute } from 'next'

const BASE = 'https://interu.kibo.company'

export default function sitemap(): MetadataRoute.Sitemap {
  const hoy = new Date()
  return [
    { url: `${BASE}/privacidad`, lastModified: hoy, changeFrequency: 'yearly', priority: 1 },
    { url: `${BASE}/terminos`, lastModified: hoy, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/ingresar`, lastModified: hoy, changeFrequency: 'monthly', priority: 0.3 },
  ]
}

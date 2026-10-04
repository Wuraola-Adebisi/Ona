import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://www.planwithona.com'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.svg`

const PAGE_META: Record<string, { title: string; description: string; type?: string }> = {
  '/': {
    title: 'Ona | Plan a trip that feels like yours',
    description:
      'Plan a trip around your pace, interests and priorities. Ona turns what you want from a trip into a practical day-by-day itinerary.',
  },
  '/plan': {
    title: 'Plan a Trip | Ona',
    description:
      'Tell Ona where you are going, how long you have and what you want from the trip. Get a day-by-day itinerary built around you.',
  },
  '/how-it-works': {
    title: 'How Ona Works | Personalized Travel Planning',
    description:
      'See how Ona turns your travel preferences into a coherent itinerary, from understanding your priorities to sequencing each day.',
  },
  '/examples': {
    title: 'Explore Trips | Ona',
    description:
      'Explore example trips and see how different travel preferences can shape an itinerary with Ona.',
  },
  '/about': {
    title: 'About Ona | Personalized Travel Planning',
    description:
      'Learn why Ona focuses on the traveller, not just the destination, and how it turns preferences and constraints into better trips.',
  },
  '/privacy': {
    title: 'Privacy Policy | Ona',
    description: 'Read the Ona privacy policy.',
  },
  '/terms': {
    title: 'Terms of Use | Ona',
    description: 'Read the Ona terms of use.',
  },
}

function setMeta(name: string, content: string) {
  let element = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null

  if (!element) {
    element = document.createElement('meta')
    element.name = name
    document.head.appendChild(element)
  }

  element.content = content
}

function setProperty(property: string, content: string) {
  let element = document.head.querySelector(
    `meta[property="${property}"]`,
  ) as HTMLMetaElement | null

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('property', property)
    document.head.appendChild(element)
  }

  element.content = content
}

function setCanonical(url: string) {
  let element = document.head.querySelector(
    'link[rel="canonical"]',
  ) as HTMLLinkElement | null

  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }

  element.href = url
}

export default function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = PAGE_META[pathname] ?? PAGE_META['/']
    const canonical = `${SITE_URL}${pathname === '/' ? '/' : pathname}`

    document.title = meta.title

    setMeta('description', meta.description)
    setMeta(
      'robots',
      pathname === '/privacy' || pathname === '/terms'
        ? 'noindex, follow'
        : 'index, follow',
    )

    setProperty('og:type', 'website')
    setProperty('og:site_name', 'Ona')
    setProperty('og:title', meta.title)
    setProperty('og:description', meta.description)
    setProperty('og:url', canonical)
    setProperty('og:image', DEFAULT_IMAGE)
    setProperty('og:image:type', 'image/svg+xml')
    setProperty('og:image:width', '1200')
    setProperty('og:image:height', '630')
    setProperty('og:image:alt', 'Ona — plan a trip that feels like yours')

    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', meta.title)
    setMeta('twitter:description', meta.description)
    setMeta('twitter:image', DEFAULT_IMAGE)
    setMeta('twitter:image:alt', 'Ona — plan a trip that feels like yours')

    setCanonical(canonical)

    const existing = document.getElementById('ona-structured-data')
    if (existing) existing.remove()

    const structuredData = document.createElement('script')
    structuredData.id = 'ona-structured-data'
    structuredData.type = 'application/ld+json'
    structuredData.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: 'Ona',
          url: SITE_URL,
          logo: DEFAULT_IMAGE,
        },
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          name: 'Ona',
          url: SITE_URL,
          publisher: { '@id': `${SITE_URL}/#organization` },
        },
        {
          '@type': 'WebApplication',
          '@id': `${SITE_URL}/#app`,
          name: 'Ona',
          url: SITE_URL,
          description: PAGE_META['/'].description,
          applicationCategory: 'TravelApplication',
          operatingSystem: 'Web',
          publisher: { '@id': `${SITE_URL}/#organization` },
        },
      ],
    })

    document.head.appendChild(structuredData)

    return () => {
      structuredData.remove()
    }
  }, [pathname])

  return null
}

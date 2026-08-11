// composables/useCfpContent.ts
//
// Fetches the "call-for-papers" content block from the CMS and parses the
// single HTML string into structured, typed data the page component can
// loop over — without touching the existing Tailwind markup/design.
//
// Install once: pnpm add node-html-parser
// (isomorphic-dompurify is already in your stack per the knowledgebase build)

import { parse, type HTMLElement } from 'node-html-parser'
import DOMPurify from 'isomorphic-dompurify'

export interface CfpHeader {
  title: string
  subtitle: string
}

export interface CfpMeta {
  date: string
  venue: string
  coOrganizedBy: string
  theme: string
}

export interface CfpTrack {
  name: string
  description: string
}

export interface CfpDate {
  label: string
  date: string
  urgent: boolean
}

export interface CfpContent {
  header: CfpHeader
  meta: CfpMeta
  overview: string[] // each entry is sanitized inner HTML of one <p>, for v-html
  tracks: CfpTrack[]
  dates: CfpDate[]
}

const EMPTY_CONTENT: CfpContent = {
  header: { title: '', subtitle: '' },
  meta: { date: '', venue: '', coOrganizedBy: '', theme: '' },
  overview: [],
  tracks: [],
  dates: [],
}

function textOf(el: HTMLElement | null | undefined): string {
  return (el?.text ?? '').replace(/\s+/g, ' ').trim()
}

function parseHeader(root: HTMLElement): CfpHeader {
  const section = root.querySelector('[data-section="header"]')
  return {
    title: textOf(section?.querySelector('h1')),
    subtitle: textOf(section?.querySelector('[data-role="subtitle"]')),
  }
}

function parseMeta(root: HTMLElement): CfpMeta {
  const section = root.querySelector('[data-section="meta"]')
  const meta: CfpMeta = { date: '', venue: '', coOrganizedBy: '', theme: '' }
  if (!section) return meta

  const labelMap: Record<string, keyof CfpMeta> = {
    date: 'date',
    venue: 'venue',
    'co-organized by': 'coOrganizedBy',
    theme: 'theme',
  }

  section.querySelectorAll('p').forEach((p) => {
    const strong = p.querySelector('strong')
    if (!strong) return
    const label = textOf(strong).replace(/:$/, '').toLowerCase()
    const key = labelMap[label]
    if (!key) return
    const full = textOf(p)
    meta[key] = full.slice(full.indexOf(':') + 1).trim()
  })

  return meta
}

function parseOverview(root: HTMLElement): string[] {
  const section = root.querySelector('[data-section="overview"]')
  if (!section) return []
  return section.querySelectorAll('p').map((p) => p.innerHTML.trim())
}

function parseTracks(root: HTMLElement): CfpTrack[] {
  const section = root.querySelector('[data-section="tracks"]')
  if (!section) return []
  return section.querySelectorAll('li').map((li) => {
    const strong = li.querySelector('strong')
    const name = textOf(strong).replace(/:$/, '')
    const full = textOf(li)
    const description = full.slice(full.indexOf(':') + 1).trim()
    return { name, description }
  })
}

function parseDates(root: HTMLElement): CfpDate[] {
  const section = root.querySelector('[data-section="important-dates"]')
  if (!section) return []
  return section
    .querySelectorAll('tr')
    .map((tr) => {
      const cells = tr.querySelectorAll('td')
      return {
        label: textOf(cells[0]),
        date: textOf(cells[1]),
        urgent: tr.getAttribute('data-urgent') === 'true',
      }
    })
    .filter((d) => d.label)
}

export function parseCfpContent(rawHtml: string): CfpContent {
  if (!rawHtml) return EMPTY_CONTENT

  // Keep our structural markers through sanitization — DOMPurify strips
  // unknown data-* attributes by default.
  const clean = DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ['data-section', 'data-role', 'data-urgent'],
  })
  const root = parse(clean)

  return {
    header: parseHeader(root),
    meta: parseMeta(root),
    overview: parseOverview(root),
    tracks: parseTracks(root),
    dates: parseDates(root),
  }
}

/**
 * Fetches and parses the Call for Papers content.
 *
 * ASSUMPTION: the API response shape is `{ content: string, ... }` — the
 * `content` field holding the raw HTML from the TinyMCE editor. Adjust the
 * `res.content` line below to match your actual API response key if it
 * differs (e.g. `res.data.content`).
 */
export function useCfpContent() {
  const config = useRuntimeConfig()

  return useAsyncData('cfp-content', async () => {
    const res = await $fetch<{ content: string }>(
      'https://sbacbackend.autofybusiness.com/website/website_api/content/call-for-papers',
      { params: { access_key: config.public.apiAccessKey } },
    )
    return parseCfpContent(res.content ?? '')
  })
}
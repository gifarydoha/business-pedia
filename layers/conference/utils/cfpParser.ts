import { parse, type HTMLElement } from "node-html-parser";
import DOMPurify from "isomorphic-dompurify";
import type {
  CfpContent,
  CfpHeader,
  CfpMeta,
  CfpTrack,
  CfpDate,
  CommitteeMember,
  CommitteeGroup,
  CommitteeContent,
} from "../types/cfp";

export const EMPTY_CONTENT: CfpContent = {
  header: { title: "", subtitle: "" },
  meta: { date: "", venue: "", coOrganizedBy: "", theme: "" },
  overview: [],
  tracks: [],
  dates: [],
};

const SANITIZE_OPTS = {
  ADD_ATTR: ["data-section", "data-role", "data-urgent", "data-track", "data-track-chair"],
};

function sanitizeAndParse(rawHtml: string): HTMLElement {
  try {
    const clean = DOMPurify.sanitize(rawHtml || "", SANITIZE_OPTS);
    return parse(clean);
  }
  catch (e) {
    console.error("[cfpParser] sanitizeAndParse failed — DOMPurify or node-html-parser crash:", e);
    return parse(""); // return empty root so callers get empty arrays/strings
  }
}

function stripTags(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}

function textOf(el: HTMLElement | null | undefined): string {
  return (el?.text ?? "").replace(/\s+/g, " ").trim();
}

function parseHeader(root: HTMLElement): CfpHeader {
  const section = root.querySelector("[data-section=\"header\"]");
  return {
    title: textOf(section?.querySelector("h1")),
    subtitle: textOf(section?.querySelector("[data-role=\"subtitle\"]")),
  };
}

function parseMeta(root: HTMLElement): CfpMeta {
  const section = root.querySelector("[data-section=\"meta\"]");
  const meta: CfpMeta = { date: "", venue: "", coOrganizedBy: "", theme: "" };
  if (!section) return meta;

  const labelMap: Record<string, keyof CfpMeta> = {
    "date": "date",
    "venue": "venue",
    "co-organized by": "coOrganizedBy",
    "theme": "theme",
  };

  section.querySelectorAll("p").forEach((p) => {
    const strong = p.querySelector("strong");
    if (!strong) return;
    const label = textOf(strong).replace(/:$/, "").toLowerCase();
    const key = labelMap[label];
    if (!key) return;
    const full = textOf(p);
    meta[key] = full.slice(full.indexOf(":") + 1).trim();
  });

  return meta;
}

function parseOverview(root: HTMLElement): string[] {
  const section = root.querySelector("[data-section=\"overview\"]");
  if (!section) return [];
  return section.querySelectorAll("p").map((p) => p.innerHTML.trim());
}

function parseTracks(root: HTMLElement): CfpTrack[] {
  const section = root.querySelector("[data-section=\"tracks\"]");
  if (!section) return [];
  return section.querySelectorAll("li").map((li) => {
    const strong = li.querySelector("strong");
    const name = textOf(strong).replace(/:$/, "");
    const full = textOf(li);
    const description = full.slice(full.indexOf(":") + 1).trim();
    return { name, description };
  });
}

function parseDates(root: HTMLElement): CfpDate[] {
  const section = root.querySelector("[data-section=\"important-dates\"]");
  if (!section) return [];
  return section
    .querySelectorAll("tr")
    .map((tr) => {
      const cells = tr.querySelectorAll("td");
      return {
        label: textOf(cells[0]),
        date: textOf(cells[1]),
        urgent: tr.getAttribute("data-urgent") === "true",
      };
    })
    .filter((d) => d.label);
}

export function parseCfpContent(rawHtml: string): CfpContent {
  if (!rawHtml) {
    console.warn("[cfpParser] parseCfpContent received empty HTML — API may have returned nothing.");
    return EMPTY_CONTENT;
  }
  try {
    const root = sanitizeAndParse(rawHtml);
    return {
      header: parseHeader(root),
      meta: parseMeta(root),
      overview: parseOverview(root),
      tracks: parseTracks(root),
      dates: parseDates(root),
    };
  }
  catch (e) {
    console.error("[cfpParser] parseCfpContent failed:", e);
    return EMPTY_CONTENT;
  }
}

// ---------------------------------------------------------------------------
// Standalone Tracks page (/tracks)
// ---------------------------------------------------------------------------

export function parseTracksContent(rawHtml: string): CfpTrack[] {
  if (!rawHtml) {
    console.warn("[cfpParser] parseTracksContent received empty HTML.");
    return [];
  }
  try {
    const root = sanitizeAndParse(rawHtml);
    return parseTracks(root);
  }
  catch (e) {
    console.error("[cfpParser] parseTracksContent failed:", e);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Standalone Committee page (/committee)
// ---------------------------------------------------------------------------

function parseMember(li: HTMLElement): CommitteeMember {
  const html = li.innerHTML;

  const nameMatch = html.match(/<strong>(.*?)<\/strong>/i);
  const name = nameMatch?.[1] ? stripTags(nameMatch[1]).trim() : "";

  const emailMatch = html.match(/mailto:([^"]+)"/i);
  const email = emailMatch?.[1] ? emailMatch[1].trim() : null;

  const rest = html
    .replace(/<strong>.*?<\/strong>/i, "")
    .replace(/<a[^>]*mailto:[^>]*>.*?<\/a>/i, "");

  const title = stripTags(rest)
    .replace(/^[,\s]+/, "")
    .replace(/\(\s*\)\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();

  return {
    name,
    title,
    email,
    isTrackChair: li.getAttribute("data-track-chair") === "true",
  };
}

function parseHonoraryChairs(root: HTMLElement): CommitteeMember[] {
  const section = root.querySelector("[data-section=\"honorary-chairs\"]");
  if (!section) return [];
  return section.querySelectorAll("li").map(parseMember);
}

function parseCoChairs(root: HTMLElement): CommitteeMember[] {
  const section = root.querySelector("[data-section=\"co-chairs\"]");
  if (!section) return [];
  return section.querySelectorAll("li").map(parseMember);
}

function parseCommitteeGroups(root: HTMLElement): CommitteeGroup[] {
  const section = root.querySelector("[data-section=\"committee-groups\"]");
  if (!section) return [];
  return section.querySelectorAll("[data-track]").map((groupEl) => {
    const trackName = groupEl.getAttribute("data-track") ?? textOf(groupEl.querySelector("h3"));
    const members = groupEl.querySelectorAll("li").map(parseMember);
    return { trackName, members };
  });
}

export function parseCommitteeContent(rawHtml: string): CommitteeContent {
  if (!rawHtml) {
    console.warn("[cfpParser] parseCommitteeContent received empty HTML.");
    return { honoraryChairs: [], coChairs: [], groups: [] };
  }
  try {
    const root = sanitizeAndParse(rawHtml);
    return {
      honoraryChairs: parseHonoraryChairs(root),
      coChairs: parseCoChairs(root),
      groups: parseCommitteeGroups(root),
    };
  }
  catch (e) {
    console.error("[cfpParser] parseCommitteeContent failed:", e);
    return { honoraryChairs: [], coChairs: [], groups: [] };
  }
}

import { parse, type HTMLElement } from "node-html-parser";
import DOMPurify from "isomorphic-dompurify";
import type { CfpContent, CfpHeader, CfpMeta, CfpTrack, CfpDate } from "../types/cfp";

export const EMPTY_CONTENT: CfpContent = {
  header: { title: "", subtitle: "" },
  meta: { date: "", venue: "", coOrganizedBy: "", theme: "" },
  overview: [],
  tracks: [],
  dates: [],
};

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
  if (!rawHtml) return EMPTY_CONTENT;

  // Keep our structural markers through sanitization — DOMPurify strips
  // unknown data-* attributes by default.
  const clean = DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ["data-section", "data-role", "data-urgent"],
  });
  const root = parse(clean);

  return {
    header: parseHeader(root),
    meta: parseMeta(root),
    overview: parseOverview(root),
    tracks: parseTracks(root),
    dates: parseDates(root),
  };
}
